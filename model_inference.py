"""Module responsible for loading the pretrained U-Net and running
inference.  The model is instantiated once on import and moved to the
available device (GPU if possible, otherwise CPU).

This file exposes a single user-facing function
`predict_segmentation(image)` which accepts an image in any of the
common formats (PIL Image, NumPy array) and returns a 2D NumPy array
containing the integer class label for each pixel.
"""

import numpy as np
import torch
from torchvision import transforms
from unet import UNet

# device selection: GPU if available, else CPU
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# instantiate and load weights
_model = UNet(in_channels=11, out_channels=2)
# note: replace `model.pth` path with the correct one in your project
torch_path = "model.pth"
try:
    _model.load_state_dict(torch.load(torch_path, map_location=_device))
except Exception as e:
    # catch errors during loading so that importing the module doesn't
    # crash the whole application; the exception will be re-raised when
    # predict_segmentation() is called if the model isn't available.
    _model = None
    _load_exception = e
else:
    _model.to(_device)
    _model.eval()

# normalization constants (per-channel)
bands_mean = [0.05197577, 0.04783991, 0.04056812,
              0.03163572, 0.02972606, 0.03457443,
              0.03875053, 0.03436435, 0.0392113,
              0.02358126, 0.01588816]

bands_std = [0.04725893, 0.04743808, 0.04699043,
             0.04967381, 0.04946782, 0.06458357,
             0.07594915, 0.07120246, 0.08251058,
             0.05111466, 0.03524419]

# build a torchvision transform that converts a numpy array / PIL image
# into a normalized tensor with shape (C,H,W).  We'll perform NaN
# handling explicitly before converting to torch.
_preprocess_transform = transforms.Compose([
    transforms.ToTensor(),  # scales to [0,1] and moves channel dim first
    transforms.Normalize(mean=bands_mean, std=bands_std)
])


def _prepare_image(input_image):
    """Convert an image to a normalized torch tensor ready for inference.

    Accepts:
    * a PIL.Image instance
    * a NumPy array of shape (H, W, C) or (C, H, W)

    The returned tensor has shape (1, C, H, W) and is on the correct
device.
    """

    # convert to numpy for generic handling
    if isinstance(input_image, np.ndarray):
        arr = input_image
    else:
        # assume PIL or other; let PIL handle
        arr = np.array(input_image)

    # ensure float32
    arr = arr.astype(np.float32)

    # move channel to last dimension if necessary
    if arr.ndim == 3 and arr.shape[0] in (1, 3, 11) and arr.shape[0] != arr.shape[2]:
        # probably (C,H,W) -> transpose
        arr = np.transpose(arr, (1, 2, 0))

    # handle NaNs by replacing with zero (safe since normalized later)
    if np.isnan(arr).any():
        arr = np.nan_to_num(arr, nan=0.0)

    # convert to PIL if transform expects it
    # ToTensor already handles numpy arrays, so we can feed arr directly

    tensor = _preprocess_transform(arr)
    # add batch dimension and move to device
    tensor = tensor.unsqueeze(0).to(_device)
    return tensor


def predict_segmentation(image):
    """Run the U-Net on a single image and return a segmentation mask.

    Parameters
    ----------
    image : PIL.Image or numpy.ndarray
        Input image.  It will be normalized, NaNs fixed, and converted to a
        tensor automatically.

    Returns
    -------
    numpy.ndarray
        Integer mask of shape (H, W) where each value corresponds to the
        predicted class index.
    """
    global _model
    if _model is None:
        # loading previously failed
        raise RuntimeError("Model failed to load") from _load_exception

    tensor = _prepare_image(image)
    with torch.no_grad():
        output = _model(tensor)
        # output: (1, num_classes, H, W)
        probs = torch.softmax(output, dim=1)
        mask = torch.argmax(probs, dim=1)  # (1, H, W)
        mask = mask.squeeze(0).cpu().numpy().astype(np.uint8)
    return mask

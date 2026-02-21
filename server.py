"""Lightweight Flask server that wraps the segmentation model and
exposes an HTTP API.  This file is optional but demonstrates how the
prediction function can be integrated with a mobile app or other client.

Run the server with:

    python server.py

and POST images to http://<host>:5000/predict
"""

import io
import base64
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np

from model_inference import predict_segmentation

app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    # Expect a multipart/form-data payload with an "image" file
    if 'image' not in request.files:
        return jsonify({'error': 'missing image file'}), 400

    file = request.files['image']
    try:
        pil_image = Image.open(file.stream).convert('RGB')
    except Exception as exc:
        return jsonify({'error': 'cannot open image', 'details': str(exc)}), 400

    # convert to numpy array so that our inference function can handle
    arr = np.array(pil_image)
    mask = predict_segmentation(arr)

    # encode mask as PNG and return base64 string so that clients can
    # display it easily without worrying about raw bytes
    mask_img = Image.fromarray(mask)
    buffered = io.BytesIO()
    mask_img.save(buffered, format='PNG')
    mask_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({'mask': mask_b64})


if __name__ == '__main__':
    print('Starting inference server on http://0.0.0.0:5000')
    app.run(host='0.0.0.0', port=5000)
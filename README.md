# VASUNDHARA
Environmental Intelligence Platform

## Setup

```bash
npm install
npm start
```

## Run on Device

1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. App will open in Expo Go

## Features

- Carbon Footprint Tracking
- Real-time River Monitoring
- Satellite Debris Detection
- Cleanup Coordination
- Environmental Alerts

### Semantic Segmentation Module

The mobile app is now capable of sending images to a PyTorch U‑Net
backend for pixelwise semantic segmentation.  The backend consists of
`unet.py`, `model_inference.py` and an optional Flask wrapper
(`server.py`).

* Run the server with `python server.py` (requires `torch`, `flask`,
  `numpy` and `Pillow`).
* Install the Expo image picker in the frontend:
  `expo install expo-image-picker`.
* Open the new **Segmentation** screen from the menu, pick an image and
  tap *Run prediction*; a mask is returned from the server and rendered
  on screen.

The model weights (`model.pth`) should be placed in the project root.

## Design

Premium black & white interface with minimal eco accents.
Built for environmental command center experience.

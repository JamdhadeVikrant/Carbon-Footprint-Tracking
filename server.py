"""
Production-ready lightweight Flask inference server
Run:
    python server.py
POST image to:
    http://<host>:5000/predict
"""

import io
import base64
import time
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify

from model_inference import predict_segmentation

app = Flask(__name__)


# =========================================================
# HEALTH CHECK ROUTE
# =========================================================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "service": "segmentation-api"
    })


# =========================================================
# PREDICTION ROUTE
# =========================================================
@app.route("/predict", methods=["POST"])
def predict():

    start = time.time()

    # ---------- validate file ----------
    if "image" not in request.files:
        return jsonify({"error": "image file missing"}), 400

    file = request.files["image"]

    if file.filename.strip() == "":
        return jsonify({"error": "empty filename"}), 400

    # ---------- load image ----------
    try:
        img = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({
            "error": "invalid image",
            "details": str(e)
        }), 400

    # ---------- inference ----------
    try:
        arr = np.array(img)
        mask = predict_segmentation(arr)
    except Exception as e:
        return jsonify({
            "error": "model inference failed",
            "details": str(e)
        }), 500

    # ---------- encode mask ----------
    try:
        mask_img = Image.fromarray(mask.astype("uint8"))
        buffer = io.BytesIO()
        mask_img.save(buffer, format="PNG")
        encoded_mask = base64.b64encode(buffer.getvalue()).decode()
    except Exception as e:
        return jsonify({
            "error": "mask encoding failed",
            "details": str(e)
        }), 500

    # ---------- response ----------
    return jsonify({
        "success": True,
        "mask": encoded_mask,
        "shape": list(mask.shape),
        "processing_time": round(time.time() - start, 3)
    })


# =========================================================
# GLOBAL ERROR HANDLER
# =========================================================
@app.errorhandler(Exception)
def global_error(e):
    return jsonify({
        "error": "internal server error",
        "details": str(e)
    }), 500


# =========================================================
# SERVER START
# =========================================================
if __name__ == "__main__":
    print("\n Segmentation API running")
    print(" http://0.0.0.0:5000\n")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        threaded=True
    )

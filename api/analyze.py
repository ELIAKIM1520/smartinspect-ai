from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
from transformers import pipeline

app = FastAPI()
detector = pipeline("object-detection", model="facebook/detr-resnet-50")

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    detections = detector(image)
    has_helmet = any("helmet" in d["label"].lower() for d in detections)
    return {"compliant": has_helmet, "detections": detections}


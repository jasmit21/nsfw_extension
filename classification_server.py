from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from fastapi import FastAPI, Request
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.google.com"],  # or specify other origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline("zero-shot-classification", model="MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli")

@app.post("/classify_text")
async def classify_text(request: Request):
    try:
        body = await request.json()
        texts = body.get('texts', [])
        labels = body.get('labels', ["Violent", "Neutral", "Sexually explicit"])
        results = []

        for text in texts:
            result = classifier(text, labels , max_new_tokens=50)
            results.append({
                "text": text,
                "category": result["labels"][0],
                "scores": result["scores"][0]
            })

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

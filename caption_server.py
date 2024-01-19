from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import requests
from io import BytesIO
import uvicorn
from fastapi import FastAPI, Request

app = FastAPI()

# CORS setup
origins = ["*"] # or specify domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the BLIP model for image captioning
blip_model_name = "Salesforce/blip-image-captioning-large"
blip_pipeline = pipeline("image-to-text", model=blip_model_name)

classification_server_url = 'http://localhost:8001/classify_text'

@app.post("/generate_caption_and_classify")
async def generate_caption_and_classify(request: Request):
    try:
        body = await request.json()
        image_urls = body.get('image_urls', [])
        results = []

        for index, image_url in enumerate(image_urls):
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content))
            caption = blip_pipeline(image, max_new_tokens=50)[0]['generated_text']
            print(f"Caption generated for image {index + 1}/{len(image_urls)}.")

            classification_response = requests.post(
                classification_server_url,
                json={"texts": [caption]}
            )
            classification_result = classification_response.json()[0]
            print(f"Image {index + 1}/{len(image_urls)} classified successfully.")

            results.append({
                "image_url": image_url,
                "caption": caption,
                "classification": classification_result
            })

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

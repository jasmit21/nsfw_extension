from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import requests
from PIL import Image
from decouple import config
from io import BytesIO
app = Flask(__name__)
CORS(app, resources={r"/generate_caption": {"origins": "https://www.google.com"}})
CORS(app)

# Initialize the pipeline for image captioning
model_name = config('BLIP_MODEL_NAME', default="Salesforce/blip-image-captioning-large")
pipe = pipeline("image-to-text", model=model_name)

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    try:
        print("Received a request to generate captions for images.")
        image_urls = request.json.get('image_urls')
        results = []

        for image_url in image_urls:
            # Load the image from the URL
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content))

            # Use the pipeline to generate the caption
            generated_caption = pipe(image)[0]['generated_text']

            # Create a dictionary with image URL and caption
            result_item = {
                "image_url": image_url,
                "caption": generated_caption
            }

            results.append(result_item)

        print("===================results===========")
        print(results)
        return jsonify(results)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()

from flask import Flask, request, jsonify
from transformers import pipeline
from PIL import Image
import requests
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/generate_caption_and_classify": {"origins": "*"}})
CORS(app)

# Initialize the BLIP model for image captioning
blip_model_name = "Salesforce/blip-image-captioning-large"
blip_pipeline = pipeline("image-to-text", model=blip_model_name)

# URL of the classification server
classification_server_url = 'http://localhost:5001/classify_text'

@app.route('/generate_caption_and_classify', methods=['POST'])
def generate_caption_and_classify():
    try:
        image_urls = request.json.get('image_urls', [])
        results = []

        for image_url in image_urls:
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content))
            caption = blip_pipeline(image)[0]['generated_text']

            # Send caption to classification server
            classification_response = requests.post(
                classification_server_url,
                json={"texts": [caption]}
            )
            classification_result = classification_response.json()[0]

            results.append({
                "image_url": image_url,
                "caption": caption,
                "classification": classification_result
            })

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)

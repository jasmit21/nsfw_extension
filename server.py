from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoProcessor, AutoModelForCausalLM, AutoTokenizer
import requests
from PIL import Image

app = Flask(__name__)
# CORS(app, resources={r"/generate_caption": {"origins": "https://www.google.com"}})
CORS(app)


# Path to the directory containing the model files
model_folder_path = r'C:\Users\ravit\OneDrive\Documents\nsfw_filter\nsfw_extension\models'


# Load the tokenizer and model from the folder


@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    try:
        print("Received a request to generate a caption for the image.")
        image_url = request.json.get('image_url')
        print(image_url)

        tokenizer = AutoTokenizer.from_pretrained(model_folder_path)
        model = AutoModelForCausalLM.from_pretrained(model_folder_path)

        processor = AutoProcessor.from_pretrained(model_folder_path)
        # model = AutoModelForCausalLM.from_pretrained("nsfw_extension/Models")
        # tokenizer = AutoTokenizer.from_pretrained("nsfw_extension/Models")

        image = Image.open(requests.get(image_url, stream=True).raw)
        pixel_values = processor(images=image, return_tensors="pt").pixel_values

        generated_ids = model.generate(pixel_values=pixel_values, max_length=50)
        generated_caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

        return jsonify({'caption': generated_caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
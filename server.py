from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from transformers import AutoProcessor, AutoModelForCausalLM, AutoTokenizer
import requests
from PIL import Image
from decouple import config

app = Flask(__name__)
CORS(app, resources={r"/generate_caption": {"origins": "https://www.google.com"}})
CORS(app)

model_folder_path = config('MODEL_FOLDER_PATH')
zsc_model_path = config('ZSC_MODEL_PATH')

candidate_labels = ["Violent", "Neutral", "Sexually explicit"]

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    try:
        print("Received a request to generate captions for images.")
        image_urls = request.json.get('image_urls')
        results = []

        tokenizer = AutoTokenizer.from_pretrained(model_folder_path)
        model = AutoModelForCausalLM.from_pretrained(model_folder_path)
        processor = AutoProcessor.from_pretrained(model_folder_path)
        
        for image_url in image_urls:
            image = Image.open(requests.get(image_url, stream=True).raw)
            pixel_values = processor(images=image, return_tensors="pt").pixel_values

            generated_ids = model.generate(pixel_values=pixel_values, max_length=50)
            generated_caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

            classifier = pipeline("zero-shot-classification", model=zsc_model_path)
            output = classifier(generated_caption, candidate_labels, multi_label=False)
            print("============output============\n")
            print(output)

            # Create a dictionary with image URL, caption, and score
            result_item = {
                "image_url": image_url,
                "caption": output['sequence'],
                "scores": output['scores'][0],
                "label": output['labels'][0],
            }

            results.append(result_item)
            # results.append(output)

        print("===================results===========")
        print(results) 
        return jsonify(results)
    except Exception as e:      
        print(e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()

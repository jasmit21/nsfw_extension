from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/generate_caption": {"origins": "https://www.google.com"}})
CORS(app)

# Load the BERT model using pipeline for zero-shot classification
classifier = pipeline("zero-shot-classification", model="MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli")

@app.route('/classify_text', methods=['POST'])
def classify_text():
    try:
        data = request.json
        texts = data.get('texts', [])
        labels = data.get('labels', ["Violent", "Neutral", "Sexually explicit"])
        results = []

        for text in texts:
            result = classifier(text, labels)
            results.append({
                "text": text, 
                "category": result["labels"][0],  # The top label
                "scores": result["scores"][0]  # The score for the top label
            })

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)

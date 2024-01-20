from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from transformers import AutoProcessor, AutoModelForCausalLM, AutoTokenizer
import requests
from PIL import Image


model_folder_path = r'C:\Users\ravit\OneDrive\Documents\nsfw_filter\nsfw_extension\models'
zsc_model_path = r'C:\Users\ravit\OneDrive\Documents\nsfw_filter\nsfw_extension\zscmodel'
candidate_labels = ["Violent", "Neutral", "Sexually explicit" ]

image_url = r"C:\Users\ravit\OneDrive\Documents\nsfw_filter\nsfw_extension\download.jpeg"
print(image_url)

tokenizer = AutoTokenizer.from_pretrained(model_folder_path)
model = AutoModelForCausalLM.from_pretrained(model_folder_path)

processor = AutoProcessor.from_pretrained(model_folder_path)
        
# image = Image.open(requests.get(image_url, stream=True).raw)
image = Image.open(image_url)

pixel_values = processor(images=image, return_tensors="pt").pixel_values

generated_ids = model.generate(pixel_values=pixel_values, max_length=50)
generated_caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

classifier = pipeline("zero-shot-classification", model=zsc_model_path)
output = classifier(generated_caption, candidate_labels, multi_label=False)
print(output)
    
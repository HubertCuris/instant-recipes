from flask import Flask, request, jsonify
from flask_cors import CORS
import openai  # Importer la bibliothèque OpenAI
import requests

app = Flask(__name__)

# Configure CORS to allow requests from specific origins
cors = CORS(app, resources={
    r"/generate-recipe": {
        "origins": ["https://hubertcuris.github.io", "http://localhost:5000"],
        "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]
    }
})

# Remplacez par l'URL de votre modèle GPT personnalisé
CUSTOM_GPT_API_URL = 'g-ki8Z1kUh3-instantrecipes'
API_KEY = 'sk-proj-xe4K1wsEnF7piGPv9lzCT3BlbkFJStjaYWZvrmZ68KI6YUZi'

# Configurer la clé API pour OpenAI
openai.api_key = API_KEY

@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.get_json()
    prompts = [
        f"Do you have some time? {data['0']}",
        f"How do you feel? {data['1']}",
        f"Which budget? {data['2']}",
        f"Do you have some allergies? {data['3']}",
        f"Which kind of food you don't want to have? {', '.join(data['4'])}",
        f"Which equipment do you want to include? {', '.join(data['5'])}"
    ]
    
    prompt = "Generate a recipe based on the following details:\n" + "\n".join(prompts)

    response = openai.Completion.create(
        engine="text-davinci-003",  # Remplacez par le moteur que vous utilisez
        prompt=prompt,
        max_tokens=150,
        temperature=0.7
    )

    if response.choices:
        return jsonify(response.choices[0].text.strip())
    else:
        return jsonify({"error": "Failed to generate recipe"}), 500

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app, resources={r"/generate-recipe": {"origins": "https://hubertcuris.github.io"}})
# Remplacez 'your_api_key_here' par votre clé API réelle
openai.api_key = 'sk-proj-xe4K1wsEnF7piGPv9lzCT3BlbkFJStjaYWZvrmZ68KI6YUZi'

# Utilisez l'ID de votre modèle GPT dédié
model_id = "g-ki8Z1kUh3-instantrecipes"

@app.route('/generate-recipe', methods=['POST'])
def generate_recipe(environ, start_response):
  if environ['REQUEST_METHOD'] == 'OPTIONS':
    start_response(
      '200 OK',
      [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Headers', 'Authorization, Content-Type'),
        ('Access-Control-Allow-Methods', 'POST'),
      ]
    )
    return ''
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

    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        'prompt': prompt,
        'max_tokens': 150,
        'temperature': 0.7
    }

    response = requests.post(CUSTOM_GPT_API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return jsonify(response.json()['choices'][0]['text'].strip())
    else:
        return jsonify({"error": "Failed to generate recipe"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)

from src import agent
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

@app.route("/api/prompt", methods=["POST"])
async def handle_user_prompt():
    data = request.get_json()
    print(f"Got request with data: {data}")

    history: str | None = data.get("history")
    print(f"Got history: {history}")

    prompt: str | None = data.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    assert prompt is not None
    prompt = prompt.strip()
    print(f"Got prompt: {prompt}")

    user_id: str | None = request.cookies.get("user_id")
    if not user_id:
        return jsonify({"error": "No user ID provided"}), 400
    assert user_id is not None
    user_id = user_id.strip()
    print(f"Got user ID: {user_id}")

    print("Sending prompt to agent...")
    response = await agent.prompt(int(user_id), history, prompt)
    print(f"Got response from agent: {response}")

    response = {
        "response": f"You said: {prompt}"
    }
    return jsonify(response), 200









# Iris Ding
# Faye Stover
# Alex Fagundez alexvfagundez@gmail.com
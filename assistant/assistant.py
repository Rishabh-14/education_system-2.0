import json
from openai import OpenAI
import os
assistant = [{'id': 'asst_GW0wpM1ZAeeUhOdpBFxBIC5r', 'created_at': 1716200659, 'description': None, 'instructions': 'You are a personal math tutor. Answer questions briefly, in a sentence or less.', 'metadata': {}, 'model': 'gpt-4-1106-preview', 'name': 'Math Tutor', 'object': 'assistant', 'tools': [], 'response_format': 'auto', 'temperature': 1.0, 'tool_resources': {'code_interpreter': None, 'file_search': None}, 'top_p': 1.0}]
def show_json(obj):
    print(json.loads(obj.model_dump_json()))

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "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"))

def createAssistant():
    assistant = client.beta.assistants.create(
        name="Math Tutor",
        instructions="You are a personal math tutor. Answer questions briefly, in a sentence or less.",
        model="gpt-4-1106-preview",
    )
    show_json(assistant)

def further():
    thread = client.beta.threads.create()
    show_json(thread)

    # Add messages
    message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I need to solve the equation `3x + 11 = 14`. Can you help me?",
    )
    show_json(message)

    run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
    )
    show_json(run)

further()
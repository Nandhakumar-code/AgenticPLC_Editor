import urllib.request
import urllib.error
import json

url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
# Using an invalid key would return 400. Let's assume we use a valid key but the model doesn't exist.
# Since I don't have a valid key, I can't test it directly.
# But I can check if the Google Gemini OpenAI docs require a specific model string format.

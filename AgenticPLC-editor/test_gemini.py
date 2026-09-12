import urllib.request
import urllib.error
import json

url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
headers = {
    "Content-Type": "application/json"
}
data = json.dumps({
    "model": "gemini-1.5-flash",
    "messages": [{"role": "user", "content": "hi"}]
}).encode("utf-8")

req = urllib.request.Request(url, data=data, headers=headers)
try:
    response = urllib.request.urlopen(req)
    print(response.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print(e.read().decode("utf-8"))
except Exception as e:
    print("Error:", str(e))

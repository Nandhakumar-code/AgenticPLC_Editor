import os

index_path = r"C:\Users\ELCOT\AppData\Local\Programs\AgenticPLC-editor\resources\app\dist\renderer\index.html"

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Trim the key and url when saving
content = content.replace("let keyToSave = elKey.value;", "let keyToSave = (elKey.value || '').trim();")
content = content.replace("url: elUrl.value,", "url: (elUrl.value || '').trim(),")
content = content.replace("model: elModel.value", "model: (elModel.value || '').trim()")

with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added trim to settings save logic.")

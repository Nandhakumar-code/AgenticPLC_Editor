import os

index_path = r"C:\Users\ELCOT\AppData\Local\Programs\AgenticPLC-editor\resources\app\dist\renderer\index.html"

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace gemini-1.5-pro with gemini-1.5-flash globally
content = content.replace("'gemini-1.5-pro'", "'gemini-1.5-flash'")
content = content.replace("gemini-1.5-pro", "gemini-1.5-flash")

with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated Gemini model to gemini-1.5-flash.")

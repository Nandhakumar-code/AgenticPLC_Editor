import subprocess
import os

preload_path = r"C:\Users\ELCOT\AppData\Local\Programs\AgenticPLC-editor\resources\app\dist\main\preload.js"
with open(preload_path, "r", encoding="utf-8") as f:
    content = f.read()

# Try different endings
endings = [
    "})()));",
    "}));",
    "}());",
    "})()}));",
    "}})()));",
    "},{"
]

base_content = content.split('return e.contextBridge.exposeInMainWorld("bridge",r)')[0] + 'return e.contextBridge.exposeInMainWorld("bridge",r)\n'

for ending in endings:
    test_content = base_content + ending
    with open("temp_test.js", "w", encoding="utf-8") as f:
        f.write(test_content)
    
    result = subprocess.run(["node", "-c", "temp_test.js"], capture_output=True, text=True)
    if result.returncode == 0:
        print("SUCCESS WITH ENDING:", ending)
        with open(preload_path, "w", encoding="utf-8") as f:
            f.write(test_content)
        break
else:
    print("None of the endings worked.")

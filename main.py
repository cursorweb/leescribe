import subprocess
from threading import Thread


HOST = "127.0.0.1"
TRANSLATE_PORT = "3000"


def launch_libre():
    subprocess.run(f"libretranslate --host {HOST} --port {TRANSLATE_PORT}")


libre_thread = Thread(target=launch_libre)
libre_thread.start()

import requests
import json


out = requests.request(
    "POST",
    f"http://{HOST}:{TRANSLATE_PORT}/translate",
    data=json.dumps(
        {
            "q": "hola, mundo!",
            "source": "es",
            "target": "en",
            "format": "text",
        }
    ),
    headers={"Content-Type": "application/json"},
)

print(out.json())

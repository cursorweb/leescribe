import subprocess
from threading import Thread


HOST = "127.0.0.1"
TRANSLATE_PORT = "3000"
SITE_PORT = "8080"


def launch_libre():
    subprocess.run(f"libretranslate --host {HOST} --port {TRANSLATE_PORT}")


libre_thread = Thread(target=launch_libre)
libre_thread.daemon = True
libre_thread.start()

from flask import Flask, render_template

app = Flask("app")


@app.route("/")
def main():
    return render_template("index.html", url=f"http://{HOST}:{TRANSLATE_PORT}")


print(f"Running on http://{HOST}:{SITE_PORT}")
app.run(host=HOST, port=SITE_PORT)

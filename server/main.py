from flask import Flask, render_template, send_from_directory

import os
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


app = Flask("app")
app.debug = True


@app.route("/")
def main1():
    return render_template("index.html", url="http://127.0.0.1:3000")


@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def main(path):
    if os.path.exists(os.path.join("dist", path)):
        return send_from_directory("dist", path)
    return send_from_directory("dist", "index.html")


@app.route("/kana")
def kana():
    return render_template("kana.html")


print(f"Running on http://{HOST}:{SITE_PORT}")
app.run(host=HOST, port=SITE_PORT)

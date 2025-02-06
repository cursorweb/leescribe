from flask import Flask, render_template, send_from_directory, request

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


@app.route("/legacy")
def main1():
    return render_template("index.jinja", url="http://127.0.0.1:3000")


@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def main(path):
    if os.path.exists(os.path.join("dist", path)):
        return send_from_directory("dist", path)
    return send_from_directory("dist", "index.html")


@app.route("/kana")
def kana():
    return render_template("kana.jinja")


@app.route("/anki", methods=["GET", "POST"])
def anki():
    if request.method == "GET":
        deck_name = request.args.get("deck")
        if deck_name:
            path = os.path.join("anki", deck_name)
        if deck_name == None or not os.path.exists(path):
            files = os.listdir("anki")
            return render_template("anki/decks.jinja", files=files)
        else:
            data = read_deck(path)
            return render_template("anki/anki.jinja", data=data)
    else:
        print(request.data)
        print(request.files)
        return "hello"


def read_deck(path: str):
    def jsonify(line: str):
        zh, en, *_ = line.split("\t")
        return {
            "prompt": zh,
            "answer": en,
        }

    with open(path, "r", encoding="utf8") as f:
        # print(jsonify(f.readlines()[3]))
        return [jsonify(line) for line in f.readlines()[3:]]


print(f"Running on http://{HOST}:{SITE_PORT}")
app.run(host=HOST, port=SITE_PORT)

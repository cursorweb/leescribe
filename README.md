# Leescribe
Read articles in other languages and translate words you don't know!
Save words in a growable list collection to review them.

Venv:
```sh
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Running:
```sh
libretranslate --port 3000
```

Updating:
```sh
libretranslate --load-only es,zh,en --update-models
```

Languages are stored in `C:\users\user\.local\share\argos-translate\packages`

## Todo
Import spanish from bbc mundo link

More better formatted document

Flashcard system (not sure if I want it long term)

Translate highlighted sentences

Read out loud

Switch font

Review

Writing Canvas

Font size

Typing practice

Optimization?
* Reduce spans
* Make more modular (probably optional but want to mod this)
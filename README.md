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
**Major**
* Redo main menu
* Save words
* Save articles
* Review articles, and reconstruct sentences with words (add a skip button for weird translations, also save overrides)
* Summarize article practice at end
* Switch to three page layout:
    * Left is text, top right is article, bottom right are translation features
    * Preview of translated text on bottom left (which can be minimized etc)

***

**Other**

Daily word of the day

Log in page, with selectable language, and then to homescreen with articles, etc

Link to ebook

Import spanish from bbc mundo link

More better formatted document

Flashcard system (not sure if I want it long term)

Translate highlighted sentences
* use a context menu for options (rather than an action bar?)

Read out loud

Review

Font size

Typing practice

Save texts

Summarization Practice

Break up into sections for more focused reading

Save Texts

"Blurting" method

Optimization?
* Reduce spans
* Make more modular (probably optional but want to mod this)

Kana Learner
* Random between draw the character and what is the character
* Random between romaji vs kana
* Review all
# Leescribe
Read articles in other languages and translate words you don't know!
Save words in a growable list collection to review them.


## Building
Venv:
```sh
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Development:
```
cd client
npm run dev
```
```
cd server
py main.py
```
*Don't forget `client/.env` sets the translater api location for now...*

Production:
```
cd client
npm run build
cd ../server
py main.py
```


## Libretranslate
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
**API**
Self host api using argostranslate instead of libretranslate wrapper
.env problem ^^

**Major**
* Back and forth translate to language and from language
* Save sentence flashcards
* Audio dictate someone says it and you have to retype

* Redo main menu
* Save words
* Save articles
* Review articles, and reconstruct sentences with words (add a skip button for weird translations, also save overrides)
* Summarize article practice at end

***

**Other**

Article display images, etc.

Daily word of the day

Log in page, with selectable language, and then to homescreen with articles, etc

Link to ebook

Import spanish from bbc mundo link

Flashcard system (not sure if I want it long term)

Read out loud

Review

Font size

Save texts

Summarization Practice

Break up into sections for more focused reading

Save Texts

"Blurting" method

Optimization?
* Make more modular (probably optional but want to mod this)

Kana Learner
* Random between draw the character and what is the character
* Random between romaji vs kana
* Review all


*I feel like using next.js/react would work so well here...*
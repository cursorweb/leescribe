const startBtn = document.querySelector(".start-btn");
const articleInput = document.querySelector(".article-input");

let languageModel;

startBtn.addEventListener("click", () => {
    // create handler
    const text = articleInput.value;
    languageModel = new Spanish(text);
});

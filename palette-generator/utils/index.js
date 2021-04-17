/**
 * Returns a random color hex string
 *
 * @returns {string}
 */
 function randomColor() {
    const hexValues = ['00', '33', '66', '99', 'CC', 'FF'];
    const color = "#" + Array.from({
        length: 3
    }, _ => hexValues[Math.floor(Math.random() * hexValues.length)]).join("");
    return color;
}

function getDomFromString(str){
    var domEl = document.createElement('div');
    domEl.innerHTML = str;

    return domEl.firstChild;
}

module.exports = {
    randomColor,
    getDomFromString
}
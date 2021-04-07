function getDomFromString(str){
    var domEl = document.createElement('div');
    domEl.innerHTML = str;

    return domEl.firstChild;
}

module.exports = {
    getDomFromString
}
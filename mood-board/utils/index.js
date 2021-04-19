const storage = require("uxp").storage;
const fs = storage.localFileSystem;

function getDomFromString(str){
    var domEl = document.createElement('div');
    domEl.innerHTML = str;

    return domEl.firstChild;
}

/**
 * Downloads an image from the photoUrl and
 * stores it in a temp file and returns the file
 *
 * @param {url} photoUrl
 */
 async function downloadImage(photoUrl) {
     console.log("Photo url: ", photoUrl);
    const photoObj = await xhrBinary(photoUrl);
    const tempFolder = await fs.getTemporaryFolder();
    const tempFileName = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
    const tempFile = await tempFolder.createFile(tempFileName, { overwrite: true });
    await tempFile.write(photoObj, { format: storage.formats.binary });
    return tempFile;
}

/**
 * Fetches a url with binary data and returns a promise
 * which resolves with this data
 *
 * @param {url} url
 */
async function xhrBinary(url) {
    const res = await fetch(url);
    if(!res.ok){
        const error = await res.json();
        if(error.message)
            throw Error(error.message);
        else
            throw Error(res.statusText);
    }
    const buffer = await res.arrayBuffer();
    const arr = new Uint8Array(buffer);
    return arr;
}

function getTopMostArtboardCoordinates(rootNode, Artboard){
    // TODO: Add logic for when there are no artboards
    // TODO: Add logic for when you can't add in anymore artboards

    const artboards = rootNode.children.filter(node => node instanceof Artboard);
    const artboardBounds = artboards.map(({globalBounds}) => globalBounds);

    let mostLeft, topMost;

    const xPositions = artboardBounds.map(({x}) => x);
    mostLeft = Math.min(...xPositions);

    const yPositions = artboardBounds.map(({y}) => y);
    topMost = Math.min(...yPositions);

    return {x: mostLeft, y: topMost};
}

function placeInParent(node, coords){
    coords = coords || node.parent.topLeftInParent;
    let nodeBounds = node.localBounds;
    let nodeTopLeft = {x: nodeBounds.x, y: nodeBounds.y};
    node.placeInParentCoordinates(nodeTopLeft, coords);
}

module.exports = {
    getDomFromString,
    downloadImage,
    getTopMostArtboardCoordinates,
    placeInParent
}
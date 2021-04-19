const scenegraph = require("scenegraph");
const { selection, Artboard, Color, Rectangle, ImageFill } = scenegraph;
const commands = require("commands");
const { editDocument } = require("application");
const { getTopMostArtboardCoordinates, placeInParent, downloadImage } = require("../utils/index");

const UIFramework = require('./ui-framework/index');
const CSS = require('./css');

let panel, ui;
const state = {
    selectedItems: [],
    mood: "spring"
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = /*html*/`
        ${ CSS }

        <div x-show="!selectedItems.length">
            <h1 class="opacity-65 text-lg px-0 mx-0 mt-3 mb-3">
                What are you in the mood for?
            </h1>

            <form id="generateBoardForm" class="mt-3">
                <input class="mb-3 w-full border border-dark-gray" placeholder="Tell us here" 
                    x-model="mood"
                />

                <div id="generateBoardButton" uxp-variant="cta" class="button">
                    Generate Mood Boards
                </div>
            </form>
        </div>
    `;

    ui = new UIFramework(panel, state, {
        methods: {
            getItems: function(){
                return "Loading... ";
            }
        }
    });

    return panel;
}

function createArboard(name, rootNode, relativeTo){
    // Create and artboard
    // Place it above all other artboards
    // 1. Find the most top left coordinates
    // Place 'arty' above it

    const arty = new Artboard();
    const height = 1080;
    arty.width = 1920;
    arty.height = height;
    arty.fill = new Color("white");
    arty.name = name;

    rootNode.addChild(arty);

    if(relativeTo){
        const { x, y } = relativeTo.boundsInParent;
        placeInParent(arty, { x: x + arty.width + 350, y});
    }
    else{
        const { x, y } = getTopMostArtboardCoordinates(rootNode, Artboard);
        placeInParent(arty, { x, y: y - height - 120 });
    }

    return arty;
}

function generateColorBoardItems(artboard, colors){
    const items = [{"x":0,"y":0,"width":1098,"height":1080,"type":"Rectangle"},{"x":790,"y":0,"width":616,"height":741,"type":"Rectangle"},{"x":1406,"y":0,"width":257,"height":741,"type":"Rectangle"},{"x":1663,"y":0,"width":257,"height":370.5,"type":"Rectangle"},{"x":1663,"y":370.5,"width":257,"height":370.5,"type":"Rectangle"},{"x":1098,"y":741,"width":308,"height":339,"type":"Rectangle"},{"x":1406,"y":741,"width":514,"height":339,"type":"Rectangle"},{"x":115,"y":783,"width":249,"height":188,"type":"Text"}];
    const colorNodes = items.map((item, index) => {
        const node = new scenegraph[item.type]();
        Object.assign(node, item);
            
            node.fill = index == 0 ? new Color("#000") : new Color(colors[index]);
    
            if(item.type == "Text"){
                node.text = "Color\nPalette";
                node.fill = new Color("white");
                node.fontFamily = "Helvetica Neue";
                node.fontSize = 80;
            }
    
            artboard.addChild(node);
        placeInParent(node, item);
        return node;
    });

    // selection.items = colorNodes;
    // commands.group(); 
}

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

async function fetchColors(tag = "autumn"){
    const res = await fetch(`https://www.colr.org/json/tags/${tag}`);

    let { colors } = await res.json();
    colors = colors.map(({hex}) => `#${hex}`);
    colors = shuffle(colors);

    return colors;
}

async function fetchImages(tag = "autumn"){
    const res = await fetch(`https://pixabay.com/api/?key=21212099-5ce492700f67b7fa572cd596c&q=${tag}&image_type=photo&editors_choice=true`);
    let { hits } = await res.json();
    let images = hits.map(({webformatURL}) => webformatURL);
    images = shuffle(images);
    
    return images;
}

function generateImageBoard(artboard){
    const items = [{"x":500.6773986816406,"y":-67.23038482666016,"width":457.9112548828125,"height":670.7069702148438},{"x":1588.6077880859375,"y":648.255859375,"width":457.9112548828125,"height":627.9035034179688},{"x":0,"y":-86,"width":457.9112548828125,"height":689.4765625},{"x":1087.930419921875,"y":648.255859375,"width":457.9112548828125,"height":559.7401733398438},{"x":1001.3547973632812,"y":-1.042777180671692,"width":632.105224609375,"height":604.5193481445312},{"x":1676.2264404296875,"y":-1.042777180671692,"width":642.5360107421875,"height":604.5193481445312},{"x":0,"y":648.255859375,"width":1051.422607421875,"height":559.7401733398438}];
    const images = items.map(item => {
        const image = new Rectangle();
        image.fill = new Color("#f5f5f5");
        Object.assign(image, item);
        artboard.addChild(image);
        
        placeInParent(image, item);
        return image;
    });

    selection.items = images;
    commands.group();
    const group = selection.items[0];
    const coords = {x: -85.72, y:-150};
    placeInParent(group, coords)
    group.rotateAround(-8, group.localCenterPoint);

    return images;
}

function generateMoodBoards(){
    editDocument({ editLabel: "Generating mood board" }, async function(selection, rootNode) {
        const [imageUrls, colors] = await Promise.all([
            fetchImages(ui.state.mood),
            fetchColors(ui.state.mood)
        ]);

        const imagesMoodBoard = createArboard("GeneratedImageMoodBoard", rootNode);
        const imageNodes = generateImageBoard(imagesMoodBoard);

        const colorsMoodBoard = createArboard("GeneratedColorMoodBoard", rootNode, imagesMoodBoard);
        generateColorBoardItems(colorsMoodBoard, colors);

        const imageFiles = await Promise.all(imageUrls.slice(0, imageNodes.length).map(downloadImage));
        imageNodes.forEach((node, index) => {
            node.fill = new ImageFill(imageFiles[index]);
        });
    });
}

function show(event) {
    if (!panel) {
        const createdPanel = create();
        event.node.appendChild(createdPanel);

        const moodForm = createdPanel.querySelector("#generateBoardForm");
        const submitButton = createdPanel.querySelector("#generateBoardButton");

        submitButton.addEventListener("click", generateMoodBoards);
        moodForm.addEventListener("submit", generateMoodBoards);
    };
}

function update() {
    if(ui) ui.setState('selectedItems', selection.items);

    // const children = selection.items[0].children.map((item) => {
    //     const {boundsInParent} = item;
    //     return {
    //         ...boundsInParent,
    //         type: item.constructor.name
    //     };
    // });

    // console.log("Images: ", JSON.stringify(children));
}

module.exports = {
    show, update
};
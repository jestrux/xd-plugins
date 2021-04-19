const { selection, Artboard, Color, Rectangle, Ellipse, Matrix, Group } = require("scenegraph");
const { getTopMostArtboardCoordinates, placeInParent } = require("../utils/index");

const UIFramework = require('./ui-framework/index');
const CSS = require('./css');

let panel, ui;
const state = {
    selectedItems: [],
    screen: "pick",
    mood: ""
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = /*html*/`
        ${ CSS }

        <div x-show="!selectedItems.length">
            <h1 class="opacity-65 text-lg px-0 mx-0 mt-3 mb-3">
                What are you in the mood for?
            </h1>

            <form class="mt-3">
                <input class="mb-3 w-full border border-dark-gray" placeholder="Tell us here" 
                    x-model="mood"
                />

                <div id="generateBoardButton" uxp-variant="cta" class="button">
                    Generate
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
        console.log("Relative to: ", relativeTo);
        const { x, y } = relativeTo.boundsInParent;
        placeInParent(arty, { x: x + arty.width + 350, y});
    }
    else{
        const { x, y } = getTopMostArtboardCoordinates(rootNode, Artboard);
        placeInParent(arty, { x, y: y - height - 120 });
    }

    return arty;
}

function generateColorBoardItems(colorBoard){
    const scenegraph = require("scenegraph");
    const items = [{"type":"Rectangle","coords":{"x":0,"y":0},"width":1098,"height":1080},{"type":"Rectangle","coords":{"x":790,"y":0},"width":616,"height":741},{"type":"Rectangle","coords":{"x":1406,"y":0},"width":257,"height":741},{"type":"Rectangle","coords":{"x":1663,"y":0},"width":257,"height":370.5},{"type":"Rectangle","coords":{"x":1663,"y":370.5},"width":257,"height":370.5},{"type":"Rectangle","coords":{"x":1098,"y":741},"width":308,"height":339},{"type":"Rectangle","coords":{"x":1406,"y":741},"width":514,"height":339},{"type":"Text","coords":{"x":115,"y":783}}];

    return items.map(({type, coords, width, height}) => {
        const item = new scenegraph[type]();

        if(type == "Rectangle"){
            item.fill = new Color("black");
            item.width = width;
            item.height = height;
        }

        else if(type == "Text"){
            item.fill = new Color("white");
            item.text = "Color\nPalette";
            item.fontFamily = "Helvetica Neue";
            item.fontSize = 80;
        }

        colorBoard.addChild(item);
        placeInParent(item, coords);
        return item;
    });
}

function generateColorBoard(artboard){
    const colors = generateColorBoardItems(artboard);
    const commands = require("commands");
    selection.items = images;
    commands.group();
}

function generateImageBoardItems(imageBoard){
    const items = [{"coords":{"x":500.6773986816406,"y":-67.23038482666016},"width":457.9112548828125,"height":670.7069702148438},{"coords":{"x":1588.6077880859375,"y":648.255859375},"width":457.9112548828125,"height":627.9035034179688},{"coords":{"x":0,"y":-86},"width":457.9112548828125,"height":689.4765625},{"coords":{"x":1087.930419921875,"y":648.255859375},"width":457.9112548828125,"height":559.7401733398438},{"coords":{"x":1001.3547973632812,"y":-1.042777180671692},"width":632.105224609375,"height":604.5193481445312},{"coords":{"x":1676.2264404296875,"y":-1.042777180671692},"width":642.5360107421875,"height":604.5193481445312},{"coords":{"x":0,"y":648.255859375},"width":1051.422607421875,"height":559.7401733398438}];
    return items.map(({coords, width, height}) => {
        const rect = new Rectangle();
        rect.fill = new Color("red");
        rect.width = width;
        rect.height = height;

        imageBoard.addChild(rect);
        placeInParent(rect, coords);
        return rect;
    });
}

function generateImageBoard(artboard){
    const images = generateImageBoardItems(artboard);
    const commands = require("commands");
    selection.items = images;
    commands.group();
    const group = selection.items[0];
    placeInParent(group, {x: -180, y: 40});
    group.rotateAround(-8, {x: -180, y: 40});
}

function show(event) {
    if (!panel) {
        const createdPanel = create();
        event.node.appendChild(createdPanel);

        createdPanel.querySelector("#generateBoardButton").addEventListener("click", () => {
            const { editDocument } = require("application");
            editDocument({ editLabel: "Generating board" }, function(selection, rootNode) {
                try {
                    const imageArtboard = createArboard("GeneratedImageBoard", rootNode);
                    generateImageBoard(imageArtboard);

                    const colorArtboard = createArboard("GeneratedColorBoard", rootNode, imageArtboard);
                    generateColorBoard(colorArtboard);
                } catch (error) {
                    console.log("Create boards error", error);
                }
            });
        });
    };
}

function update() {
    if(ui) ui.setState('selectedItems', selection.items);
    // const group = selection.items[0];
    // const transform = selection.items[0].transform;
    // const mtx = new Matrix();
    // Object.assign(mtx, transform);


    const children = selection.items[0].children.map(child => {
        const {topLeftInParent, width, height} = child;

        const type = child.constructor.name;
        if(type == "Text")
            console.log("Text stuff: ", child.layoutBox, child.text, child.fontFamily);

        return {
            type,
            coords: topLeftInParent, width, height
        }
    });
    console.log(JSON.stringify(children));
    // console.log("Children: ", JSON.stringify(selection.items[0].children.map(({topLeftInParent, width, height}) => ({coords: topLeftInParent, width, height}))));
}

module.exports = {
    show, update
};
const { selection } = require("scenegraph");
const { getDomFromString } = require("../utils/index");

const UIFramework = require('./ui-framework/index');
const CSS = require('./css');

let panel, ui;
const state = {
    selectedItems: [],
    screen: "pick",
    selectedTemplate: "rectangle"
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = /*html*/`
        ${ CSS }

        <h1 class="mb-3">Generate Palette</h1>
        
        <div x-show="screen == 'pick'">
            <p x-show="!selectedItems.length" class="opacity-65 text-lg px-0 mx-0">
                Please select an item to get started.
            </p>

            <div class="mt-3 mb-3" x-show="selectedItems.length">
                <div class="mb-1">
                    <h2 class="opacity-65 mb-0">Colors</h2>
                </div>

                <div class="mt-3 mb-2" x-html="getItems()"></div>

                <div class="mb-2">
                    <h2 class="opacity-65 mb-0">Template</h2>
                </div>

                <div class="mb-2 flex items-center justify-stretch">
                    <div class="text-lg mr-2 mb-2 p-2 flex-1 flex items-center border rounded-sm"
                        x-bind-class="selectedTemplate == 'rectangle' && 'bg-gray'"
                        @click="setTemplate('rectangle')"
                    >
                        <span class="border-2" style="height: 18px; width: 18px;"
                            x-bind-style="{backgroundColor: selectedTemplate == 'rectangle' ? 'black' : 'transparent'}"
                        ></span>
                        <span class="ml-2 text-md">Rectangle</span>
                    </div>

                    <div class="text-lg mb-2 p-2 flex-1 flex items-center border rounded-sm"
                        x-bind-class="selectedTemplate == 'circle' && 'bg-gray'"
                        @click="setTemplate('circle')"
                    >
                        <span class="rounded-full border-2" style="height: 20px; width: 20px;"
                            x-bind-style="{backgroundColor: selectedTemplate == 'circle' ? 'black' : 'transparent'}"
                        ></span>
                        <span class="ml-2 text-md">Circle</span>
                    </div>
                </div>

                <div id="generatePaletteButton" uxp-variant="cta" class="button">
                    Generate
                </div>
            </div>
        </div>

        <div x-show="screen == 'generate'">
            <h2 class="opacity-65 pt-3 mt-3 mb-3">Expanded Item</h2>

            <span class="mb-3 block" x-text="selectedItems[expandedIndex]"></span>

            <button uxp-variant="cta" class="button" @click="this.expandedIndex = -1">
                Clear Expanded Item
            </button>
        </div>
    `;

    ui = new UIFramework(panel, state, {
        methods: {
            setTemplate: function(tpl){
                this.selectedTemplate = tpl;
            },
            getItems: function(){
                if(this.selectedItems && this.selectedItems.length){
                    return this.selectedItems.map((item, index) => {
                        const selected = this.expandedIndex == index;
                        const selectionClass = selected ? 'bg-dark-gray text-white' : 'bg-gray';

                        const divString = /*html*/`
                            <div class="text-lg mb-2 p-2 flex items-center rounded-sm shadow ${selectionClass}">
                                <span style="height: 20px; width: 20px; background: ${item.color}"></span>
                                <span class="ml-3 text-md">${item.name}</span>
                            </div>
                        `.trim();

                        const div = getDomFromString(divString);

                        div.addEventListener("click", () => {
                            ui.setState('expandedIndex', index);
                        });

                        return div;
                    });
                }

                return "Loading... ";
            }
        }
    });

    return panel;
}

function generateCircles(selection, size){
    const {
        Rectangle,
        Ellipse
    } = require("scenegraph");

    // Go through list of selected items;
    // Generate a cirlce for each selected item with color taken fill
    
    return selection.items.map((node, i) => {
        const color = node.fill;
        let circle = new Ellipse();
        circle.radiusX = size / 2;
        circle.radiusY = size / 2;
        circle.fill = color;

        return circle;
    });
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

function show(event) {
    if (!panel) {
        const createdPanel = create();
        event.node.appendChild(createdPanel);

        createdPanel.querySelector("#generatePaletteButton").addEventListener("click", () => {
            // Create items from selected colors
            const { editDocument } = require("application");
            editDocument({ editLabel: "Generating palette" }, function(selection, rootNode) {
                const size = 20;
                const circles = generateCircles(selection, size);

                const {
                    Artboard,
                    Color
                } = require("scenegraph");
                // Create and artboard
                
                const arty = new Artboard();
                const artyHeight = size + 50
                arty.width = (size * selection.items.length) + 50;
                arty.height = artyHeight;
                arty.fill = new Color("white");
                arty.name = "GeneratedPalette";

                rootNode.addChild(arty);

                // Place it above all other artboards
                // 1. Find the most top left coordinates
                // Place the 'arty' above it
                
                try {
                    const { x, y } = getTopMostArtboardCoordinates(rootNode, Artboard);
                    placeInParent(arty, { x, y: y - artyHeight - 50 });

                    circles.forEach((circle, i) => {
                        let x;
                        
                        if(i == 0){
                            x = 5;
                            arty.addChild(circle);
                        }
                        else {
                            const prevCircle = circles[i - 1];
                            arty.addChildBefore(circle, prevCircle);
                            x = prevCircle.localBounds.x + (size * i * 0.7);
                        }

                        placeInParent(circle, {x, y: 5});
                    });
                } catch (error) {
                    console.log(error);
                }
                // Add the generated items to the artboard
            });
        });
    };
}

function update() {
    let selectedItems = selection.items;
    if(selectedItems.length){
        selectedItems = selectedItems.map(item => {
            return {
                name: item.name && item.name.length ? item.name : item.constructor.name,
                color: item.fill.toHex()
            }
        })
    }

    if(ui) ui.setState('selectedItems', selectedItems);
}

module.exports = {
    show, update
};
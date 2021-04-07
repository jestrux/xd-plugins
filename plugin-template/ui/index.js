const { selection } = require("scenegraph");
const { getDomFromString } = require("../utils");

const UIFramework = require('./ui-framework/index');
const CSS = require('./css');

let panel, ui;
const state = {
    selectedItems: [],
    expandedIndex: -1
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = /*html*/`
        ${ CSS }

        <h1 class="mb-3">My Awesome Plugin</h1>
        
        <p x-show="!selectedItems.length" class="opacity-65 text-lg px-0 mx-0">
            Please select an item to get started.
        </p>

        <div class="mt-3 mb-3" x-show="selectedItems.length">
            <div class="mb-1">
                <h2 class="opacity-65 mb-0">Selected Items</h2>
                <p class="mx-0 text-md opacity-65">
                    Click on one of the items to expand it.
                </p>
            </div>

            <div class="mt-3" x-html="getItems()"></div>
        </div>

        <hr class="mt-3 mx-0" x-show="expandedIndex != -1" />

        <div x-show="expandedIndex != -1">
            <h2 class="opacity-65 pt-3 mt-3 mb-3">Expanded Item</h2>

            <span class="mb-3 block" x-text="selectedItems[expandedIndex]"></span>

            <button uxp-variant="cta" class="button" @click="this.expandedIndex = -1">
                Clear Expanded Item
            </button>
        </div>
    `;

    ui = new UIFramework(panel, state, {
        methods: {
            getItems: function(){
                if(this.selectedItems && this.selectedItems.length){
                    return this.selectedItems.map((item, index) => {
                        const selected = this.expandedIndex == index;
                        const selectionClass = selected ? 'bg-dark-gray text-white' : 'bg-gray';

                        const divString = /*html*/`
                            <div class="text-lg mb-1 p-3 rounded-sm shadow ${selectionClass}">
                                ${item.constructor.name}
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

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update() {
    if(ui) ui.setState('selectedItems', selection.items);
}

module.exports = {
    show, update
};
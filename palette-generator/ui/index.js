const { selection } = require("scenegraph");

const UIFramework = require('./ui-framework/index');
const CSS = require('./css');

let panel, ui;
const state = {
    selectedItems: []
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = /*html*/`
        ${ CSS }
        
        <p>Colors:</p>

        <div x-show="selectedItems.length">
            <div x-html="getColors()"></div>
        </div>
    `;

    ui = new UIFramework(panel, state, {
        methods: {
            getColors: function(){
                console.log("The Items: ", this.selectedItems, this.selectedItems && this.selectedItems.length);

                if(this.selectedItems && this.selectedItems.length){
                    try {
                        return this.selectedItems.map(bg => {
                            return `
                                <div style="padding: 1.5rem; swidth: 60px; sheight: 60px; background: ${bg}">${bg}</div>
                            `.trim();
                        }).join('');
                    } catch (error) {
                        console.log("Issue rendering colors: ", error);
                    }
                }
                return "Loading... "
            }
        }
    });

    return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update() {
    var items = selection.items.map(({fill}) => {
        if(fill.toHex)
            return fill.toHex();
        else if(fill.colorStops){
            const {colorStops, startX, startY, endX, endY} = fill;
            const colors = colorStops.map(({color, stop}) => `${color.toHex()} ${stop*100}%`);
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

            return `
                linear-gradient(${angle}deg, ${colors.join(',')})
            `.trim();
        }

        return null;
    }).filter(entry => entry);
    
    if(ui) ui.setState('selectedItems', items);
}

module.exports = {
    show, update
};
const {
    Rectangle,
    Ellipse
} = require("scenegraph");
const { alert, error } = require("./utils/dialogs.js");

function generateRectangles(selection){
    // Go through list of selected items;
    // Generate a rectangle for each selected item with color taken fill
    selection.items.map((node, i) => {
        const color = node.fill;
        const size = 20;
        let rectangle = new Rectangle();
        rectangle.width = size;
        rectangle.height = size;
        rectangle.fill = color;
        selection.insertionParent.addChild(rectangle);
        rectangle.moveInParentCoordinates((size * i) + (5 * i), 50);
    });
}

function generateCircles(selection){
    // Go through list of selected items;
    // Generate a cirlce for each selected item with color taken fill
    
    selection.items.map((node, i) => {
        const color = node.fill;
        const size = 20;
        let circle = new Ellipse();
        circle.radiusX = size / 2;
        circle.radiusY = size / 2;
        circle.fill = color;
        selection.insertionParent.addChild(circle);
        circle.moveInParentCoordinates((size * i) + (5 * i), 50);
    });
}

module.exports = {
    commands: {
        generateRectangles,
        generateCircles
    }
}

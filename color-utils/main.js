/******************************************************************************
 *
 * Color Utils
 * ----------------
 *
 * Author: Walter Kimaro
 * License: MIT
 *
 * Provides several useful color utilities:
 *
 *  - Blend Colors: Creates a blend between two colors
 *  - Fill Colors: Creates a palette from each of the selected colors
 *
 ******************************************************************************/

const {
    Color,
    Ellipse
} = require("scenegraph");

/**
 * Given two arrays, return an array like [ [a[0], b[0]], [a[1], b[1], ... ]
 */
function zip(a, b) {
    return a.map((a, idx) => [a, b[idx]]);
}

/**
 * Checks if the two colors provided are the same. Returns `true` if so.
 *
 * @param {Color} a
 * @param {Color} b
 * @returns {boolean}
 */
function sameColor(a, b) {
    return zip([a.r, a.g, a.b, a.a], [b.r, b.g, b.b, b.a])
        .every(([a, b]) => a === b);
}

function divideIntoXSegments(startPoint, endPoint, x = 5) {
    let {x: x1, y: y1} = startPoint;
    let {x: x2, y: y2} = endPoint;

    let dx = (x2 - x1) / x; 
    let dy = (y2 - y1) / x;

    let interiorPoints = [];

    for (let i = 1; i < x; i++)
        interiorPoints.push({x: x1 + i*dx, y: y1 + i*dy});

    return interiorPoints;
}

function getIntermediateColors(colors, numberOfSteps){
    const firstColor = colors[0];
    const lastColor = colors[colors.length - 1];

    // next, extract the R, G, and B components from each
    const [startRGBA, endRGBA] = [firstColor, lastColor].map(color => [color.r, color.g, color.b, color.a])

    // calculate the deltas between the starting and ending color for each component, dividing
    // by the number of characters in the text element.
    const deltaRGBA = zip(startRGBA, endRGBA).map(([start, end]) => (end - start) / numberOfSteps);

    return Array(numberOfSteps).fill('asfa').map((_, step) => {
        // create a new color
        const color = new Color();

        // assign the R, G, and B components based on how many times we've iterated (step)
        [color.r, color.g, color.b, color.a] = startRGBA.map((c, idx) => c + (deltaRGBA[idx] * step));

        // create the individual style range (note the 1 === 1 character), and return it
        // with the new color
        return color;
    });
}

/**
 * This is the logic for blending two colors
 *
 * @param {*} selection
 */
function blendColors(selection) {
    const points = selection.items.map(({boundsInParent}) => boundsInParent);
    const startX = points[0].x;
    const startY = points[0].y;
    const endX = points[1].x;
    const endY = points[1].y;

    const distance = Math.hypot(endX - startX, endY - startY);
    const size = Math.max(points[0].width, points[0].height);
    const numOfItems = Math.floor(distance / size);
    const coordinates = divideIntoXSegments(points[0], points[1], numOfItems);

    const colors = selection.items.map(({fill}) => fill);
    const intermediateColors = getIntermediateColors(colors, numOfItems);

    const circles = coordinates.map(({x, y}, index) => {
        let circle = new Ellipse();
        circle.radiusX = size / 2;
        circle.radiusY = size / 2;
        circle.fill = intermediateColors[index];
        selection.insertionParent.addChild(circle);
        circle.moveInParentCoordinates(x, y);
        
        return circle;
    });

    selection.items = [
        ...selection.items,
        ...circles
    ];

    const commands = require("commands");

    // if deltaX is greater, align vertically,
    // otherwise horizontally
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);
    if(deltaX > deltaY)
        commands.alignVerticalCenter();
    else
        commands.alignHorizontalCenter();
}

function fillColors(){

}

module.exports = {
    commands: {
        blendColors,
        fillColors
    }
}

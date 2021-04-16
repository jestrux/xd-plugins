// https://dribbble.com/shots/14737614-Podcast-Concept

const application = require("application");
const fs = require("uxp").storage;
var commands = require("commands");
const iphoneCSS = require("./css/iphone.js");
const { base64ArrayBuffer } = require("./utils");

let dialog;

const yourHtml = /*html*/`
    ${iphoneCSS}
    <style>
        body{
            padding: 0;
            margin: 0;
        }
        .visible {
            display: flex;
        }
        .hidden {
            display: none;
        }
        .dialog {
            margin: -35px;
            height: 680px;
            width: 1000px;
        }

        dialog.vertical-preview{
            height: 1000px;
        }

        .dialog > div:first-child{
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            border-bottom: 2px solid rgba(255, 255, 255, 0.1); 
            padding: 16px;
            display: none;
        }

        .dialog > div:last-child{
            background-color: #7371ee;
            background-image: linear-gradient(60deg, #7371ee 1%, #a1d9d6 100%);
        }

        .dialog.vertical-preview > div:last-child{
            text-align: center;
            display: block !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .dialog.vertical-preview > div:last-child > div:first-child{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 50px !important;
            max-width: 760px;
            margin: auto !important;
        }

        .dialog.vertical-preview > div:last-child > div:first-child span{
            margin: auto !important;
        }

        .dialog.vertical-preview .iphone-x{
            margin: 40px auto !important;
        }

        #closeButton{
            position: absolute;
            z-index: 50;
            top: 16px;
            left: 16px;
            padding: 6px;
            border-radius: 50%;
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.1);
        }
    </style>
    <form method="dialog" class="dialog vertical-preview" style="display: flex; flex-direction: column;">
        <div>
            <h1 style="color: black; line-height: 1">Create Custom Size Post</h1>
        </div>
        <span id="closeButton">
            <img width="20px" src="images/close.png" alt=""/>
        </span>

        <div style="flex: 1; width: 100%; display: flex; justify-content: space-between; position: relative">
            <div style="align-self: center; flex: 1; padding: 0 60px;">
                <h1 style="color: black; font-size: 30px; line-height: 1.4">Get all the thrilliest bangers that were ever made right there on your phone.</h1>
                <p style="color: rgba(0, 0, 0, 0.65); margin-top: 16px; margin-bottom: 20px; font-size: 18px;">The thrilliest bangers have the shadiest moss</p>
                <span style="display: inline-block; background: red; color: white; padding: 8px 20px; border-radius: 20px; font-size: 16px;">
                    Learn More
                </span>
            </div>
            <div class="iphone-x">
                <img id="previewImage" src="" style="position: absolute; width: 100%; max-height: 100%;" />
                <i>Speaker</i>
                <b>Camera</b>
            </div>
        </div>
    </form>
`;

async function getRendition(selection) {
    const folder = await fs.localFileSystem.getTemporaryFolder();
    const item = selection.items[0];
    const file = await folder.createFile(`${item.guid}.png`, { overwrite: true });
    const renditionObjects = [{
        node: item,
        outputFile: file,
        type: "png",
        scale: 2,
    }];

    console.log("Rendition objects: ", renditionObjects);

    const results = await application.createRenditions(renditionObjects);
    const arrayBuffer = await results[0].outputFile.read({ format: fs.formats.binary });
    return base64ArrayBuffer(arrayBuffer);
}

async function createDialog(selection) {
    dialog = document.createElement("dialog");
    dialog.innerHTML = yourHtml;

    document.appendChild(dialog);

    dialog.querySelector("#closeButton").addEventListener('click', function(){
        dialog.close();
    });

    try {
        const base64 = await getRendition(selection);
        const image = dialog.querySelector("#previewImage");
        image.src = `data:image/png;base64,${base64}`;
        console.log("Selected image: ", image);
    } catch (error) {
        console.log("Error setting image: ", error);
    }
}

function createCustomBanner(selection, width, height) {
    commands.duplicate()
    const duplicated = selection.items[0];

    duplicated.resize(width, height);
    duplicated.moveInParentCoordinates(600, 600);
}

async function previewMobileApp(selection) {
    if (!dialog) createDialog(selection);

    return dialog.showModal().then(function (result) {
        if (result !== "reasonCanceled") {
            createCustomBanner(
                selection,
                Number(dialog.querySelector("#width").value),
                Number(dialog.querySelector("#height").value)
            );
        }
    });
}

module.exports = {
    commands: {
        previewMobileApp
    }
};
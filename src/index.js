import JSONEditor from 'jsoneditor';
import './css/main.css';
//import psiLogo from './images/psilogo.png';
import html from './index.html';
//import '!style-loader!css-loader?modules!jsoneditor/dist/jsoneditor.min.css';
import 'jsoneditor/dist/jsoneditor.min.css';
//import '!file-loader?name=[name].[ext]&outputPath=css/img!jsoneditor/dist/img/jsoneditor-icons.svg';
import getSchema from'./schema.js';
import * as schema from'./schema.js';

function main() {
    console.log("Running main()");
    // create the editor
    const container = document.getElementById("jsoneditor")
    const options = {
        mode: 'tree',
        modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
        onError: function (err) {
            alert(err.toString())
        },
        templates: [
            {
              text: 'Unit',
              title: 'value/unit measurement',
              className: 'jsoneditor-type-object',
            //   field: '',
              value: {
                'v': 0,
                'u': 'unit',
              },
            },
        ],
    }

    const editor = new JSONEditor(container, options)
    editor.expandAll();

    // set json
    //const examples = require('./examples.json');

    const examples = [require("./examples/em_metadata.json")];
    editor.set(examples[0]);
    editor.expandAll();



    // Load a JSON document
    FileReaderJS.setupInput(document.getElementById('loadDocument'), {
        readAsDefault: 'Text',
        on: {
            load: function (event, file) {
                editor.setText(event.target.result)
            }
        }
    })

    // Save a JSON document
    document.getElementById('saveDocument').onclick = function () {
        // Save Dialog
        let fname = window.prompt("Save as...","metadata.json")

        // Check json extension in file name
        if (fname.indexOf(".") === -1) {
            fname = fname + ".json"
        } else {
            if (fname.split('.').pop().toLowerCase() === "json") {
                // Nothing to do
            } else {
                fname = fname.split('.')[0] + ".json"
            }
        }
        const blob = new Blob([editor.getText()], { type: 'application/json;charset=utf-8' })
        saveAs(blob, fname)
    }

    // Load schemas
    getSchema()
        .then(s => schema.fixSchema(s))
        .then(s => editor.setSchema({
            "$ref": "#/definitions/RawDataset",
            definitions: s.definitions,
        }));

    return editor
}

window.editor = main();
window.schemaModule = schema;
getSchema().then(s => window.schema = schema.fixSchema(s))
//editor.setSchema({"$ref": "#/definitions/RawDataset", definitions: schema.definitions});
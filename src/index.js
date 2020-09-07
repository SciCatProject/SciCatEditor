import JSONEditor from 'jsoneditor';
import './scss/main.scss';
//import psiLogo from './images/psilogo.png';
import html from './index.html';
//import '!style-loader!css-loader?modules!jsoneditor/dist/jsoneditor.min.css';
//import 'jsoneditor/dist/jsoneditor.min.css';
//import '!file-loader?name=[name].[ext]&outputPath=img!jsoneditor/dist/img/jsoneditor-icons.svg';
import * as schemaModule from './schema.js';
import examples from './examples.js';
import $ from 'jquery';
import _ from 'lodash';
import 'popper.js';
import 'bootstrap';

function setupEditor() {
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

    return editor
}
function setExample(editor, schemas, example) {
    console.log(`Setting example to ${example.name}`);
    editor.set(example.json);
    example.schema && setSchema(editor, schemas, example.schema);
}

function setupExamples(editor, schemas) {
    // populate examples dropdown
    const $list = $("#template-list")
    examples.forEach( (example, i) => {
        //const $a = $("<a>").addClass("dropdown-item").attr("href", "#").text(example.name);
        //$("#template-list").append($a)
        const $option = $("<option>").attr("value",i).text(example.name)
        if(i == 0) {
            $option.prop("selected",true);
        }
        $list.append($option);
    });
    $list.change(function() {
        const $sel = $(this).find("option:selected");
        const val = $sel.val();
        if(!(0 <= val && val < examples.length)) {
            return; // "Custom"
        }
        const example = examples[$sel.val()];
        const currScript = editor.get()
        if(currScript != example.json) {
            console.log("Loading template "+example.name);
            setExample(editor, schemas, example);
        }
    });
    // select initial example
    setExample(editor, schemas, examples[0]);
    editor.expandAll();

    return examples;
}

function setupFileLoader() {
    // Load a JSON document
    FileReaderJS.setupInput(document.getElementById('loadDocument'), {
        readAsDefault: 'Text',
        on: {
            load: function (event, file) {
                editor.setText(event.target.result)
            }
        }
    })

}

function setupDownload() {
    // Save a JSON document
    $('#saveDocument').click(function () {
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
    });
}

function setSchema(editor, schemas, schemaname) {
    console.log(`Setting schema to ${schemaname}`);
    editor.setSchema(schemas[schemaname]);
    $(`#schema-list option[value='${schemaname}']`).prop("selected", true);
}

function setupSchemas(editor, schemas) {
    const $list = $("#schema-list");
    _.forIn(schemas, (s, name) => {
        const $option = $("<option>").attr("value", name).text(name);
        $list.append($option);
    });
    $list.change(function() {
        const $sel = $(this).find("option:selected");
        const val = $sel.val();
        setSchema(editor, schemas, val);
    })
}

function addHooks() {
    // Open accordion folds from anchor links
    $(document).ready(function () {
        location.hash && $(location.hash + '.collapse').collapse('show');
    });
}

function main() {
    const editor = setupEditor();
    schemaModule.datasetSchemas.then( schemas => {
        setupSchemas(editor, schemas);
        setupExamples(editor, schemas);
    });
    setupFileLoader();
    setupDownload();
    addHooks();

    // expose some variables for debugging
    window.editor = editor;
    window.schemaModule = schemaModule;
    schemaModule.datasetSchemas.then(schemas => window.schemas = schemas);
    window.examples = examples;
}
main();
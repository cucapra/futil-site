import * as calyx from "../rust/Cargo.toml";
import data from "../examples/data.json";
import passes from "../data/passes.json";
import calyx_info from "../rust/calyx_hash.json";
import { updateDiffEditor } from './diffEditor.js';

var button = document.getElementById("compile");

var library_code = "";
var lib_select = document.getElementById("library-select");
lib_select.onchange = function() {
    library_code = lib_select.value;
};

function createToggle(pass) {
    let button = document.createElement("button");
    button.classList.add("toggle");
    button.classList.add("off");
    button.innerHTML = pass.title;
    button.onclick = function() {
        if (button.classList.contains("on")) {
            button.classList.replace("on", "off");
            pass.active = false;
        } else {
            button.classList.replace("off", "on");
            pass.active = true;
        }
        compile();
    };
    return button;
}

let passDiv = document.getElementById("passes");
for (let pass of passes.passes) {
    let button = createToggle(pass);
    passDiv.appendChild(button);
}

// var editor_div = document.getElementById("editor");
// const editor = new CodeJar(
//     editor_div,
//     withLineNumbers(Prism.highlightElement),
//     { tab: '\t' }
// );

button.onclick = function() {
    compile();
};

// editor.onUpdate((code) => {
//     compile(code);
// });

// var compiled_div = document.getElementById("compiled");
// const compiled = new CodeJar(
//     compiled_div,
//     withLineNumbers(Prism.highlightElement),
//     { tab: '\t' }
// );

function getActivePasses() {
    let list = [];
    for (let p of passes.passes) {
        if (p.active) {
            list.push(p.name);
        }
    }
    return list;
}

function compile() {
    // get passes to run
    let passList = getActivePasses();
    // get the current code in the editor
    let sourceCode = document.getElementById("input").innerText;
    // cleanup input
    sourceCode = sourceCode.replaceAll(/(\n+)(?=\s*\})/g, '\n');
    sourceCode = sourceCode.replaceAll(/\n(\n+)(?=\s*group)/g, '\n\n');
    // compile the code
    var compiledCode = calyx.run(passList, library_code, sourceCode);

    // update the diff editor
    var editor = document.getElementById("diffEditor");
    updateDiffEditor(editor, sourceCode, compiledCode);
}

// var examples_box = document.getElementById("examples");
var examples_select = document.getElementById("examples-select");
examples_select.onchange = function() {
    // editor.updateCode(examples_select.value);
    document.getElementById("input").innerHTML = examples_select.value;
    compile();
};

// set calyx version
var futil_version_div = document.getElementById("calyx-version");
var git_link = document.createElement('a');
git_link.appendChild(document.createTextNode(calyx_info.version.slice(0, 8)));
git_link.href = "https://github.com/cucapra/futil/tree/" + calyx_info.version;
futil_version_div.appendChild(document.createTextNode("Built with calyx version "));
futil_version_div.appendChild(git_link);

// text
let option;
for (var i in data.categories) {
    var group = data.categories[i];
    var sel = document.getElementById(group.name + "-select");
    if (sel) {
        for (var j in group.items) {
            var item = group.items[j];
            option = document.createElement('option');
            option.text = item.name;
            option.value = item.content;
            sel.add(option);
        }
        sel.onchange();
    }
}

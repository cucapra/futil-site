import * as calyx from "../rust/Cargo.toml";
import data from "../examples/data.json";
import passes from "../data/passes.json";
import calyx_info from "../rust/calyx_hash.json";
import { updateDiffEditor, wrapLines } from './diffEditor.js';

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

button.onclick = function() {
    compile();
};

function getActivePasses() {
    let list = [];
    for (let p of passes.passes) {
        if (p.active) {
            list.push(p.name);
        }
    }
    return list;
}

function cleanse(elem) {
    let code = "";

    code = elem.innerText;
    // for (let line of elem.querySelectorAll(".line")) {
    //     code += line.innerText;
    // }

    // cleanup input
    code = code.replaceAll(/(\n+)(?=\s*\})/g, '\n');
    code = code.replaceAll(/\n(\n+)(?=\s*group)/g, '\n\n');

    return code;
}

function compile() {
    // get passes to run
    let passList = getActivePasses();
    // get the current code in the editor
    let sourceCode = cleanse(document.getElementById("input"));
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
    let input = document.getElementById("input");
    input.innerHTML = examples_select.value;
    // wrapLines(input);
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

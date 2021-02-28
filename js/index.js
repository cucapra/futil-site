import * as calyx from "../rust/Cargo.toml";
import config from "../data/config.json";
import passes from "../data/passes.json";
import calyx_info from "../rust/calyx_hash.json";
import { updateDiffEditor } from './diffEditor.js';
import 'regenerator-runtime/runtime';
import { toggleButton } from "./toggleButton";
import ace from 'brace';
ace.Range = ace.acequire("ace/range").Range;
import 'brace/mode/curly';
import 'brace/theme/solarized_light';
import AceDiff from 'ace-diff';

// optionally, include CSS, or use your own
import 'ace-diff/dist/ace-diff.min.css';

var LIBRARIES = {};
var CURRENT_CODE = {};
var EDIT_MODE = false;

config.url_prefix = config.url_prefix + calyx_info.version;
// set calyx version
var futil_version_div = document.getElementById("calyx-version");
var git_link = document.createElement('a');
git_link.appendChild(document.createTextNode(calyx_info.version.slice(0, 8)));
git_link.href = "https://github.com/cucapra/futil/tree/" + calyx_info.version;
futil_version_div.appendChild(document.createTextNode("Built with calyx version "));
futil_version_div.appendChild(git_link);

// create pass toggle buttons
function createToggle(pass) {
    let button = document.createElement("button");
    button.classList.add("toggle");
    button.classList.add("off");
    button.innerHTML = pass.title;
    button.onclick = function() {
        toggleButton(pass, !pass.active);
        pass.active = !pass.active;
        compile();
    };
    return button;
}

let passDiv = document.getElementById("passes");
for (let pass of passes.passes) {
    let button = createToggle(pass);
    pass.button = button;
    passDiv.appendChild(button);
}

// mode button
let modeButton = document.getElementById("mode");
let diffMode = false;
modeButton.onclick = function() {
    if (diffMode) {
        modeButton.classList.replace("off", "on");
        diffMode = false;
    } else {
        modeButton.classList.replace("on", "off");
        diffMode = true;
    }
};

// var editor = ace.edit('editor');
// editor.getSession().setMode('ace/mode/curly');
var differ = new AceDiff({
    ace, // using Brace
    element: '#editor',
    theme: 'ace/theme/solarized_light',
    diffGranularity: 'specific',
    left: {
        content: '',
        copyLinkEnabled: false
    },
    right: {
        content: '',
        editable: false,
        copyLinkEnabled: false
    },
});

document.getElementById("compile").onclick = function() {
    compile();
};

function compile() {
    EDIT_MODE = false;
    // get passes to run
    let passList = passes.passes
        .filter(p => p.active)
        .map(p => p.name);

    // collect libraries into a single string
    let libraryCode = CURRENT_CODE.libraries.map(x => x.code).join("\n");

    // compile the code
    var compiledCode = calyx.run(
        passList,
        libraryCode,
        CURRENT_CODE.code
    );

    console.log(CURRENT_CODE, compiledCode, passList);

    // update the diff editor
    differ.getEditors().right.setValue(compiledCode, -1);
    differ.getEditors().right.clearSelection();
    // var editor = document.getElementById("diffEditor");
    // updateDiffEditor(editor, CURRENT_CODE.code, compiledCode);
}


// Fetches `library` from the web and returns a promise
// to it's text.
async function getLibrary(library, root) {
    if (library in LIBRARIES) {
        return await LIBRARIES[library];
    } else {
        let url = `${config.url_prefix}${root}${library}`;
        let request = await fetch(url);
        let code = await request.text();
        // if code has more imports, import those and append them to this lib
        if (/import/g.test(code)) {
            let prefix = library.split('/').slice(0, -1).join("/");
            let names = Array.from(code.matchAll(/import "(.*)";/g)).map(x => x[1]);
            let res = await fetchLibs(names, `${root}/${prefix}/`);
            for (let r of res) {
                code += r.code;
            }
        }
        LIBRARIES[library] = code;
        return code;
    }
}

// Returns a promise that resolves when all the
// libraries in `names` are loaded
async function fetchLibs(names, root) {
    let proms = names.map(async function(lib) {
        let code = await getLibrary(lib, root);
        return { name: lib, code: code };
    });
    return await Promise.all(proms);
}

async function getExample(name, root) {
    // fetch the example
    let url = `${config.url_prefix}${root}${name}`;
    let response = await fetch(url);
    let code = await response.text();

    // read import statements from example, and import the relevant libs
    let importRegex = /import "(.*)";/g;
    let names = Array.from(code.matchAll(importRegex)).map(x => x[1]);
    let res = await fetchLibs(names, root);

    // remove imports
    code = code.replaceAll(importRegex, "");

    return {
        code: code.trim(),
        libraries: res,
    };
}

// var input = document.getElementById("input");
// var output = document.getElementById("output");
// function update() {
//     input.innerHTML = CURRENT_CODE.code;
// }

// function removeDiffStyle(children) {
//     for (let node of children) {
//         if (node.classList.contains("diff-empty", "diff-deletion")) {
//             input.removeChild(node);
//         }
//         node.classList.remove("diff-addition", "diff-deletion");
//         if (node.children.length > 0) {
//             removeDiffStyle(node.children);
//         }
//     }
// }

// input.onclick = function() {
//     if (!EDIT_MODE) {
//         removeDiffStyle(input.children);
//         output.innerHTML = "";
//         EDIT_MODE = true;
//     }
// };

// input.oninput = function() {
//     CURRENT_CODE.code = input.innerText;
// };

// Select certain passes given an example
function selectPasses(item) {
    if ("passes" in item) {
        for (let p of passes.passes) {
            toggleButton(p, item.passes.includes(p.name));
        }
    }
}

// var examples_box = document.getElementById("examples");
var examples_select = document.getElementById("examples-select");
examples_select.onchange = function() {
    // input.innerHTML = "loading...";
    // output.innerHTML = "loading...";
    let value = JSON.parse(examples_select.value);
    getExample(value.file, value.root)
        .then(t => {
            console.log(t);
            differ.getEditors().left.setValue(t.code, -1);
            differ.getEditors().left.clearSelection();
            CURRENT_CODE = t;
            // editor.clearSelection();
        })
        .then(() => selectPasses(value))
        .then(() => compile());
    // .then(() => compile());
};

// load examples and libraries from config
let option;
for (var i in config.categories) {
    var group = config.categories[i];
    console.log(group);
    var sel = document.getElementById(group.name + "-select");
    if (sel) {
        for (var j in group.items) {
            var item = group.items[j];
            option = document.createElement('option');
            option.text = item.name;
            option.value = JSON.stringify(item);
            sel.add(option);
        }
        sel.onchange();
    }
}

import * as calyx from "../rust/Cargo.toml";
import data from "../examples/data.json";
import calyx_info from "../rust/calyx_hash.json";
import * as Diff from 'diff';
import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar/linenumbers';
import Prism from 'prismjs';
import './prism-futil.js';

var button = document.getElementById("compile");

var library_code = "";
var lib_select = document.getElementById("library-select");
lib_select.onchange = function() {
    library_code = lib_select.value;
};

var editor_div = document.getElementById("editor");
const editor = new CodeJar(
    editor_div,
    withLineNumbers(Prism.highlightElement),
    { tab: '\t' }
);

button.onclick = function() {
    compile(editor.toString());
};

// editor.onUpdate((code) => {
//     compile(code);
// });

var compiled_div = document.getElementById("compiled");
const compiled = new CodeJar(
    compiled_div,
    withLineNumbers(Prism.highlightElement),
    { tab: '\t' }
);

function filterDiff(input, prefix) {
    var lines = [];
    let hunk = input.hunks[0];
    console.log(hunk);
    // for (let i = 0; i < hunk.oldLines; i++) {
    for (let l of hunk.lines) {
        // let l = hunk.lines[i];
        if (l.length > 0) {
            let symbol = l[0];
            let content = l.slice(1, l.length);
            if (symbol == prefix) {
                lines.push(content);
                // lines.push(l);
            } else if (symbol == ' ') {
                // lines.push("--space--");
                lines.push(content);
            } else if (symbol == '\\') {
                // console.log("prefix " + symbol);
                // do nothing
            } else {
                console.log("prefix " + symbol);
                if (content.length == 0) {
                    lines.push('');
                } else if (content.trim().startsWith("//")) {
                    lines.push('');
                } else {
                    lines.push(`${symbol}${content.slice(1, l.length)}`);
                }
            }
        }
    }
    // console.log(hunk.lines.slice(hunk.oldLines, hunk.lines.length));
    // lines = lines.concat(hunk.lines.slice(hunk.oldLines, hunk.lines.length));
    return lines.join('\n');
}

function compile(code) {
    code = code.replaceAll(/^\+.*\n/mg, '');
    console.log(code);
    code = code.replaceAll(/^-.*$/mg, '');
    var str = calyx.run(library_code, code);

    if (str.startsWith("Error:")) {
        compiled.updateCode(str);
    } else {
        var diff = Diff.structuredPatch("input", "input", code, str, null, null, {
            "context": code.split("\n").length,
        });
        compiled.updateCode(filterDiff(diff, '+'));
        editor.updateCode(filterDiff(diff, '-'));
    }

    // editor.updateCode(str);
    // const diffHtml = Diff2Html.html(diff,
    //     { drawFileList: false, matching: 'lines' }
    // );
    // compiled_div.innerHTML = diffHtml;
    // compiled.updateCode(diff);
    // document.getElementById('diff-pane').innerHTML = "";

}

// var examples_box = document.getElementById("examples");
var examples_select = document.getElementById("examples-select");
examples_select.onchange = function() {
    editor.updateCode(examples_select.value);
    compile(editor.toString());
};

// examples_box.oninput = function() {
//     compile();
// };

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

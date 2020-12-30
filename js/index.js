import * as calyx from "../rust/Cargo.toml";
import data from "../examples/data.json";
import passes from "../data/passes.json";
import calyx_info from "../rust/calyx_hash.json";
import * as Diff from 'diff';
// import { CodeJar } from 'codejar';
// import { withLineNumbers } from 'codejar/linenumbers';
import Prism from 'prismjs';
import './prism-futil.js';
require('prismjs/plugins/keep-markup/prism-keep-markup');

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

// function filterDiff(input, prefix) {
//     var lines = [];
//     let hunk = input.hunks[0];
//     console.log(hunk);
//     // for (let i = 0; i < hunk.oldLines; i++) {
//     for (let l of hunk.lines) {
//         // let l = hunk.lines[i];
//         if (l.length > 0) {
//             let symbol = l[0];
//             let content = l.slice(1, l.length);
//             if (symbol == prefix) {
//                 lines.push(content);
//                 // lines.push(l);
//             } else if (symbol == ' ') {
//                 // lines.push("--space--");
//                 lines.push(content);
//             } else if (symbol == '\\') {
//                 // console.log("prefix " + symbol);
//                 // do nothing
//             } else {
//                 if (content.length == 0) {
//                     lines.push('');
//                 } else if (content.trim().startsWith("//")) {
//                     lines.push('');
//                 } else {
//                     lines.push(`${symbol}${content.slice(1, l.length)}`);
//                 }
//             }
//         }
//     }
//     // console.log(hunk.lines.slice(hunk.oldLines, hunk.lines.length));
//     // lines = lines.concat(hunk.lines.slice(hunk.oldLines, hunk.lines.length));
//     return lines.join('\n');
// }

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
    let passList = getActivePasses();
    console.log(passList);
    // let code = editor.toString();
    let code = document.getElementById("editor").innerText;

    code = code.replaceAll(/^\+.*\n/mg, '');
    code = code.replaceAll(/^-.*$/mg, '');
    var str = calyx.run(passList, library_code, code);

    if (str.startsWith("Error:")) {
        document.getElementById("compiled").innerHTML = str;
    } else {
        let lineDiff = Diff.diffLines(code, str);
        let compiledStr = document.getElementById("compiled");
        compiledStr.innerHTML = "";
        let editorStr = document.getElementById("editor");
        editorStr.innerHTML = "";
        for (let i = 0; i < lineDiff.length; i++) {
            let change = lineDiff[i];
            if (change.added == null && change.removed == null) {
                compiledStr.appendChild(
                    document.createTextNode(change.value)
                );
                editorStr.appendChild(document.createTextNode(change.value));
            } else if (change.added) {
                let span = document.createElement('span');
                span.innerHTML = change.value;
                span.classList = 'token diff-addition';
                compiledStr.appendChild(span);
                if (change.count > 0) {
                    let commentStr = "\n".repeat(change.count);
                    editorStr.append(document.createTextNode(commentStr));
                } else {
                    // let commentStr = "\n".repeat(Math.abs(change.count));
                    // compiledStr.append(document.createTextNode(commentStr));
                }
            } else {
                // check if next item is an addition
                if (i + 1 < lineDiff.length && lineDiff[i + 1].added) {
                    let next = lineDiff[i + 1];
                    let count = change.count - next.count;
                    if (count > 0) {
                        compiledStr.appendChild(document.createTextNode('\n'.repeat(count)));
                    } else {
                        // editorStr.appendChild(document.createTextNode('\n'.repeat(Math.abs(count))));
                    }
                    let wordDiff = Diff.diffWordsWithSpace(change.value, next.value);
                    for (let change of wordDiff) {
                        if (change.added == null && change.removed == null) {
                            editorStr.appendChild(document.createTextNode(change.value));
                            compiledStr.appendChild(document.createTextNode(change.value));
                        } else if (change.added) {
                            let span = document.createElement('span');
                            span.innerHTML = change.value;
                            span.classList = 'token diff-addition';
                            compiledStr.appendChild(span);
                        } else if (change.removed) {
                            let span = document.createElement('span');
                            span.innerHTML = change.value;
                            span.classList = 'token diff-deletion';
                            editorStr.appendChild(span);
                        }
                    }
                    i++;
                } else {
                    let span = document.createElement('span');
                    span.innerHTML = change.value;
                    span.classList = 'token diff-deletion';
                    editorStr.appendChild(span);
                    if (change.count > 0) {
                        compiledStr.appendChild(document.createTextNode("\n".repeat(change.count)));
                    } else {
                        // editorStr.appendChild(document.createTextNode("\n".repeat(change.count)));
                    }
                }


                // if (change.value.includes("\n")) {
                //     compiledStr.append(document.createTextNode(change.value));
                // }
                // console.log(change);
            }
        }

        Prism.highlightElement(document.getElementById('editor'));
        Prism.highlightElement(document.getElementById('compiled'));
        // compiled.updateCode(compiledStr);

        // var diff = Diff.structuredPatch("input", "input", code, str, null, null, {
        //     "context": code.split("\n").length,
        // });
        // compiled.updateCode(filterDiff(diff, '+'));
        // editor.updateCode(filterDiff(diff, '-'));
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
    // editor.updateCode(examples_select.value);
    document.getElementById("editor").innerHTML = examples_select.value;
    compile();
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

import * as calyx from "../rust/Cargo.toml";
// import data from "../examples/data.json";
// import calyx_info from "../rust/calyx_hash.json";
// import Viz from 'viz.js';
// import workerUrl from 'viz.js/full.render.js';

var library_elem = document.getElementById("library");
var examples_elem = document.getElementById("examples");
var button = document.getElementById("compile");
var output = document.getElementById("output");

button.onclick = function() {
    output.value = "Compiling...";
    console.log("hi");
    var text = calyx.run(library_elem.value, examples_elem.value);
    output.value = text;
};

// var lib_box = document.getElementById("library");
// var lib_select = document.getElementById("library-select");
// lib_select.onchange = function() {
//     lib_box.value = lib_select.value;
// };

// var examples_box = document.getElementById("examples");
// var examples_select = document.getElementById("examples-select");
// examples_select.onchange = function() {
//     examples_box.value = examples_select.value;
// };

// set calyx version
// var futil_version_div = document.getElementById("calyx-version");
// futil_version_div.innerHTML = "Built with Calyx version: " + calyx_info.version;

// let option;
// for (var i in data.categories) {
//     var group = data.categories[i];
//     var sel = document.getElementById(group.name + "-select");
//     if (sel) {
//         for (var j in group.items) {
//             var item = group.items[j];
//             option = document.createElement('option');
//             option.text = item.name;
//             option.value = item.content;
//             sel.add(option);
//         }
//         sel.onchange();
//     }
// }

// var viz = new Viz({ workerUrl });
// var dot = document.getElementById("dot-pane");
// viz.renderSVGElement('digraph { a -> b }')
//     .then((element) => {
//         console.log("hi");
//         dot.innerHTML = element;
//     });

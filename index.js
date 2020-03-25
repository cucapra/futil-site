import * as js from "./src/lib.rs";

var library_elem = document.getElementById("library");
var namespace_elem = document.getElementById("namespace");
var button = document.getElementById("compile");
var output = document.getElementById("output");

button.onclick = function() {
    output.value = "Compiling...";
    var text = js.run(library_elem.value, namespace_elem.value);
    output.value = text;
};

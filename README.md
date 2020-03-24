# Futil Web Demo
This uses `calyx` as a library to provide an interactive
web demo for the Futil compiler. Futil is compiled to webassembly
and wrapped in simple javascript that interfaces with the compiler.

## Building
**Note:** For now, this repository assumes that it is next to the [Futil repository](https://github.com/cucapra/futil). If you want to change
this, you will need to edit the `caylx` dependency in `Cargo.toml` to point
to the right place. In the future, we will ship `calyx` as a Rust crate and
this won't be a problem.

### Setup Build Environment
You need [Rust](https://www.rust-lang.org/install.html) and [Node.js and NPM](https://www.npmjs.com/get-npm) installed.

Then install `wasm-pack` with:

``` shell
cargo install wasm-pack
```

Now you are ready to build and run the web demo. First, install the `npm` dependencies with:

``` shell
npm i
```

### Compiling and Testing

First, build the demo with:

``` shell
wasm-pack build
```

and then run a test web server with:

``` shell
npm run serve
```

The server will automatically refresh if you change any of the javascript
sources, but you will need to restart if you recompile the Rust into webassembly.


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
To get [WebAssembly support](https://rustwasm.github.io/wasm-pack/book/quickstart.html), the easiest way is to install Rust with [rustup](https://rustup.rs) as opposed to a package manager.

Then install `wasm-pack` with:

``` shell
cargo install wasm-pack
```

Now you are ready to build and run the web demo. First, install the `npm` dependencies with:

``` shell
npm i
```

### Compiling and Testing

Run a test web server with:

``` shell
npm run test
```

The server will automatically refresh if you change any of the JavaScript or Rust code.
You can build standalone files with:

``` shell
npm run build
```

## Calyx Demo

Demo webpage for the Calyx.

### Prerequisites

1. Install Hugo (= 0.65.1)
2. Get the theme: `git submodule init && git submodule update`.
2. (Optional for local builds) Install [entr][].
3. Run `make get-dahlia` to grab the Dahlia JS compiler.
4. Run `make`. This will install the dependencies for `custom-js/` and generate
   the website under the `public/` folder.

[entr]: http://eradman.com/entrproject/

### Local builds

There are two components to the website, the static webpage and the custom
JavaScript (which contains all the examples).

1. Run the following command to automatically rebuild the JavaScript dependencies
   whenever a file in `custom-js/` is changed:
   ```
   cd custom-js && find *.js | entr -c yarn build
   ```
2. Run `hugo server -w` in the repository root.


### Adding new examples

All the examples live in `custom-js/examples.js`. Add a new example by
adding a new object in the same style as the existing examples.

If running a local build, the file should be automatically rebuilt and the example
should up in the list. If it doesn't show up, check the console for any errors.
It's likely that the example was malformed or the script failed.

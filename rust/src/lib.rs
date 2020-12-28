use calyx::{
    errors,
    frontend::parser,
    ir::{self, traversal::Visitor},
    passes,
};
use wasm_bindgen::prelude::*;

fn compile(library: &str, namespace: &str) -> Result<String, errors::Error> {
    let namespace_ast = parser::FutilParser::parse(namespace.as_bytes())?;
    // let lib_ast = lib::Library::parse(library)?;

    // Build the IR representation
    let mut rep = ir::from_ast::ast_to_ir(namespace_ast, false, false)?;

    passes::StaticTiming::do_pass_default(&mut rep)?;

    let mut buffer: Vec<u8> = vec![];
    for comp in &rep.components {
        ir::IRPrinter::write_component(comp, &mut buffer)?;
    }
    Ok(String::from_utf8(buffer).unwrap())
}

#[wasm_bindgen]
#[no_mangle]
pub fn run(library: &str, namespace: &str) -> String {
    match compile(library, namespace) {
        Ok(s) => s,
        Err(e) => format!("{:?}", e),
    }
}

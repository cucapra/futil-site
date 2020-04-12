use calyx::lang::{ast, context, library::ast as lib};
use calyx::{backend::traits::Backend, backend::verilog::gen::VerilogBackend};
use calyx::{errors, passes, passes::visitor::Visitor};
use passes::{
    automatic_par::AutomaticPar, collapse_seq::CollapseSeq,
    lat_insensitive::LatencyInsensitive, redundant_par::RedundantPar,
    remove_if::RemoveIf,
};
use sexpy::Sexpy;
use wasm_bindgen::prelude::*;

fn compile(library: &str, namespace: &str) -> Result<String, errors::Error> {
    let namespace_ast = ast::NamespaceDef::parse(namespace)?;
    let lib_ast = lib::Library::parse(library)?;

    let ctx = context::Context::from_ast(namespace_ast, &[lib_ast])?;

    LatencyInsensitive::do_pass_default(&ctx)?;
    RedundantPar::do_pass_default(&ctx)?;
    RemoveIf::do_pass_default(&ctx)?;
    CollapseSeq::do_pass_default(&ctx)?;
    AutomaticPar::do_pass_default(&ctx)?;

    let mut buffer: Vec<u8> = vec![];
    VerilogBackend::run(&ctx, &mut buffer)?;
    Ok(String::from_utf8(buffer).unwrap())
}

#[wasm_bindgen]
pub fn run(library: &str, namespace: &str) -> String {
    match compile(library, namespace) {
        Ok(s) => s,
        Err(e) => format!("{:?}", e),
    }
}

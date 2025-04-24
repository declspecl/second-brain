use cli::{CliArgs, Parser};

pub mod cli;
pub mod config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = CliArgs::parse();

    println!("{:#?}", args);

    return Ok(());
}

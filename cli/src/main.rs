use cli::{CliArgs, Parser};

pub mod cli;
pub mod config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = CliArgs::parse();

    println!("{:#?}", args);

    let config = config::read_config()?.unwrap_or_default();

    println!("{:#?}", config);

    config::write_config(&config)?;

    return Ok(());
}

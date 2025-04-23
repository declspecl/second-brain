use cli::{CliArgs, Parser};

pub mod cli;

#[tokio::main]
async fn main() {
    let args = CliArgs::parse();

    println!("{:#?}", args);
}

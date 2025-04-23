pub use clap::Parser;
use clap::Subcommand;

#[derive(Debug, Parser)]
#[command(about, version)]
pub struct CliArgs {
    #[clap(subcommand)]
    command: CliCommands
}

#[derive(Debug, Subcommand)]
enum CliCommands {
    #[clap(name = "store", about = "Store some content in your second brain")]
    Store { content: String },
    #[clap(name = "read", about = "Read a file and store in the database")]
    Read { filepath: String },
    #[clap(name = "talk", about = "Talk to your second brain")]
    Talk { prompt: String }
}

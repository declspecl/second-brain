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
    Talk { prompt: String },
    #[clap(name = "config", about = "Manage your second brain configuration")]
    Config {
        #[clap(subcommand)]
        command: ConfigCommands
    },
}

#[derive(Debug, Subcommand)]
enum ConfigCommands {
    #[clap(name = "show", about = "Show current configuration")]
    Show,
    #[clap(name = "add", about = "Add a new provider")]
    Add { name: String, description: String, api_key: String },
    #[clap(name = "remove", about = "Remove a provider")]
    Remove { name: String },
    #[clap(name = "set", about = "Set the current provider")]
    Set { name: String }
}

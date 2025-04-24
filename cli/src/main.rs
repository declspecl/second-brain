use cli::{CliArgs, CliCommands, ConfigCommands, Parser};
use config::ProviderConfig;

pub mod agent;
pub mod cli;
pub mod config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = CliArgs::parse();
    let mut config = config::read_config()?.unwrap_or_default();

    match args.command {
        CliCommands::Store { content } => {},
        CliCommands::Read { filepath } => {},
        CliCommands::Talk { prompt } => {},
        CliCommands::Config { command } => match command {
            ConfigCommands::Show => {
                println!("{}", toml::ser::to_string(&config)?);
            },
            ConfigCommands::Add { name, description, api_key } => {
                config.providers.insert(name, ProviderConfig { description, api_key });
            },
            ConfigCommands::Remove { name } => {
                config.providers.remove(&name);
            },
            ConfigCommands::Set { name } => {
                config.current_provider = name;
            }
        }
    }

    config::write_config(&config)?;

    return Ok(());
}

use std::{collections::HashMap, fs};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SecondBrainConfig {
    pub providers: HashMap<String, ProviderConfig>,
    pub current_provider: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderConfig {
    pub name: Option<String>,
    pub description: Option<String>,
    pub api_key: Option<String>,
}

pub const CONFIG_FILE: &str = "second-brain.toml";

pub fn read_config() -> anyhow::Result<SecondBrainConfig> {
    let base_dir = xdg::BaseDirectories::new()?;
    let config_dir = base_dir.get_config_home();

    let config_contents = fs::read_to_string(config_dir.join(CONFIG_FILE))?;
    let config: SecondBrainConfig = toml::de::from_str(&config_contents)?;

    return Ok(config);
}

pub fn write_config(config: &SecondBrainConfig) -> anyhow::Result<()> {
    let base_dir = xdg::BaseDirectories::new()?;
    let config_dir = base_dir.get_config_home();

    let config_contents = toml::ser::to_string(config)?;
    fs::write(config_dir.join(CONFIG_FILE), config_contents)?;

    return Ok(());
}

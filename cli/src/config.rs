use std::{collections::HashMap, fs};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SecondBrainConfig {
    pub providers: HashMap<String, ProviderConfig>,
    pub current_provider: String
}

impl Default for SecondBrainConfig {
    fn default() -> Self {
        return Self {
            providers: HashMap::new(),
            current_provider: String::new()
        };
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderConfig {
    pub description: Option<String>,
    pub api_key: Option<String>
}

impl Default for ProviderConfig {
    fn default() -> Self {
        return Self {
            description: None,
            api_key: None
        };
    }
}

pub const CONFIG_DIR: &str = "second-brain";
pub const CONFIG_FILE: &str = "config.toml";

pub fn read_config() -> anyhow::Result<Option<SecondBrainConfig>> {
    let base_dir = xdg::BaseDirectories::new()?;
    let config_dir = base_dir.get_config_home().join(CONFIG_DIR);
    if !config_dir.join(CONFIG_FILE).exists() {
        return Ok(None);
    }

    let config_contents = fs::read_to_string(config_dir.join(CONFIG_FILE))?;
    let config: SecondBrainConfig = toml::de::from_str(&config_contents)?;

    return Ok(Some(config));
}

pub fn write_config(config: &SecondBrainConfig) -> anyhow::Result<()> {
    let base_dir = xdg::BaseDirectories::new()?;
    let config_dir = base_dir.get_config_home().join(CONFIG_DIR);
    fs::create_dir_all(&config_dir)?;

    let config_contents = toml::ser::to_string(config)?;
    fs::write(config_dir.join(CONFIG_FILE), config_contents)?;

    return Ok(());
}

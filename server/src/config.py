import toml
from pathlib import Path
from typing import TypedDict, Optional

class ProviderConfig:
    description: Optional[str]
    api_key: Optional[str]
    model: Optional[str]

class Config(TypedDict):
    providers: dict[str, ProviderConfig]
    current_provider: str

CONFIG_DIR: str = "second-brain"
CONFIG_FILE: str = "config.toml"

def load_config() -> Config | None:
    config_filepath = Path.home().joinpath(CONFIG_DIR, CONFIG_FILE)
    if not config_filepath.exists():
        return None

    config_content = config_filepath.read_text()

    return toml.loads(config_content) # type: ignore
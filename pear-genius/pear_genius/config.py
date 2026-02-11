"""Configuration settings for Pear Genius agent."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # LLM Configuration
    anthropic_api_key: str = ""
    model_name: str = "claude-sonnet-4-20250514"
    max_tokens: int = 4096
    temperature: float = 0.1

    # AgentGateway / MCP Configuration
    agent_gateway_url: str = "http://localhost:3000"
    mcp_transport: str = "sse"  # sse or websocket

    # Keycloak Configuration
    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "pear"
    keycloak_client_id: str = "pear-genius"
    keycloak_client_secret: str = ""

    # Server Configuration
    server_host: str = "0.0.0.0"
    server_port: int = 8000
    cors_origins: list[str] = ["http://localhost:3001"]

    # Application Settings
    debug: bool = False
    log_level: str = "INFO"

    # Escalation Thresholds
    max_refund_amount: float = 500.0
    max_order_age_days: int = 90


settings = Settings()

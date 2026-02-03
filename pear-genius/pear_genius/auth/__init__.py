"""Authentication module for Pear Genius agent."""

from .keycloak import (
    KeycloakAuth,
    verify_token,
    extract_customer_context,
    AuthenticationError,
)

__all__ = ["KeycloakAuth", "verify_token", "extract_customer_context", "AuthenticationError"]

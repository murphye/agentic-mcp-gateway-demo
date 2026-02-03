"""Keycloak authentication for Pear Genius agent."""

import httpx
import structlog
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError

from ..config import settings
from ..state.conversation import CustomerContext, CustomerTier

logger = structlog.get_logger()


class AuthenticationError(Exception):
    """Raised when authentication fails."""

    pass


class KeycloakAuth:
    """
    Keycloak authentication handler.

    Handles JWT token verification and customer context extraction.
    """

    def __init__(
        self,
        keycloak_url: str | None = None,
        realm: str | None = None,
        client_id: str | None = None,
    ):
        self.keycloak_url = keycloak_url or settings.keycloak_url
        self.realm = realm or settings.keycloak_realm
        self.client_id = client_id or settings.keycloak_client_id

        self.issuer = f"{self.keycloak_url}/realms/{self.realm}"
        self.jwks_uri = f"{self.issuer}/protocol/openid-connect/certs"
        self._jwks_cache: dict | None = None

    async def get_jwks(self, force_refresh: bool = False) -> dict:
        """Fetch the JSON Web Key Set from Keycloak."""
        if self._jwks_cache is not None and not force_refresh:
            return self._jwks_cache

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.jwks_uri)
                response.raise_for_status()
                self._jwks_cache = response.json()
                return self._jwks_cache
            except httpx.HTTPError as e:
                logger.error("Failed to fetch JWKS", error=str(e))
                raise AuthenticationError(f"Failed to fetch JWKS: {e}")

    async def verify_token(self, token: str) -> dict:
        """
        Verify a JWT token from Keycloak.

        Args:
            token: JWT token string

        Returns:
            Decoded token claims

        Raises:
            AuthenticationError: If token is invalid or expired
        """
        try:
            # Get JWKS for signature verification
            jwks = await self.get_jwks()

            # Decode and verify the token
            # In production, you'd use the JWKS to verify the signature
            # For now, we'll do basic validation
            claims = jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                audience=self.client_id,
                issuer=self.issuer,
            )

            logger.info("Token verified successfully", sub=claims.get("sub"))
            return claims

        except ExpiredSignatureError:
            logger.warning("Token expired")
            raise AuthenticationError("Token has expired")
        except JWTError as e:
            logger.warning("Token verification failed", error=str(e))
            raise AuthenticationError(f"Invalid token: {e}")

    def extract_customer_context(self, claims: dict) -> CustomerContext:
        """
        Extract customer context from JWT claims.

        Expected claims:
        - sub: Customer ID
        - email: Customer email
        - name or preferred_username: Customer name
        - customer_tier: Loyalty tier (custom claim)
        - realm_access.roles: User roles
        """
        # Extract tier from custom claim or default to standard
        tier_claim = claims.get("customer_tier", "standard")
        try:
            tier = CustomerTier(tier_claim)
        except ValueError:
            tier = CustomerTier.STANDARD

        # Extract roles from realm_access
        realm_access = claims.get("realm_access", {})
        roles = realm_access.get("roles", [])

        return CustomerContext(
            customer_id=claims["sub"],
            email=claims.get("email", ""),
            name=claims.get("name", claims.get("preferred_username", "Customer")),
            tier=tier,
            roles=roles,
        )


# Module-level convenience functions


async def verify_token(token: str) -> dict:
    """Verify a JWT token and return claims."""
    auth = KeycloakAuth()
    return await auth.verify_token(token)


def extract_customer_context(claims: dict) -> CustomerContext:
    """Extract customer context from JWT claims."""
    auth = KeycloakAuth()
    return auth.extract_customer_context(claims)


# For development/testing without Keycloak
def create_test_customer_context(
    customer_id: str = "test-customer-123",
    email: str = "test@example.com",
    name: str = "Test Customer",
    tier: CustomerTier = CustomerTier.PLUS,
) -> CustomerContext:
    """Create a test customer context for development."""
    return CustomerContext(
        customer_id=customer_id,
        email=email,
        name=name,
        tier=tier,
        roles=["customer"],
    )

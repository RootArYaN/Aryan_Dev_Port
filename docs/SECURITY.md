# Security Model

This repository uses practical controls suitable for a public portfolio and a small private administration surface.

- Passwords are hashed with Argon2 and are never encrypted or logged.
- Contact details and messages are encrypted at the application layer with Fernet/MultiFernet-compatible keys.
- Authentication is stored in an HTTP-only cookie; state-changing admin calls also require a CSRF token.
- Unsafe cross-origin requests are rejected unless the `Origin` exactly matches an allow-listed frontend.
- CORS never uses `*` with credentials.
- Security headers include CSP, frame protection, MIME sniffing protection, referrer policy, and permissions policy.
- Public contact submissions use schema validation, a honeypot, request-size limits, and a fixed-window rate limiter.
- Secrets are read from environment variables. Vite variables are public and must never contain secrets.
- Production must use HTTPS, secure cookies, strong generated keys, a managed database, backups, dependency scanning, and server/platform rate limits.

## Known trade-offs

The included rate limiter is process-local so the starter remains understandable. Replace it with Redis or infrastructure-level limiting when running multiple API instances. Background email uses FastAPI background tasks; use a durable queue/outbox worker for business-critical delivery.

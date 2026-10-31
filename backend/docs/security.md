# Security Guidelines
- Never commit `.env`, passwords, signing keys, OAuth secrets, or payment credentials.
- Use environment variables locally and a managed secret store in production.
- Hash passwords; never store plaintext passwords.
- Enforce ownership checks for profiles, watchlists, and watch history.
- Verify payment webhook signatures.
- Use short-lived access tokens and secure refresh-token rotation.

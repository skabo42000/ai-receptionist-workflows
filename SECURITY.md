# Security and data handling

## Scope

This repository is a portfolio / demonstration project. Public files and Git history were scanned with Gitleaks 8.30.1, and runtime dependency versions were checked against npm / PyPI vulnerability databases during the October 4, 2026 release. These checks find known patterns and advisories; they are not a penetration test or a guarantee that the application is secure.

Keep secrets in private environment variables or a secret manager. `.env.example` is a blank template. Do not commit populated workflow exports, databases, uploads, customer records, transcripts, recordings or provider keys. A public frontend variable is visible to every visitor.

## Reporting

Report a suspected issue privately through the contact channel at [synqlogic.com](https://synqlogic.com). Include the repository, affected component and a minimal synthetic reproduction. Do not put credentials or personal data in a public GitHub issue. Rotate any exposed live secret immediately; removing it from a file does not invalidate it or erase history.

## Automated controls

The security workflow scans Git history on pushes / pull requests with fully redacted output. Workflow permissions are read-only, official checkout is pinned to a commit, and the scanner archive is verified by SHA-256 before execution. Dependency update checks are configured weekly. Review and test updates before merging them.

## Project-specific boundaries

- Full npm audit also reports the high-severity [braces stack-exhaustion advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through the **development-only** ESLint / fast-glob chain (five affected package entries, one advisory). As of this release, braces 3.0.3 is the latest published version and has no patch for this issue. Production-only npm audit is clean. Keep lint glob patterns under developer control, avoid untrusted nested patterns, and update when upstream publishes a fix. The automated production audit does not conceal or waive the full-audit finding.

- The public reference has blank integration settings, inactive calendar workflows, placeholder calendar IDs and no live alert receiver in the assistant template. No calls or bookings occur merely from cloning it.
- Vapi public keys and assistant IDs are visible in the browser. Private keys and n8n shared secrets must stay server-side. Restrict allowed domains and use provider spending / duration limits.
- Authenticate chat, alert and voice tool webhooks in n8n before processing any event. The alert helper is not an authentication layer. Prompt instructions are not an authorization boundary.
- Browser POST routes reject missing / foreign Origin headers. A caller can forge headers outside a browser; these checks do not establish caller identity.
- Local rate counters are per process, reset on restart and trust forwarded IPs only behind a proxy that overwrites spoofed headers. Use shared limits and hard upstream quotas for public traffic.
- Voice and chat can transmit personal data to third parties. Set recording consent, retention, log redaction and privacy disclosures before enabling them. Analytics is off unless explicitly enabled.
- Booking / quotes on the showcase UI are simulations. The separate calendar write template can create actual appointments once configured and activated; confirm with the caller and reconcile uncertain retries.

# Login Abuse-Protection Plan

## Goals

- Reduce credential-stuffing and brute-force risk.
- Slow abusive traffic before it reaches Supabase auth.
- Preserve user experience for legitimate users.

## Current Baseline

- App-level edge rate limiting in proxy for login and general routes.
- Security headers and CSP configured at app level.

## Threats Covered

- High-volume password guessing.
- Distributed low-and-slow credential stuffing.
- Signup abuse and fake account generation.
- Replay of leaked username/password pairs.

## Phase 1: Immediate (1-3 days)

1. Enforce provider-side protections in Supabase Auth:
- Enable email confirmation.
- Ensure password complexity and length requirements.
- Review and tighten auth rate limits in project settings.

2. Add WAF and bot controls at the edge:
- Enable managed bot protection.
- Add challenge for repeated hits to /login and /signup.
- Add geo/ASN blocking rules if attack patterns are clear.

3. Monitor and alert:
- Alert on spikes in login attempts per minute.
- Alert on login failure ratio exceeding baseline.
- Alert on unusual country or ASN concentration.

## Phase 2: Application Controls (3-7 days)

1. Progressive friction:
- After 3 failed attempts in 10 minutes (per IP + identifier), require CAPTCHA.
- After 6 failed attempts in 10 minutes, delay responses progressively (2s, 4s, 8s).
- After 10 failed attempts in 15 minutes, temporary lock for 15 minutes.

2. Identifier-aware limits:
- Rate limit by IP.
- Rate limit by email hash prefix.
- Rate limit by IP + email pair.

3. Signup abuse prevention:
- CAPTCHA on signup.
- Domain and disposable-email screening.
- Optional invite-only mode during attack windows.

## Phase 3: Hardening (1-2 weeks)

1. Centralized rate-limit storage:
- Move from in-memory edge counters to shared store (for example Redis/Upstash) for multi-region consistency.

2. Device/session signals:
- Track failed attempts by device fingerprint and session signals.
- Increase friction based on risk score.

3. Incident automation:
- Auto-apply strict mode when thresholds are crossed.
- Tighten route limits and force challenge mode temporarily.

## Suggested Starting Thresholds

- /login: 20 requests per minute per IP (already applied).
- /signup: 10 requests per minute per IP.
- Global page limit: 240 requests per minute per IP (already applied).
- CAPTCHA trigger: 3 failed logins per 10 minutes.
- Lockout trigger: 10 failed logins per 15 minutes.

## UX and Safety Notes

- Always return generic auth errors to avoid user enumeration.
- Keep lockout messages generic and include wait-time guidance.
- Allow password reset path even during lockout, with abuse safeguards.

## Operational Playbook

1. Detect
- Alert fires on failure-rate and traffic anomaly.

2. Triage
- Confirm attack type and top source indicators.

3. Mitigate
- Turn on strict WAF challenge mode for /login and /signup.
- Raise edge friction and lower burst thresholds temporarily.

4. Recover
- Return thresholds to baseline gradually.
- Review logs and tune permanent rules.

## Validation Checklist

- Simulate repeated failed logins and verify CAPTCHA/lockout behavior.
- Verify normal users can still authenticate under moderate load.
- Verify alerts trigger for synthetic attack traffic.
- Verify no sensitive backend error details are exposed to clients.

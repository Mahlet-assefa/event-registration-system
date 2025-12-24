# Baseline Record

**Baseline ID:** BL2
**Date:** 2025-12-24
**Type:** Working Prototype + CR Fixes

## Description
This baseline incorporates three major change requests into the working prototype:
- **CR-001**: Event Capacity Validation (prevents overbooking).
- **CR-002**: Enhanced Authentication Feedback (improved login UX).
- **CR-003**: Environmental Configuration (removed hardcoded data paths).

## Change Requests Summary
| CR ID | Title | Status |
|---|---|---|
| CR-001 | Event Capacity Validation | Implemented |
| CR-002 | Enhanced Authentication Feedback | Implemented |
| CR-003 | Externalize JSON Data File Path | Implemented |

## Contents
- **docs/**
    - DOC-Plan-SCMP-v1.0.docx
    - DOC-Registry-CI-v1.0.docx
    - DOC-API-Endpoints-v1.0.md
    - DOC-Setup-Guide-v1.0.md
    - DOC-Record-Baseline1-v1.0.md
    - DOC-Record-Baseline2-v1.0.md
- **src/**
    - client/ (React)
    - server/ (Express with .env support)
- **data/**
    - events.json (with capacity field)
    - users.json
    - registrations.json

## Verification Status
- CR-001: Verified via registration logic.
- CR-002: Verified via login form validation.
- CR-003: Verified via environment variable loading.

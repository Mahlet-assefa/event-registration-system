# Release Notes - v1.1

**Release Date:** 2025-12-24
**Baseline:** BL2

## Functional Upgrade & CR Implementations
This release incorporates major feature updates and addresses approved change requests.

### New Features
- **User Authentication**: Full login and registration system with JWT security.
- **Event Management**: Admin capability to create, update, and delete events.
- **Registration Flow**: Users can browse and register for events.

### Implemented Change Requests
- **CR-001 (Capacity Validation)**: Prevents overbooking by enforcing maximum event capacity.
- **CR-002 (Enhanced Feedback)**: Improved login error messages and form validation.
- **CR-003 (Env Config)**: Externalized data paths and secrets via `.env`.

### Improvements
- Strict documentation naming convention (`DOC-<Category>-<Name>-v<Ver>`).
- Consolidation of all features on the `master` branch.

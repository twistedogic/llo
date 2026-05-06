## MODIFIED Requirements

### Requirement: PWA installability
The system SHALL be installable as a PWA with a service worker that precaches all static assets and provides navigation fallback to the app shell, enabling full offline use after installation.

#### Scenario: Installable on mobile
- **WHEN** user visits the app in a supporting browser
- **THEN** the browser presents an install prompt (deferred until after first commit)

#### Scenario: Loads offline after install
- **WHEN** installed PWA is opened with no network
- **THEN** app loads fully from service worker cache

#### Scenario: Navigation works offline
- **WHEN** user is offline and navigates between app views (e.g., Dashboard to History)
- **THEN** navigation is served from service worker via `index.html` fallback, not a network error

#### Scenario: Static assets served offline
- **WHEN** offline and the app requests a JS, CSS, or image asset
- **THEN** the asset is served from the service worker cache
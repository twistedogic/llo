## ADDED Requirements

### Requirement: Offline-first IndexedDB storage
The system SHALL store all data locally in IndexedDB and SHALL function fully offline with no network dependency.

#### Scenario: App works offline
- **WHEN** device has no network connection
- **THEN** all entry, viewing, and export features work without degradation

#### Scenario: Data persists across sessions
- **WHEN** user closes and reopens the app
- **THEN** all previously committed data is present

### Requirement: Immutable committed days
The system SHALL prevent modification of any day that has been committed, enforced at the storage layer.

#### Scenario: Committed day write blocked
- **WHEN** code attempts to write to a committed day's record
- **THEN** the write is rejected and an error is returned

### Requirement: Daily log schema
The system SHALL store each committed day as a single record keyed by date (YYYY-MM-DD), containing all metric entries, energy values, journal, committed flag, and commit timestamp.

#### Scenario: Record structure
- **WHEN** a day is committed
- **THEN** the stored record contains date, committed=true, committedAt timestamp, entries map, energyStart, energyEnd, and journal fields

### Requirement: PWA installability
The system SHALL be installable as a PWA with a service worker caching all app assets for offline use.

#### Scenario: Installable on mobile
- **WHEN** user visits the app in a supporting browser
- **THEN** the browser presents an install prompt (deferred until after first commit)

#### Scenario: Loads offline after install
- **WHEN** installed PWA is opened with no network
- **THEN** app loads fully from service worker cache

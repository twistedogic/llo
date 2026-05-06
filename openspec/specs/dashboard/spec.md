## ADDED Requirements

### Requirement: Auto-switch home screen
The system SHALL show the daily entry flow when today is not committed, and automatically show the Trends screen when today is already committed.

#### Scenario: Entry screen on uncommitted day
- **WHEN** user opens the app and today has no committed entry
- **THEN** the first metric card is shown immediately

#### Scenario: Trends on committed day
- **WHEN** user opens the app and today is already committed
- **THEN** the Monthly Trends view is shown

### Requirement: Direction rows by group
The system SHALL display a direction row per metric on the Dashboard, grouped into Social, Body, Mind, and Life, each row showing the metric name, 14-day rolling average with unit, and a directional symbol. Direction SHALL be communicated by symbol alone — no color differentiation between up, down, and neutral states.

#### Scenario: Group layout preserved
- **WHEN** Dashboard is shown
- **THEN** metrics are visually grouped under Social, Body, Mind, and Life headings

#### Scenario: Direction symbol shown
- **WHEN** sufficient data exists (≥ 7 committed entries)
- **THEN** each metric row shows a symbol: ↑ for up, ↓ for down, or · for flat

#### Scenario: No arrow when insufficient data
- **WHEN** fewer than 7 committed entries exist for a metric
- **THEN** the direction position shows a dash (—) instead of a symbol

#### Scenario: Rolling average shown
- **WHEN** at least one committed entry exists for a metric
- **THEN** the 14-day rolling average is displayed with the metric's unit

#### Scenario: No guilt language
- **WHEN** a metric is trending down
- **THEN** the UI shows the direction indicator without shame-inducing language or red breach states

#### Scenario: All direction symbols same color
- **WHEN** direction symbols are rendered
- **THEN** ↑, ↓, and · are all rendered in the same color (no color-coded status)

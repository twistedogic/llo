## ADDED Requirements

### Requirement: Auto-switch home screen
The system SHALL show the daily entry flow when today is not committed, and automatically show the Trends screen when today is already committed.

#### Scenario: Entry screen on uncommitted day
- **WHEN** user opens the app and today has no committed entry
- **THEN** the first metric card is shown immediately

#### Scenario: Trends on committed day
- **WHEN** user opens the app and today is already committed
- **THEN** the Monthly Trends view is shown

### Requirement: SLO status bars by group
The system SHALL display SLO status for all 9 metrics on the Dashboard, grouped into Social, Body, Mind, and Life, each with a progress bar showing compliance percentage and a pass/breach indicator.

#### Scenario: Group layout
- **WHEN** Dashboard is shown
- **THEN** metrics are visually grouped under Social, Body, Mind, and Life headings

#### Scenario: SLO passing indicator
- **WHEN** a metric's SLO compliance meets its target
- **THEN** the indicator is shown in a passing state (green)

#### Scenario: SLO breaching indicator
- **WHEN** a metric's SLO compliance falls below its target
- **THEN** the indicator is shown in a warning state (amber or red)

### Requirement: Error budget bars
The system SHALL display remaining error budget as a progress bar for rate-based SLO metrics (Sleep, Exercise, Family Time) on the Dashboard.

#### Scenario: Budget bar visible
- **WHEN** Dashboard is shown
- **THEN** Sleep, Exercise, and Family Time each show a budget bar with remaining days labeled

#### Scenario: Budget depleted
- **WHEN** remaining budget for a metric reaches 0
- **THEN** budget bar is fully depleted and metric is marked breaching

### Requirement: No guilt language
The system SHALL never display streak counters, missed-day counts, or any language that frames absence or SLO breach as personal failure.

#### Scenario: Neutral SLO breach language
- **WHEN** an SLO is breaching
- **THEN** the UI shows the compliance percentage and budget remaining without shame-inducing copy

## ADDED Requirements

### Requirement: Calendar heatmap
The system SHALL render a monthly calendar heatmap where each day is coloured by overall SLO health, with distinct treatment for absent days.

#### Scenario: Committed day colouring
- **WHEN** a day is committed with all SLOs passing
- **THEN** the day cell is shown in full colour

#### Scenario: Partial SLO day
- **WHEN** a day is committed with some SLOs breaching
- **THEN** the day cell is shown in a mixed/partial colour state

#### Scenario: Absent day treatment
- **WHEN** a day has no committed entry
- **THEN** the day cell is shown as empty/outline, visually distinct from a committed day

### Requirement: Day drill-down
The system SHALL allow tapping any committed day on the calendar to view all metric values and the journal entry for that day.

#### Scenario: Day detail shows all metrics
- **WHEN** user taps a committed day
- **THEN** all 9 metric values (or skipped state) for that day are displayed

#### Scenario: Journal shown in day detail
- **WHEN** user taps a committed day that has a journal entry
- **THEN** the journal text is shown beneath the metric values

#### Scenario: Absent day is not tappable
- **WHEN** user taps an absent day
- **THEN** no detail view opens (absent days have no data)

### Requirement: Month navigation
The system SHALL allow navigating between months in the history view.

#### Scenario: Previous month navigation
- **WHEN** user taps the previous arrow
- **THEN** the calendar updates to show the previous month's data

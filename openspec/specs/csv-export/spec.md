## ADDED Requirements

### Requirement: CSV export of all committed days
The system SHALL allow the user to export all committed daily log data as a CSV file, downloadable from within the app.

#### Scenario: Export triggered by user
- **WHEN** user taps the Export CSV button
- **THEN** a CSV file is downloaded to the device

#### Scenario: CSV structure
- **WHEN** CSV is generated
- **THEN** it contains one row per committed day with columns: date, committed_at, smile, helped, thanked, sleep_hours, exercise_hours, concepts, cognitive_load, family_hours, energy_start, energy_end, energy_delta, journal

#### Scenario: Absent days omitted
- **WHEN** CSV is generated
- **THEN** days with no committed entry are not included

#### Scenario: Skipped values exported as empty
- **WHEN** a metric was skipped on a committed day
- **THEN** the corresponding CSV cell is empty (not 0)

#### Scenario: No data state
- **WHEN** user triggers export with no committed days
- **THEN** system shows a message indicating no data to export rather than downloading an empty file

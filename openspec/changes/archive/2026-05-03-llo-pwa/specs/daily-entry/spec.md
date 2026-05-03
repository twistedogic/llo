## ADDED Requirements

### Requirement: Sequential card swipe entry
The system SHALL present daily metric entry as a sequential card-swipe flow, one metric per card, navigable forward and backward before commit.

#### Scenario: Forward navigation
- **WHEN** user taps Done or swipes forward on a card
- **THEN** system advances to the next card in the sequence

#### Scenario: Backward navigation
- **WHEN** user swipes backward on a card
- **THEN** system returns to the previous card with its previously entered values intact

### Requirement: Card sequence order
The system SHALL present cards in a fixed order: social metrics (Smile, Helped, Thanked), body metrics (Sleep, Exercise), mind metrics (Concepts, Cognitive Load), life metrics (Family Time, Energy), then Journal, then Commit.

#### Scenario: Fixed sequence
- **WHEN** user begins daily entry
- **THEN** the first card shown is People I Made Smile

#### Scenario: Journal and Commit are always last
- **WHEN** user reaches the end of metric cards
- **THEN** Journal card is shown, followed by Commit card

### Requirement: Type B numeric card input
The system SHALL render Type B (numeric) metrics as a number input with increment/decrement controls, pre-filled with the rolling average for that metric.

#### Scenario: Default value is rolling average
- **WHEN** a Type B card is shown
- **THEN** the input is pre-filled with the rolling average of that metric over the last 30 days

#### Scenario: First week placeholder
- **WHEN** fewer than 7 days of data exist for a metric
- **THEN** the input is pre-filled with the metric's SLO target value, labeled as "target"

#### Scenario: Skip sets value to zero for count metrics
- **WHEN** user taps Skip on a count metric card
- **THEN** the metric is recorded as skipped with value 0

### Requirement: Energy card dual input
The system SHALL render the Energy card with two inputs — Start of Day and End of Day — and display the derived delta automatically.

#### Scenario: Delta is derived
- **WHEN** user enters both start and end energy values
- **THEN** system displays delta = end - start, not editable

#### Scenario: Skip energy card
- **WHEN** user taps Skip on the Energy card
- **THEN** both start and end values are recorded as skipped

### Requirement: Journal card
The system SHALL render a single free-text journal card shared across all metrics for the day, positioned after all metric cards and before the Commit card.

#### Scenario: Journal is optional
- **WHEN** user leaves the journal blank and taps Done
- **THEN** system proceeds to the Commit card with a null journal entry

#### Scenario: Journal persists on back navigation
- **WHEN** user navigates back from Commit to Journal
- **THEN** previously entered journal text is preserved

### Requirement: Commit card and immutable seal
The system SHALL present a Commit card as the final step, showing a summary of logged vs skipped metrics, and seal the day as immutable upon confirmation.

#### Scenario: Commit summary shown
- **WHEN** user reaches the Commit card
- **THEN** system displays count of metrics logged and count skipped

#### Scenario: Day is sealed on commit
- **WHEN** user taps Commit Day
- **THEN** day is marked committed with a timestamp and no further edits are possible

#### Scenario: Commit only possible same day
- **WHEN** user attempts to commit a day other than today
- **THEN** system does not allow commit (historical days are read-only)

### Requirement: Absence as signal
The system SHALL treat days with no committed entry as absent — not as zero — and SHALL NOT prompt, remind, or display guilt-inducing messaging about uncompleted days.

#### Scenario: No reminder on open
- **WHEN** user opens the app on a day with no entry
- **THEN** system shows the entry flow without any streak counter, reminder banner, or missed-day message

#### Scenario: Absence excluded from SLO denominator
- **WHEN** SLO compliance is computed
- **THEN** days with no committed entry are excluded from the window denominator

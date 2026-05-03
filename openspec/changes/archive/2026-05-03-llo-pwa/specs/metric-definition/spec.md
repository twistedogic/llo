## ADDED Requirements

### Requirement: Metric schema
The system SHALL define each metric with the following fields: id, name, group, type (A or B), unit, sloTarget, sloCondition (gte/lte), sloWindow (days), sloRate (for rate SLOs), invertDisplay, whySentence.

#### Scenario: All fields present
- **WHEN** a metric definition is loaded
- **THEN** all required fields are present and typed correctly

### Requirement: Pre-configured 9 metrics
The system SHALL ship with 9 pre-configured metrics matching the LLO design, grouped into Social, Body, Mind, and Life.

#### Scenario: Social group metrics
- **WHEN** the app initialises
- **THEN** metrics People I Made Smile, People I Helped, and People I Thanked are present in the Social group

#### Scenario: Body group metrics
- **WHEN** the app initialises
- **THEN** metrics Hours of Sleep and Hours of Exercise are present in the Body group

#### Scenario: Mind group metrics
- **WHEN** the app initialises
- **THEN** metrics Concepts Learnt and Cognitive Load are present in the Mind group

#### Scenario: Life group metrics
- **WHEN** the app initialises
- **THEN** metrics Family Active Time and Energy are present in the Life group

### Requirement: Invert flag for cognitive load
The system SHALL support an invertDisplay flag that reverses the visual direction of a metric in charts and marks SLO breach when the value exceeds (not falls below) the threshold.

#### Scenario: Cognitive load SLO breach
- **WHEN** Cognitive Load rolling average exceeds 6
- **THEN** SLO is marked as breached

#### Scenario: Inverted chart direction
- **WHEN** a metric with invertDisplay=true is shown in a trend chart
- **THEN** lower values appear in the positive/green zone and higher values appear in the warning/red zone

### Requirement: Why sentence
Each metric SHALL carry a single "why" sentence expressing the third-order outcome it is building toward, surfaced in the trend view.

#### Scenario: Why sentence visible on trend
- **WHEN** user views the monthly trend for a metric
- **THEN** the why sentence is displayed beneath the metric name

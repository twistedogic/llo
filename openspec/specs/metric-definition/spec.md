## ADDED Requirements

### Requirement: Metric schema without SLO config
The system SHALL define each metric with the following fields only: `id`, `name`, `group`, `type` (count | hours | scale), `unit`, `invertDisplay`, `whySentence`. No target or SLO fields.

#### Scenario: Schema fields present
- **WHEN** a metric definition is loaded
- **THEN** it contains `id`, `name`, `group`, `type`, `unit`, `invertDisplay`, and `whySentence` and does NOT contain `sloTarget`, `sloCondition`, `sloWindow`, or `sloRate`

### Requirement: Pre-configured 9 metrics
The system SHALL ship with 9 pre-configured metrics matching the LLO design, grouped into Social, Body, Mind, and Life. The interactions metric SHALL appear first in the list overall and first within the Social group.

#### Scenario: Social group metrics
- **WHEN** the app initialises
- **THEN** metrics People I Interacted With, People I Made Smile, People I Helped, and People I Thanked are present in the Social group

#### Scenario: Interactions metric is first
- **WHEN** the metrics list is iterated
- **THEN** People I Interacted With is the first element at index 0

#### Scenario: Body group metrics
- **WHEN** the app initialises
- **THEN** metrics Hours of Sleep and Hours of Exercise are present in the Body group

#### Scenario: Mind group metrics
- **WHEN** the app initialises
- **THEN** metrics Concepts Learnt and Things Deferred are present in the Mind group

#### Scenario: Life group metrics
- **WHEN** the app initialises
- **THEN** Family Active Time is present in the Life group

### Requirement: Invert flag for deferrals
The system SHALL support an invertDisplay flag that reverses the visual direction indicator for a metric so that lower values appear positive and higher values appear as a warning.

#### Scenario: Inverted direction display
- **WHEN** a metric with invertDisplay=true is trending up
- **THEN** the direction arrow is rendered in warning colour, not the positive accent colour

### Requirement: Why sentence
Each metric SHALL carry a single "why" sentence expressing the third-order outcome it is building toward, surfaced in the trend view.

#### Scenario: Why sentence visible on trend
- **WHEN** user views the monthly trend for a metric
- **THEN** the why sentence is displayed beneath the metric name

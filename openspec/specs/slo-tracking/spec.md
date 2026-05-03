## ADDED Requirements

### Requirement: Rate SLO for habit and count metrics
The system SHALL compute SLO compliance for count and Type A habit metrics as the percentage of committed days within the rolling window where the value meets or exceeds the target.

#### Scenario: Rate SLO passing
- **WHEN** Sleep ≥ 7h on 85% of committed days in the last 30
- **THEN** Sleep SLO is marked passing

#### Scenario: Rate SLO failing
- **WHEN** Sleep ≥ 7h on 70% of committed days in the last 30
- **THEN** Sleep SLO is marked breaching (target is 80%)

### Requirement: Average SLO for scale metrics
The system SHALL compute SLO compliance for 1–10 scale metrics (mood, cognitive load, energy) as the rolling average over the window compared to the threshold.

#### Scenario: Energy average SLO
- **WHEN** average Energy Start over last 30 committed days is 7.2
- **THEN** Energy Start SLO (target ≥ 7) is passing

#### Scenario: Cognitive load inverted SLO
- **WHEN** average Cognitive Load over last 30 committed days is 6.8
- **THEN** Cognitive Load SLO (target ≤ 6) is breaching

### Requirement: Error budget and burn rate
The system SHALL compute the remaining error budget (days of allowed misses before SLO breach) and current burn rate for each rate-based SLO.

#### Scenario: Budget computation
- **WHEN** Exercise SLO target is 5x/week (≈71%) over 30 days and 4 misses have occurred in last 30 committed days
- **THEN** budget remaining = allowed misses (9) - actual misses (4) = 5 days

#### Scenario: Budget exhausted
- **WHEN** remaining budget reaches 0
- **THEN** SLO is marked breaching on the dashboard

### Requirement: Window support
The system SHALL support SLO computation over 7-day, 30-day, and 90-day rolling windows, using only committed days in the denominator.

#### Scenario: Absent days excluded
- **WHEN** computing 30-day SLO compliance with 5 absent days in the window
- **THEN** denominator is 25, not 30

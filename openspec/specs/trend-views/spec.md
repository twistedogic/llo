## ADDED Requirements

### Requirement: Weekly sparkline view
The system SHALL render a weekly view showing sparkline charts for each metric comparing the current week to the previous week, with directional delta indicators.

#### Scenario: Sparkline per metric
- **WHEN** user selects the Weekly tab in Trends
- **THEN** one sparkline per metric is shown with 7 data points, absent days rendered as gaps

#### Scenario: Delta indicator
- **WHEN** current week average differs from previous week average
- **THEN** a directional arrow and numeric delta are shown beside each sparkline

### Requirement: Monthly line chart view
The system SHALL render a monthly view showing a full line chart per metric with the SLO goal line, absent days as gaps (null values, not zero), and the why sentence beneath the metric name.

#### Scenario: Gap for absent days
- **WHEN** a day in the month has no committed entry
- **THEN** the line chart shows a gap at that date, not a zero data point

#### Scenario: Goal line visible
- **WHEN** monthly chart is rendered
- **THEN** a dashed horizontal line at the SLO target value is visible

#### Scenario: Why sentence displayed
- **WHEN** monthly chart is rendered for a metric
- **THEN** the why sentence is shown beneath the metric name

### Requirement: Quarterly smoothed trend view
The system SHALL render a quarterly view showing smoothed (rolling 7-day average) trend curves per metric over the last 90 days, with ±1 standard deviation bands.

#### Scenario: Smoothed curve
- **WHEN** user selects the Quarterly tab
- **THEN** each metric is shown as a smoothed curve, not raw daily values

#### Scenario: Deviation bands
- **WHEN** quarterly curve is rendered
- **THEN** a shaded band representing ±1 standard deviation is visible around the curve

### Requirement: Correlation heatmap
The system SHALL render a correlation heatmap showing Pearson correlation coefficients between all metric pairs over the last 30 committed days, with shade intensity representing correlation strength.

#### Scenario: Heatmap matrix
- **WHEN** user views the Correlation tab
- **THEN** a symmetric matrix of all 9 metrics is shown with shade intensity per cell

#### Scenario: Cell tap shows scatter
- **WHEN** user taps a correlation cell
- **THEN** a scatter plot of the two metrics' daily values over the window is shown

#### Scenario: Minimum data requirement
- **WHEN** fewer than 14 committed days exist
- **THEN** correlation heatmap displays a placeholder message instead of the matrix

### Requirement: Time window switcher
The system SHALL provide a tab or toggle to switch between Weekly, Monthly, and Quarterly views within the Trends screen.

#### Scenario: Default to monthly
- **WHEN** Trends screen opens
- **THEN** the Monthly view is shown by default

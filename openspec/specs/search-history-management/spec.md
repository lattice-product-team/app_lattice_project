## ADDED Requirements

### Requirement: Persistent Search History
The system SHALL store the last 10 successful search queries locally using MMKV.

#### Scenario: Storing a new search
- **WHEN** the user submits a search query "Concerts"
- **THEN** "Concerts" is added to the top of the history list in MMKV

#### Scenario: Deduplication
- **WHEN** the user searches for "Concerts" and it already exists in history
- **THEN** the existing entry is moved to the top of the list without duplication

### Requirement: Clear Search History
The system SHALL provide a mechanism to delete all recent search entries.

#### Scenario: Clearing all history
- **WHEN** the user taps the "Clear" button in the search history view
- **THEN** the `recent_searches` key in MMKV is emptied and the UI updates immediately

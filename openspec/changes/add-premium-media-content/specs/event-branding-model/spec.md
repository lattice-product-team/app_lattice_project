## ADDED Requirements

### Requirement: Secondary Visual Assets
The Event Branding Model SHALL include support for secondary visual assets, specifically a `banner_url` for header backgrounds and a `gallery_urls` collection for carousel content.

#### Scenario: Defining event banners
- **WHEN** an event is created or updated
- **THEN** the system MUST allow defining an optional `bannerUrl` that is distinct from the primary `imageUrl`.

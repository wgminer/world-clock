# World Clock App - Implementation Plan

## Overview
A minimal, brutalist Swiss-style world clock application that displays multiple time zones in a responsive grid layout.

## Design Principles
- **Brutalist**: Raw, unadorned, functional design
- **Swiss Style**: Clean typography, grid-based layout, minimal color palette
- **Minimal**: No unnecessary elements, focus on time display

## Core Features

### 1. Grid Layout
- Responsive grid that adjusts based on number of clocks
- Equal rows and columns where possible
- First item always shows user's current time zone
- Grid automatically reorganizes when clocks are added/removed

### 2. Clock Display
- 12-hour format with AM/PM
- Time zone name/location
- Day/night indicator (visual or icon)
- Large, readable typography (Swiss style)

### 3. URL State Management
- Time zones encoded in URL (query parameters or hash)
- Format: `?zones=America/New_York,Europe/London,Asia/Tokyo`
- URL updates when clocks are added/removed
- App reads from URL on load

### 4. Add Clock Functionality
- "+" button or "Add" button
- Opens modal with time zone selector
- Searchable/filterable list of time zones
- Adds selected time zone to grid
- Updates URL

### 5. Delete Clock Functionality
- Delete button on each clock (except first one if it's user's timezone)
- Removes clock from grid
- Updates URL

### 6. User's Time Zone
- Automatically detects user's time zone
- Always displayed as first item
- Cannot be deleted (or can be deleted but will be re-added)

## Technical Stack
- **React** (with hooks)
- **Vite** (for build tooling)
- **CSS** (minimal, brutalist styling)
- **Date-fns** or native Intl API (for time zone handling)

## Component Structure
```
App
├── ClockGrid
│   ├── ClockCard (multiple)
│   │   ├── TimeDisplay
│   │   ├── TimeZoneLabel
│   │   ├── DayNightIndicator
│   │   └── DeleteButton
│   └── AddClockButton
└── TimeZoneModal
    ├── SearchInput
    └── TimeZoneList
```

## Styling Approach
- Monospace or geometric sans-serif font
- High contrast (black/white or dark/light)
- Bold borders, no shadows
- Grid-based layout
- Minimal color palette (maybe accent for day/night)

## State Management
- URL as single source of truth
- Parse time zones from URL on mount
- Update URL when adding/removing
- Sync state with URL changes (browser back/forward)

## Implementation Steps
1. Set up React + Vite project
2. Create basic component structure
3. Implement URL parsing and state management
4. Build clock display component with time updates
5. Implement grid layout
6. Add time zone selection modal
7. Add delete functionality
8. Style with brutalist/Swiss aesthetic
9. Add day/night indicator
10. Test and refine

## Future Enhancements (Post-MVP)
- Weather information for each location
- Additional location details
- Customizable clock formats
- Time zone abbreviations display

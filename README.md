# World Clock

A minimal, brutalist Swiss-style world clock application.

## Features

- Display multiple time zones in a responsive grid
- Time zones stored in URL for easy sharing
- Add/remove clocks with a simple interface
- 12-hour format with AM/PM
- Day/night indicator for each time zone
- Automatically detects and displays your local time zone

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push your code:**
   - The workflow will automatically deploy when you push to the `main` branch
   - You can also manually trigger it from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your site:**
   - Your site will be available at `https://[your-username].github.io/world-clock/`
   - The URL will be shown in the repository's **Settings** → **Pages** section

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# Install gh-pages package (one-time setup)
npm install --save-dev gh-pages

# Add deploy script to package.json:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Usage

1. The app automatically displays your local time zone
2. Click the "+" button to add more time zones
3. Click the "×" button on any clock to remove it (except your local time zone if it's the only one)
4. The URL updates automatically - share it to preserve your clock configuration

## Design

- Brutalist aesthetic with bold borders and high contrast
- Swiss typography with clean, geometric fonts
- Minimal color palette (black/white with accent colors for day/night)
- Responsive grid layout that adapts to the number of clocks

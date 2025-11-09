# Architecture & State Management

This document outlines the architecture of the `course-logs` application.

## Application Structure

The app uses **Alpine.js for reactivity** with a single main component (`courseApp`) that manages all state and business logic. The architecture emphasizes:

1.  **Component-based structure**: Main logic in `src/course-app.js`, entry point in `src/app.js`.
2.  **Build system**: `esbuild` bundles Alpine.js with the app into a single IIFE (`dist/app.js`).
3.  **CSS compilation**: Tailwind v4 uses CSS-based `@theme` config in `src/input.css` (not `tailwind.config.js`).
4.  **Data persistence**: All user data is saved to `localStorage` with auto-save on every change.

### Key Files and Their Roles

-   **`src/app.js`**: Entry point that imports Alpine.js, plugins, and registers the main component.
-   **`src/course-app.js`**: Main Alpine.js component containing all app logic (state, methods, computed properties).
-   **`src/input.css`**: Tailwind v4 CSS source with `@theme` configuration and custom styles.
-   **`build-js.js`**: `esbuild` configuration for bundling JavaScript.
-   **`index.html`**: The single-page application markup.
-   **`data/courses.json`**: Default course data and settings.
-   **`locales/*.json`**: Translation files for EN, ID, JA languages.
-   **`playwright.config.js`**: E2E test configuration.
-   **`tests/comprehensive.spec.js`**: The comprehensive test suite.

## State Management

All state is managed within the main Alpine.js `courseApp()` component in `src/course-app.js`:

-   `courses[]`: Array of course objects.
-   `settings{}`: Semester configuration and credit limits.
-   `semesterList[]`: Dynamically generated semester structure.
-   `language`: Current language (EN/ID/JA).
-   `translations{}`: Loaded translation strings.
-   Modal states: `showAddModal`, `showSettingsModal`, etc.

## Data Flow

1.  **Initialization (`init()`)**:
    -   Load translations from `locales/{language}.json`.
    -   Fetch default data from `data/courses.json`.
    -   Load user data from `localStorage` (which overrides defaults).
    -   Generate the semester structure based on settings.
2.  **User Actions**:
    -   All actions trigger methods within the `courseApp` component that update the state.
    -   State changes are automatically saved to `localStorage`.
    -   Alpine.js reactivity updates the UI automatically.

## Performance Optimizations

The app is highly optimized for Core Web Vitals. Key techniques include:
-   **Layout Stability**: Reserving heights for dynamic containers, inlining critical CSS, and using `x-cloak`.
-   **Resource Loading**: Preloading critical assets and prefetching translations.
-   **Runtime Optimizations**: Caching computed properties and using efficient DOM updates via Alpine.js.

## Tailwind CSS v4 Important Notes

This project uses **Tailwind CSS v4**, which has significant differences from v3:

1.  **CSS-based configuration**: Uses `@theme` in `src/input.css` instead of `tailwind.config.js`.
2.  **Build command**: `tailwindcss -i ./src/input.css -o ./dist/output.css`.
3.  **No JavaScript config**: All theme customization is done in CSS.

**When modifying styles, always edit `src/input.css` and rebuild the CSS.**

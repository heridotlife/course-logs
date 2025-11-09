# Deployment Configuration

This document outlines the deployment process for the `course-logs` project.

## Deployment Target
The application is deployed as a static site to **Cloudflare Pages**.

## Deployment Commands
```bash
# Build the project and deploy to production
pnpm run deploy

# Build the project and deploy to a preview environment
pnpm run deploy:preview
```

## Cloudflare Pages Configuration
-   **Build command**: `pnpm run build`
-   **Output directory**: `.` (The project root, not `/dist`)
-   **Node version**: 20 (specified in `.node-version`)
-   **Root `index.html`**: Serves as the entry point.

### Key Configuration Files
-   **`wrangler.toml`**: Contains the Cloudflare Pages project name and compatibility date.
-   **`_headers`**: Defines HTTP security and caching headers for the deployed site.
-   **`_redirects`**: Handles SPA routing and 404 fallbacks.
-   **`.node-version`**: Ensures the build environment uses Node.js version 20.

## Files Deployed
All files in the root directory are deployed, including:
-   `index.html`
-   `dist/app.js` (bundled JavaScript)
-   `dist/output.css` (compiled CSS)
-   `data/courses.json`
-   `locales/*.json`
-   Static assets (e.g., favicon)

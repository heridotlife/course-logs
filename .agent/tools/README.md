# Agent Tools

This document outlines the tools available to you for interacting with the `course-logs` project and external services.

## 1. Filesystem & Shell Commands

You have standard shell access and can use commands like `ls`, `cat`, `mkdir`, etc., to navigate and manipulate the file system.

## 2. Project Scripts (`pnpm`)

The `package.json` file defines several scripts that you can execute using `pnpm run <script_name>`. These are your primary tools for building, testing, and deploying the application.

-   **`pnpm run dev`**
    -   **Action**: Starts a local development server with hot-reloading for both CSS and JavaScript.
    -   **When to use**: For interactive development and testing of new features.

-   **`pnpm run build`**
    -   **Action**: Creates a production-ready, minified build of the CSS and JavaScript assets.
    -   **When to use**: Before deploying, or to ensure the project builds successfully after making changes.

-   **`pnpm run test`**
    -   **Action**: Runs the entire Playwright test suite across all three device profiles (desktop, mobile, tablet).
    -   **When to use**: This is **mandatory** after making any changes to verify that you have not introduced any regressions.

-   **`pnpm run deploy`**
    -   **Action**: Builds the project and deploys it to the Cloudflare Pages production environment.
    -   **When to use**: To release a new version of the application after all tests have passed.

## 3. Cloudflare MCP Tools

This project is configured to use Cloudflare's Model Context Protocol (MCP) to interact with Cloudflare services. The configuration is located in `.agent/.claude/mcp.json`.

These tools allow you to perform administrative tasks directly related to the project's cloud infrastructure.

### Available MCP Servers

-   **`cloudflare-pages`**: Manage Cloudflare Pages deployments.
    -   *Example*: "List the last 5 deployments on Cloudflare Pages."
-   **`cloudflare-analytics`**: Access website analytics.
    -   *Example*: "Show me the traffic analytics for the past 7 days."
-   **`cloudflare-workers`**: Manage associated Workers.
    -   *Example*: "List all Workers for this account."
-   **`cloudflare-dns`**: Manage DNS records.
    -   *Example*: "Show me the DNS records for heri.life."

### How to Use MCP Tools
To use these tools, you need to formulate a request that clearly states your intent. The MCP server will interpret your request and execute the corresponding action. Ensure the `CLOUDFLARE_API_TOKEN` environment variable is set up correctly by the user.

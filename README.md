# University Course Study Planner

A modern, responsive web application for planning university course schedules with flexible semester configuration (4-12 semesters) and support for "antara" (inter-semester) periods.

## Features

### 📚 Course Management
- **CRUD Operations**: Add, edit, and delete courses
- **Course Details**: Track course code, name, type (Wajib/Pilihan), credits, lecturer, and recommended semester
- **68 Default Courses**: Pre-loaded sample data for Sibermu university
- **Auto-Map Courses**: Automatically assign all unassigned courses to their recommended semesters

### 📅 Semester Planning
- **Dynamic Semesters**: Configure between 4-12 regular semesters with automatic antara period insertion
- **Flexible Configuration**: Add or remove semesters on the fly with +/- buttons
- **Smart Antara Insertion**: Automatically places antara periods between even-numbered semesters
- **Dropdown Assignment**: Assign courses to any semester via dropdown selection
- **Visual Organization**: Color-coded semester cards with clear layout
- **Sticky Panel**: Available courses panel stays visible while scrolling

### ⚠️ Credit Validation
- **Smart Limits**:
  - Semesters 1-2: 20 SKS (configurable)
  - Regular Semesters 3+: 24 SKS (configurable)
  - Antara Semesters: 9 SKS (configurable)
- **Visual Status Indicators**: 
  - 🔴 Red "OVER LIMIT": Exceeds maximum credits
  - 🟢 Green "PERFECT": Exactly matches maximum credits
  - 🔵 Blue "CAN ADD MORE": Below maximum credits
- **Per-Semester Configuration**: Customize credit limits for each individual semester
- **Confirmation Dialogs**: Warns when exceeding limits
- **Real-time Calculation**: Instant credit totals per semester

### 📊 Statistics Dashboard
- Total credits taken
- Target credits (145 SKS)
- Progress percentage
- Unassigned courses count
- Credit summary by semester (toggle view)

### 💾 Data Persistence
- **Auto-save**: Saves automatically on every change to localStorage
- **Manual Save**: Explicit save button with feedback
- **Last Saved Indicator**: Shows relative time since last save
- **Reset Function**: Clear all data and restore defaults

### 📤 Import/Export
- **Export to JSON**: Full data backup with all settings and course assignments
- **Export to CSV**: Spreadsheet-compatible format for course data
- **Print to PDF**: Professional 2-column landscape layout using browser's native print functionality
- **Import from JSON**: Restore complete backup including settings and courses
- **Import from CSV**: Upload custom course data with validation
- **Date-stamped Files**: Automatic filename with current date for exports

### 🌓 Dark Mode
- **Toggle Button**: Switch between light and dark themes
- **Persistent**: Remembers preference across sessions
- **Smooth Transitions**: Animated theme changes
- **Full Coverage**: All components support both themes

### 🌍 Multi-language Support
- **Three Languages**: English, Indonesian (Bahasa Indonesia), and Japanese (日本語)
- **Easy Switching**: Language selector in the header
- **Complete Translation**: All UI elements fully translated
- **Persistent**: Language preference saved across sessions

## Technology Stack

- **Alpine.js 3.15.0**: Reactive JavaScript framework (bundled)
- **Tailwind CSS 4.1.14**: Utility-first CSS framework with dark mode support (latest v4)
- **esbuild**: Fast JavaScript bundler
- **pnpm**: Fast, disk space efficient package manager
- **localStorage**: Client-side data persistence
- **FileReader API**: Client-side file imports (CSV/JSON)
- **Print API**: Native browser print functionality for PDF generation

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
# Install dependencies
pnpm install

# Build for development (watch mode)
pnpm run dev

# Build for production
pnpm run build
```

4. Open `index.html` in your browser or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

### Build Commands

- `pnpm run build` - Build both CSS and JS for production (minified)
- `pnpm run dev` - Watch mode for development (CSS + JS)
- `pnpm run build:css` - Build CSS only
- `pnpm run watch:css` - Watch CSS only
- `pnpm run build:js` - Build JS only
- `pnpm run watch:js` - Watch JS only

### File Structure

```
course-logs/
├── src/
│   ├── app.js          # Alpine.js entry point
│   └── input.css       # Tailwind CSS source (v4 with @theme config)
├── dist/
│   ├── app.js          # Bundled JavaScript (generated)
│   └── output.css      # Compiled CSS (generated)
├── data/
│   └── courses.json    # Default course data and settings
├── locales/
│   ├── en.json         # English translations
│   ├── id.json         # Indonesian translations
│   └── ja.json         # Japanese translations
├── index.html          # Main application file
├── package.json        # Dependencies and build scripts
├── build-js.js         # esbuild configuration
├── wrangler.toml       # Cloudflare Pages configuration
├── _headers            # HTTP security headers
├── _redirects          # URL redirects
├── .node-version       # Node.js version specification
├── README.md           # This file
└── LICENSE             # MIT License
```

## Deployment

### Cloudflare Pages (Recommended)

This project is optimized for deployment on Cloudflare Pages with automatic builds.

#### Automatic Deployment

1. **Connect Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository

2. **Configure Build Settings**:
   - **Framework preset**: None
   - **Build command**: `pnpm run build`
   - **Build output directory**: `.` (root directory)
   - **Node version**: 20 (automatically detected from `.node-version`)

3. **Deploy**: Click "Save and Deploy"

#### Manual Deployment with Wrangler

```bash
# Install Wrangler CLI globally (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
pnpm run build

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=course-logs
```

#### Environment Variables (Optional)

If you need to configure environment-specific settings, you can add them in Cloudflare Pages dashboard under Settings → Environment variables.

### Configuration Files

- **`wrangler.toml`**: Cloudflare Pages configuration (build commands, Node version)
- **`_headers`**: HTTP security headers and caching rules
  - Security headers (X-Frame-Options, CSP, etc.)
  - Cache-Control for static assets (1 year)
  - Cache-Control for HTML (1 hour with revalidation)
- **`_redirects`**: URL redirects and rewrites (404 handling)
- **`.node-version`**: Specifies Node.js 20 for build environment

### Other Deployment Options

#### GitHub Pages

```bash
# Build the project
pnpm run build

# Deploy dist/ folder to gh-pages branch
# (requires gh-pages package or manual git commands)
```

#### Netlify

1. Connect your repository
2. Set build command: `pnpm run build`
3. Set publish directory: `.`
4. Deploy

#### Vercel

1. Connect your repository
2. Set build command: `pnpm run build`
3. Set output directory: `.`
4. Deploy

## Development Workflow

### Local Development

```bash
# Start development with hot reload
pnpm run dev

# In another terminal, start a local server
python3 -m http.server 8000

# Open http://localhost:8000
```

### Production Build

```bash
# Build minified assets
pnpm run build

# Test the production build locally
python3 -m http.server 8000
```

### Code Quality

The project uses:
- **Tailwind CSS v4** with CSS-based configuration for minimal bundle size (5x faster builds)
- **esbuild** for fast JavaScript bundling
- **Native CSS features** for cross-browser compatibility (built into Tailwind v4)

## Usage

### Adding a Course
1. Click the "+ Add" button in the Available Courses panel
2. Fill in the course details
3. Click "Save"

### Auto-Mapping Courses
1. Click the "Auto-Map Courses" button (🎯) in the Available Courses panel
2. All unassigned courses with recommended semesters will be automatically assigned
3. Courses without recommendations remain unassigned

### Configuring Semesters
1. Click "⚙️ Settings" button in the header
2. Use the + and - buttons to add or remove semesters (4-12 range)
3. Antara periods are automatically inserted between even-numbered semesters
4. Customize credit limits for each individual semester
5. Click "Save Settings"

### Assigning Courses to Semesters
1. Find an unassigned course in the left panel
2. Select a semester from the dropdown
3. Course automatically moves to the selected semester

### Removing Course from Semester
1. Click the "✕" button on any assigned course
2. Course returns to the unassigned pool

### Viewing Credit Summary
1. Click "Show Summary" button
2. See color-coded credit status for all semesters
3. Status indicators:
   - 🔴 Red "OVER LIMIT": Exceeds maximum credits
   - 🟢 Green "PERFECT": Exactly matches maximum credits
   - 🔵 Blue "CAN ADD MORE": Below maximum credits

### Exporting Your Plan
1. Click "Import/Export" button
2. Choose your export format:
   - **Export as JSON**: Full backup with all settings and assignments
   - **Export as CSV**: Course data in spreadsheet format
   - **Print as PDF**: Opens browser print dialog for 2-column landscape layout
3. File downloads automatically (JSON/CSV) or opens print dialog (PDF)

### Importing Data
1. Click "Import/Export" button
2. Choose import type:
   - **Import JSON File**: Restores complete backup including settings
   - **Import CSV File**: Imports course data only
3. Select your file
4. Confirm import

### Switching Themes
1. Click the theme toggle button (🌙/☀️) in the header
2. Theme preference is saved automatically

### Changing Language
1. Click the language selector in the header
2. Choose from English (EN), Indonesian (ID), or Japanese (JA)
3. All UI elements update instantly
4. Language preference is saved automatically

## Data Format

### Course JSON Structure
```json
{
  "settings": {
    "totalSemesters": 8,
    "semesterMaxCredits": {
      "1": 20,
      "2": 20,
      "3": 24,
      "4": 24,
      "5": 24,
      "6": 24,
      "7": 24,
      "8": 24,
      "antara-1": 9,
      "antara-2": 9,
      "antara-3": 9
    },
    "targetCredits": 145
  },
  "courses": [
    {
      "id": "1",
      "code": "CS101",
      "name": "Introduction to Programming",
      "type": "Wajib",
      "credits": 3,
      "lecturer": "Dr. John Doe",
      "recommendedSemester": 1,
      "assignedSemester": null
    }
  ]
}
```

### CSV Format
```csv
ID,Code,Name,Type,Credits,Lecturer,Recommended Semester,Assigned Semester
1,CS101,Introduction to Programming,Wajib,3,Dr. John Doe,1,
2,MATH101,Calculus I,Wajib,4,Prof. Jane Smith,1,
```

## Customization

### Modifying Semester Count
1. Open Settings modal
2. Use +/- buttons to adjust between 4-12 semesters
3. Antara periods automatically adjust

### Modifying Credit Limits
In Settings modal, you can customize:
- Individual semester credit limits
- Target total credits (SKS)
- Separate limits for regular and antara semesters

Or edit `data/courses.json` directly:
```json
"settings": {
  "totalSemesters": 8,
  "semesterMaxCredits": {
    "1": 20,
    "2": 20,
    "3": 24,
    "4": 24,
    "antara-1": 9
  },
  "targetCredits": 145
}
```

### Adding Default Courses
Edit `data/courses.json` and add to the `courses` array.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Known Limitations

- Requires web server for JSON file loading (file:// protocol won't work)
- localStorage limit: ~5-10MB depending on browser
- No backend server (all data stored locally)

## Future Enhancements

- [ ] Prerequisite tracking
- [ ] GPA calculation
- [ ] Semester schedule visualization with time slots
- [ ] Multi-user support with backend
- [ ] Course search and filtering
- [ ] Export to iCal format
- [ ] Conflict detection for course schedules

## Contributing

This is a single-file application designed for simplicity. Feel free to:
1. Fork the repository
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Check browser console for errors
- Ensure you're running a local web server
- Verify JSON file format is correct
- Try clearing localStorage and refreshing

## Changelog

### Version 2.0.0 (Current)
- **Dynamic Semester Configuration**: Flexible 4-12 semester range with +/- buttons
- **Auto-Map Feature**: Automatically assign courses to recommended semesters
- **Enhanced Status Indicators**: Perfect (exact match), Can Add More (below limit), Over Limit badges
- **Print-to-PDF**: Native browser print with aesthetic 2-column landscape layout
- **Multi-language Support**: English, Indonesian, and Japanese translations
- **JSON Import**: Full backup restore with settings and course data
- **Sticky Available Courses Panel**: Stays visible while scrolling
- **Per-Semester Credit Configuration**: Individual credit limits for each semester
- **Improved UX**: Simplified controls and better visual feedback

### Version 1.1.0
- Added PDF export functionality using jsPDF
- Individual semester credit limit customization
- Settings modal for configuring credit limits
- Enhanced export options (JSON, CSV, PDF)

### Version 1.0.0
- Initial release
- All 6 phases implemented
- Dark mode support
- Full CRUD operations
- Import/Export functionality (JSON, CSV)
- localStorage persistence
- Credit validation
- Statistics dashboard

---

Made with ❤️ using Alpine.js and Tailwind CSS

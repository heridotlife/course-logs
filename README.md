# University Course Study Planner

A modern, responsive web application for planning university course schedules across 8 semesters with support for "antara" (inter-semester) periods.

## Features

### 📚 Course Management
- **CRUD Operations**: Add, edit, and delete courses
- **Course Details**: Track course code, name, type (Wajib/Pilihan), credits, lecturer, and recommended semester
- **15 Default Courses**: Pre-loaded sample data

### 📅 Semester Planning
- **11 Semesters**: 8 regular semesters + 3 antara periods (between semesters 2-3, 4-5, 6-7)
- **Drag & Assign**: Assign courses to any semester via dropdown selection
- **Visual Organization**: Color-coded semester cards with clear layout

### ⚠️ Credit Validation
- **Smart Limits**:
  - Semester 1: 20 SKS (configurable)
  - Regular Semesters: 24 SKS
  - Antara Semesters: 9 SKS
- **Visual Warnings**: Red/yellow/green color coding based on credit usage
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
- **Export to JSON**: Full data backup with settings
- **Export to CSV**: Spreadsheet-compatible format
- **Export to PDF**: Professional printable report with jsPDF
- **Import from CSV**: Upload custom course data
- **Date-stamped Files**: Automatic filename with current date

### 🌓 Dark Mode
- **Toggle Button**: Switch between light and dark themes
- **Persistent**: Remembers preference across sessions
- **Smooth Transitions**: Animated theme changes
- **Full Coverage**: All components support both themes

## Technology Stack

- **Alpine.js 3.x**: Reactive JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework with dark mode support
- **jsPDF**: PDF generation library for client-side exports
- **localStorage**: Client-side data persistence
- **Vanilla JavaScript**: No build tools required

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for JSON file loading)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Start a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js http-server
npx http-server -p 8000
```

4. Open your browser to `http://localhost:8000/index.html`

### File Structure

```
course-logs/
├── index.html           # Main application file
├── data/
│   └── courses.json    # Default course data
├── README.md           # This file
├── DEPLOY.md           # Cloudflare Pages deployment guide
└── LICENSE             # MIT License
```

## Deployment

For deploying to production (Cloudflare Pages), see the [Deployment Guide](DEPLOY.md).

## Usage

### Adding a Course
1. Click the "+ Add" button in the Available Courses panel
2. Fill in the course details
3. Click "Save"

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
3. Green: Safe, Yellow: Near limit, Red: Over limit

### Exporting Your Plan
1. Click "Import/Export" button
2. Choose "Export as JSON", "Export as CSV", or "Export as PDF"
3. File downloads automatically
   - JSON: Full backup with settings
   - CSV: Spreadsheet format
   - PDF: Professional printable report

### Importing Data
1. Click "Import/Export" button
2. Click "Import CSV File"
3. Select your CSV file
4. Confirm import

### Switching Themes
1. Click the theme toggle button (🌙/☀️) in the header
2. Theme preference is saved automatically

## Data Format

### Course JSON Structure
```json
{
  "settings": {
    "semester1MaxCredits": 20,
    "normalSemesterMaxCredits": 24,
    "antaraSemesterMaxCredits": 9,
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

### Modifying Credit Limits
Edit `data/courses.json`:
```json
"settings": {
  "semester1MaxCredits": 18,
  "normalSemesterMaxCredits": 22,
  "antaraSemesterMaxCredits": 6,
  "targetCredits": 144
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

- Prerequisite tracking
- GPA calculation
- Semester schedule visualization
- Multi-user support with backend

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

### Version 1.1.0 (Current)
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

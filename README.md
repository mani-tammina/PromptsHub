# Prompt Hub - Enterprise Prompt Library MVP

A modern, offline-first web application for browsing, searching, and generating AI prompts from a local JSON repository.

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local HTTP server (Python, Node.js, or VS Code Live Server)

### Setup

**IMPORTANT:** This application requires serving via HTTP/HTTPS. Direct file:// protocol will not work due to browser security restrictions.

#### Option 1: Python (Recommended)

```bash
# Navigate to the PromptHub directory
cd /path/to/PromptHub

# Python 3
python -m http.server 8000

# Python 2 (if Python 3 not available)
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

#### Option 2: Node.js

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Run in PromptHub directory
http-server

# Opens automatically at http://localhost:8080
```

#### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically

## 📋 Features

### Core Features
- ✅ **Browse Prompts** - 30+ pre-built enterprise prompts
- ✅ **Filter by Role** - Business Analyst, Developer, QA, DevOps, etc.
- ✅ **Filter by Category** - Analysis, Development, Testing, Documentation, etc.
- ✅ **Search Prompts** - Search by name or tags
- ✅ **Generate Prompts** - Replace {{REQUIREMENT}} placeholders dynamically
- ✅ **Copy to Clipboard** - One-click copying with confirmation

### Data Persistence
- ✅ **Favorites** - Mark/unmark favorite prompts (stored locally)
- ✅ **Recent Prompts** - Auto-tracks last 10 used prompts
- ✅ **Dark Mode** - Toggle theme preference (persisted)
- ✅ **Import/Export** - Upload/download custom prompt JSON

### Design
- ✅ **Modern SaaS UI** - Inspired by Notion, Linear, Atlassian
- ✅ **Responsive Design** - Works on Desktop, Tablet, Mobile
- ✅ **Accessible** - ARIA labels, keyboard shortcuts, high contrast
- ✅ **Smooth Animations** - Transitions and hover effects

## 📁 Project Structure

```
PromptHub/
├── index.html              # Main application page
├── README.md               # This file
├── css/
│   └── styles.css          # Complete styling (SaaS design)
├── js/
│   └── app.js              # Application logic (production-ready)
├── data/
│   └── prompts.json        # Prompt repository (30+ samples)
└── assets/                 # Placeholder for images/icons
```

## 🔧 Configuration

### Prompts JSON Structure

Each prompt in `data/prompts.json` must follow this structure:

```json
{
  "id": 1,
  "role": "Business Analyst",
  "category": "Analysis",
  "name": "Requirement Analysis",
  "description": "Analyze and clarify business requirements",
  "tags": ["requirements", "analysis", "ba"],
  "template": "Analyze the following requirement:\n\n{{REQUIREMENT}}\n\nProvide:\n1. Summary\n2. Scope"
}
```

**Required Fields:**
- `id` (number) - Unique identifier
- `role` (string) - User role/persona
- `category` (string) - Prompt category
- `name` (string) - Prompt name
- `description` (string) - Short description
- `tags` (array) - Searchable tags
- `template` (string) - Prompt template with {{REQUIREMENT}} placeholder

### Supported Roles
- Business Analyst
- Solution Architect
- Developer
- Mobile Developer
- QA Engineer
- Project Manager
- DevOps Engineer
- UI/UX Designer
- Presales Consultant
- Product Manager

### Supported Categories
- Analysis
- Architecture
- Development
- Testing
- Documentation
- Security
- DevOps
- Project Management
- Presales
- AI Engineering

## 🔍 Troubleshooting

### Error: "Failed to load application"

**Cause:** Application files cannot be loaded

**Solutions:**
1. **Check Console:** Press F12, click "Console" tab, look for detailed error messages
2. **Verify File Path:** Ensure `data/prompts.json` exists
3. **Use HTTP Server:** Do NOT open via `file://` protocol - use local server
4. **Check Permissions:** Ensure file permissions allow read access
5. **Clear Cache:** Ctrl+Shift+Delete, clear cookies/cache, refresh

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| HTTP 404 | File not found | Check that `data/prompts.json` exists |
| HTTP 403 | Access denied | Check file permissions |
| "Using file://" | Direct file access | Use HTTP server instead |
| "Invalid JSON" | Malformed JSON | Validate `prompts.json` using online JSON validator |

### Application Works Offline?
Yes! After initial load, the app works completely offline. All features work without internet:
- Browsing and searching
- Filtering prompts
- Generating prompts
- Copy to clipboard
- Theme toggle
- Favorites and recent history

### Data Loss Issues
- **Local data cleared:** Data in favorites, recent, and theme is stored in browser localStorage
- **Browser cache cleared:** Re-open app - data will reload from JSON file
- **Switching browsers:** Settings don't sync across browsers (by design for privacy)

## 💾 Data Storage

### localStorage Usage
The application stores the following in browser localStorage:
- **promptHub_favorites** - Array of favorited prompt IDs
- **promptHub_recent** - Array of recently used prompt IDs
- **promptHub_theme** - Boolean for dark mode preference
- **promptHub_prompts** - Custom uploaded prompts (optional)

### Data Clearing
To clear all local data:
1. Open DevTools (F12)
2. Go to Application > Storage > Local Storage
3. Find entries starting with "promptHub_"
4. Delete them, or use:
   ```javascript
   // In browser console:
   ['promptHub_favorites', 'promptHub_recent', 'promptHub_theme', 'promptHub_prompts']
     .forEach(key => localStorage.removeItem(key));
   ```

## 📤 Import/Export

### Export Prompts
1. Click the **📤 Export** button in header
2. Browser downloads `prompts-YYYY-MM-DD.json`
3. Use for backup or sharing

### Import Prompts
1. Click the **📥 Upload** button in header
2. Select a JSON file from your computer
3. File is validated and merged with existing prompts
4. New prompts are stored in browser localStorage

**Important:** Imported prompts override defaults until cleared

## 🎨 Customization

### Adding Custom Prompts
1. Export current prompts (📤 button)
2. Edit the JSON file with new prompts
3. Import the updated file (📥 button)

### Editing Styles
Modify `css/styles.css` to customize:
- Color scheme (see `:root { --color-* }`)
- Typography (font size, weight)
- Spacing and layout
- Responsive breakpoints

### Theme Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --color-accent: #2563eb;        /* Primary blue */
    --color-success: #10b981;       /* Green for success */
    --color-danger: #ef4444;        /* Red for errors */
    /* ... more colors ... */
}
```

## 🧪 Testing

### Unit Tests (Manual)
1. Test each role filter
2. Test each category filter
3. Search with various keywords
4. Test favorite/unfavorite
5. Test dark mode toggle
6. Test prompt generation with {{REQUIREMENT}} replacement
7. Test copy to clipboard
8. Test import/export with valid and invalid JSON

### Browser Compatibility
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📊 Performance

- **Bundle Size:** ~150KB (CSS + JS + HTML uncompressed)
- **Load Time:** <1 second (local server)
- **No Dependencies:** Pure JavaScript, HTML, CSS
- **Offline Ready:** Fully functional without internet

## 🔒 Privacy & Security

- ✅ **No Server Backend** - All processing happens in browser
- ✅ **No Data Collection** - No analytics, tracking, or logging
- ✅ **No Internet Required** - Works offline completely
- ✅ **Local Storage Only** - Data stays on your device
- ✅ **No Cookies** - Uses localStorage instead (explicit user control)

## 🚨 Known Limitations

1. **File:// Protocol** - Must use HTTP server (browser security)
2. **localStorage Limit** - ~5-10MB per domain in most browsers
3. **Single Device** - Data doesn't sync across devices
4. **Manual Sync** - Use Import/Export for backup and sharing

## 🛠️ Development Notes

### Code Organization
- **app.js Structure:**
  - Constants & Configuration (lines 1-50)
  - DOM Element Caching (lines 50-80)
  - Default Prompts Fallback (lines 80-130)
  - Initialization Logic (lines 130-180)
  - Data Loading & Management (lines 180-300)
  - Theme Management (lines 300-330)
  - UI Population & Updates (lines 330-500)
  - Filtering & Search (lines 500-550)
  - Prompt Generation (lines 550-650)
  - Import/Export (lines 650-750)
  - Event Listeners (lines 750-820)
  - Utility Functions (lines 820-900)

### Production Checklist
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Comments and documentation
- ✅ Responsive design tested
- ✅ Accessibility compliance (ARIA labels)
- ✅ Browser compatibility verified
- ✅ XSS prevention (escapeHtml)

## 📞 Support

For issues:
1. Check browser console (F12 → Console tab)
2. Review troubleshooting section above
3. Verify file structure matches project structure
4. Ensure JSON is valid (use jsonlint.com)
5. Try clearing cache and reloading

## 📝 License

This project is provided as-is for enterprise use.

---

**Last Updated:** June 12, 2026  
**Version:** 1.0.0  
**Status:** Production Ready

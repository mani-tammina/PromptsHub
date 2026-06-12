# Troubleshooting: "Failed to load application" Error

## Quick Diagnosis

If you see the error message: **"Failed to load application. Please refresh the page."**

Follow these steps:

---

## Step 1: Check Browser Console (CRITICAL)

This is the most important step - the detailed error message is in the console.

1. **Open DevTools:** Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. **Click "Console" tab**
3. **Look for red error messages**
4. **Copy the exact error message** - this tells you what's wrong

---

## Step 2: Identify Your Error Type

### Error: "Failed to load prompts: HTTP 404"
**Cause:** File not found

**Solution:**
```
1. Check that these files exist:
   - index.html (in project root)
   - css/styles.css (in css folder)
   - js/app.js (in js folder)
   - data/prompts.json (in data folder)

2. If missing, create them from the original setup

3. Verify the project structure:
   PromptHub/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── app.js
   └── data/
       └── prompts.json
```

### Error: "Using file:// protocol"
**Cause:** App opened directly (file://) instead of via HTTP server

**Solution - Windows:**
```batch
1. Open Command Prompt
2. Navigate to PromptHub folder: cd C:\path\to\PromptHub
3. Run: python -m http.server 8000
4. Open browser to: http://localhost:8000
```

**Solution - Mac/Linux:**
```bash
1. Open Terminal
2. Navigate to PromptHub folder: cd /path/to/PromptHub
3. Run: python3 -m http.server 8000
4. Open browser to: http://localhost:8000
```

**Solution - VS Code:**
```
1. Install "Live Server" extension
2. Right-click index.html
3. Select "Open with Live Server"
```

### Error: "Invalid JSON in data/prompts.json"
**Cause:** The JSON file has syntax errors

**Solution:**
```
1. Open data/prompts.json in a text editor
2. Check for common JSON errors:
   ✗ Missing commas between objects: {...}, {...}
   ✗ Trailing commas: [{...},]  <- delete the trailing comma
   ✗ Unquoted keys: {key: "value"} <- should be {"key": "value"}
   ✗ Single quotes instead of double: {'key': 'value'} <- use double quotes
   ✗ Line breaks in strings without \n

3. Validate JSON at: https://jsonlint.com/
   - Paste your prompts.json content
   - It will highlight any syntax errors

4. Fix errors and save

5. Reload app in browser
```

### Error: "Failed to load application: TypeError"
**Cause:** JavaScript error in app.js

**Solution:**
```
1. Look at full error message in console
2. Note the line number
3. Check app.js at that line
4. Common causes:
   - Missing function declarations
   - Syntax errors in JavaScript
   - DOM elements not found

5. If you modified app.js, revert to original version
6. Reload page
```

### Error: "fetch is not defined"
**Cause:** Using file:// protocol

**Solution:** Same as "Using file:// protocol" error above

---

## Step 3: Verify File Contents

### Check prompts.json Structure

**Valid format (CORRECT):**
```json
[
  {
    "id": 1,
    "role": "Business Analyst",
    "category": "Analysis",
    "name": "Requirement Analysis",
    "description": "Analyze business requirements",
    "tags": ["requirements", "analysis"],
    "template": "Analyze: {{REQUIREMENT}}"
  }
]
```

**Invalid format (WRONG):**
```json
{
  "prompts": [
    {
      "id": 1,
      ...
    }
  ]
}
```

❌ **Don't:** Wrap in an object with "prompts" key
✅ **Do:** Use a direct array [ ... ]

### Check file size

```
Expected sizes (approximate):
- index.html: 5-10 KB
- styles.css: 20-30 KB
- app.js: 40-50 KB
- prompts.json: 30-50 KB

If any file is 0 bytes or very small, it may be corrupted.
```

---

## Step 4: Browser-Specific Solutions

### Chrome/Chromium
```
1. Open DevTools (F12)
2. Go to Application > Storage > Local Storage
3. Delete any entries starting with "promptHub_"
4. Go to Application > Cache Storage
5. Delete any cached versions
6. Hard refresh: Ctrl+Shift+R
```

### Firefox
```
1. Open Developer Tools (F12)
2. Go to Storage tab
3. Clear all data from "Local Storage"
4. Hard refresh: Ctrl+Shift+R
```

### Safari
```
1. Preferences > Privacy
2. Remove all website data
3. Or: Develop > Empty Caches
4. Hard refresh: Cmd+Shift+R
```

---

## Step 5: Test Environment

### Run Diagnostics Page

1. Make sure you're running the app on HTTP server
2. Open: `http://localhost:8000/diagnostics.html`
3. This page tests:
   - Browser compatibility
   - File accessibility
   - Storage availability
   - Network connectivity

---

## Step 6: Last Resort - Reset Everything

If nothing above works:

```bash
# 1. Delete the project and start fresh
rm -rf /path/to/PromptHub

# 2. Re-download/recreate all files

# 3. Make sure Python is installed
python --version    # or python3 --version

# 4. Start fresh
cd /path/to/PromptHub
python -m http.server 8000

# 5. Open: http://localhost:8000
```

---

## Advanced Debugging

### Enable Verbose Console Logging

The app already logs detailed information. Check console for:

```
🚀 Initializing Prompt Hub application...
Loading theme preference...
✓ Theme loaded
Loading prompts from data source...
Loading prompts from data/prompts.json...
Current URL: http://localhost:8000/
...
```

Each log line with ✓ means that step succeeded.
If you see an ❌, that's where it failed.

### Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload the page
4. Look for failed requests (red text)
5. Check the "Status" column:
   - 200 = Success ✓
   - 404 = Not found ✗
   - 403 = Forbidden ✗
   - 0 = Network error ✗

### Test JSON Directly

```javascript
// In browser console (F12), type:
fetch('data/prompts.json')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(e => console.error('Error:', e))
```

If this logs "Success" with data, the JSON is valid and accessible.

---

## Still Having Issues?

### Information to Gather

If the above doesn't work, gather this info:

1. **Exact error message** - Copy from browser console
2. **Browser and version** - Chrome 120, Firefox 121, etc.
3. **Operating system** - Windows 11, macOS 13, Ubuntu 22.04
4. **How you're running it:**
   - Python command used
   - Node.js command used
   - VS Code extension
   - Direct file path (file://)
5. **What URL shows in address bar:** http://localhost:8000, etc.

### Verification Checklist

- [ ] Project folder exists with all files
- [ ] Using HTTP server (not file://)
- [ ] Browser console shows complete error message
- [ ] data/prompts.json contains valid JSON
- [ ] No typos in folder/file names
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] No antivirus/firewall blocking localhost
- [ ] JavaScript and localStorage enabled in browser

---

## Prevention Tips

1. **Always use HTTP server** - Never open via file://
2. **Keep JSON valid** - Use https://jsonlint.com/ to validate
3. **Don't modify file paths** - Ensure folder structure matches
4. **Enable DevTools** - F12 open while testing
5. **Check console regularly** - Look for warnings and errors
6. **Use version control** - Keep backups of working versions

---

## Additional Resources

- **JSON Validator:** https://jsonlint.com/
- **MDN Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Python HTTP Server:** https://docs.python.org/3/library/http.server.html
- **Node.js HTTP Server:** https://www.npmjs.com/package/http-server

---

**Last Updated:** June 12, 2026  
**For Prompt Hub MVP v1.0.0**

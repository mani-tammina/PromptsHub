# 🚀 QUICK START - Get Prompt Hub Running in 30 Seconds

## WINDOWS Users

1. **Open File Explorer**
2. **Navigate to the PromptHub folder**
3. **Double-click: `start-server.bat`**
4. **Wait for browser to open** (or manually go to `http://localhost:8000`)
5. **Done!** ✅

---

## MAC/LINUX Users

1. **Open Terminal**
2. **Copy and paste this command:**

```bash
cd /path/to/PromptHub && chmod +x start-server.sh && ./start-server.sh
```

3. **Wait for browser to open**
4. **Done!** ✅

---

## VS CODE Users (All Platforms)

1. **Open PromptHub folder in VS Code**
2. **Install "Live Server" extension** (search in Extensions)
3. **Right-click `index.html`**
4. **Click "Open with Live Server"**
5. **Browser opens automatically** ✅

---

## ⚠️ IMPORTANT

**DO NOT** try to open `index.html` by double-clicking it in file explorer!

**WHY?** The file:// protocol doesn't work with fetch API.

**Always use:** HTTP server instead (Python, Node.js, or Live Server)

---

## 🆘 If It Doesn't Work

1. **Press F12** (open browser console)
2. **Look for red error messages**
3. **Read that error carefully** - it tells you exactly what's wrong
4. **Refer to:** `TROUBLESHOOTING.md`

---

## ✅ How to Know It Worked

- ✅ You see "Prompt Hub" with logo and title
- ✅ You can see a list of prompts
- ✅ You can select a prompt from dropdown
- ✅ You can toggle dark mode (🌙 button)
- ✅ Search works
- ✅ You can type and generate prompts

---

## 📋 Features You Can Try

Once it's running:

- **Select a Prompt:** Use the "Choose a prompt..." dropdown
- **Search:** Type in the Search box on the left
- **Filter by Role:** Select from Role dropdown
- **Filter by Category:** Select from Category dropdown
- **Generate:** Enter text and click "Generate Prompt"
- **Copy:** Click the copy button to save to clipboard
- **Dark Mode:** Click the 🌙 moon icon
- **Favorites:** Each prompt can be marked as favorite
- **Export:** Click 📤 to download all prompts as JSON
- **Import:** Click 📥 to upload a custom prompts file

---

## 🎯 Commands Reference

**Start Python Server (Windows/Mac/Linux):**
```bash
python -m http.server 8000
```

**Start Node.js Server (after npm install -g http-server):**
```bash
http-server
```

**Then open browser to:**
```
http://localhost:8000
```

---

## 📞 Still Stuck?

1. **Check Console:** F12 → Console tab
2. **Read Error:** Copy the exact error message
3. **Refer to:** `TROUBLESHOOTING.md`
4. **Run Diagnostics:** Go to `http://localhost:8000/diagnostics.html`
5. **Verify Files:** 
   - index.html ✓
   - css/styles.css ✓
   - js/app.js ✓
   - data/prompts.json ✓

---

**That's it! Enjoy Prompt Hub! 🎉**

/**
 * Prompt Hub - Enterprise Prompt Library Application
 * A complete MVP web application for browsing, searching, and generating AI prompts
 * 
 * Features:
 * - Dynamic prompt loading from JSON
 * - Role and category filtering
 * - Search by name and tags
 * - Prompt generation with requirement replacement
 * - Favorites management (localStorage)
 * - Recent prompts tracking (localStorage)
 * - Dark mode toggle (localStorage)
 * - Import/Export functionality
 */

// ============================================================================
// Application State & Constants
// ============================================================================

const APP_CONFIG = {
    STORAGE_KEYS: {
        FAVORITES: 'promptHub_favorites',
        RECENT: 'promptHub_recent',
        THEME: 'promptHub_theme',
        PROMPTS: 'promptHub_prompts',
        PROMPTS_SOURCE: 'promptHub_prompts_source'
    },
    PROMPT_SOURCES: {
        FILE: 'file',
        IMPORT: 'import'
    },
    MAX_RECENT: 10,
    PROMPTS_FILE: 'data/prompts.json'
};

// Application state
let appState = {
    allPrompts: [],
    filteredPrompts: [],
    selectedPrompt: null,
    favorites: [],
    recentPrompts: [],
    isDarkMode: false
};

// ============================================================================
// DOM Elements
// ============================================================================

const DOM = {
    // Header
    themeToggle: document.querySelector('.theme-toggle'),
    uploadBtn: document.querySelector('.upload-btn'),
    exportBtn: document.querySelector('.export-btn'),
    fileInput: document.getElementById('fileInput'),
    
    // Sidebar
    searchInput: document.getElementById('searchInput'),
    roleFilter: document.getElementById('roleFilter'),
    categoryFilter: document.getElementById('categoryFilter'),
    subcategoryFilter: document.getElementById('subcategoryFilter'),
    favoritesList: document.getElementById('favoritesList'),
    recentList: document.getElementById('recentList'),
    
    // Main Content
    promptSelect: document.getElementById('promptSelect'),
    promptDescription: document.getElementById('promptDescription'),
    tagsContainer: document.getElementById('tagsContainer'),
    requirementInput: document.getElementById('requirementInput'),
    generateBtn: document.getElementById('generateBtn'),
    
    // Generated Prompt Section
    generatedPromptSection: document.getElementById('generatedPromptSection'),
    generatedPromptOutput: document.getElementById('generatedPromptOutput'),
    emptyPromptMessage: document.getElementById('emptyPromptMessage'),
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyNotification: document.getElementById('copyNotification')
};

// ============================================================================
// Default Prompts (Fallback)
// ============================================================================

/**
 * Get default prompts as fallback when JSON file cannot be loaded
 * This provides basic sample data to keep the app functional
 */
function getDefaultPrompts() {
    return [
        {
            "id": 1,
            "role": "Business Analyst",
            "category": "Analysis",
            "name": "Requirement Analysis",
            "description": "Analyze and clarify business requirements",
            "tags": ["requirements", "analysis", "ba"],
            "template": "Analyze the following requirement:\n\n{{REQUIREMENT}}\n\nProvide:\n1. Summary\n2. Scope\n3. Constraints\n4. Success criteria"
        },
        {
            "id": 2,
            "role": "Developer",
            "category": "Development",
            "name": "Code Review Checklist",
            "description": "Generate code review checklist",
            "tags": ["code", "review", "quality"],
            "template": "Create a code review checklist for:\n\n{{REQUIREMENT}}\n\nEvaluate:\n1. Code quality and style\n2. Performance\n3. Error handling\n4. Testing coverage\n5. Documentation"
        },
        {
            "id": 3,
            "role": "Solution Architect",
            "category": "Architecture",
            "name": "System Architecture Design",
            "description": "Design high-level system architecture",
            "tags": ["architecture", "design", "system"],
            "template": "Design architecture for:\n\n{{REQUIREMENT}}\n\nInclude:\n1. Components\n2. Integrations\n3. Scalability\n4. Security\n5. Performance considerations"
        },
        {
            "id": 4,
            "role": "QA Engineer",
            "category": "Testing",
            "name": "Test Plan Creation",
            "description": "Create comprehensive test plan",
            "tags": ["testing", "plan", "qa"],
            "template": "Create test plan for:\n\n{{REQUIREMENT}}\n\nInclude:\n1. Test scope\n2. Test types\n3. Test environment\n4. Entry/exit criteria\n5. Risk assessment"
        },
        {
            "id": 5,
            "role": "Project Manager",
            "category": "Project Management",
            "name": "Project Plan",
            "description": "Create project management plan",
            "tags": ["project", "plan", "management"],
            "template": "Create project plan for:\n\n{{REQUIREMENT}}\n\nDefine:\n1. Scope and objectives\n2. Timeline and milestones\n3. Resources\n4. Risks\n5. Communication plan"
        }
    ];
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        console.log('🚀 Initializing Prompt Hub application...');
        
        // Load theme preference
        console.log('Loading theme preference...');
        loadTheme();
        console.log('✓ Theme loaded');
        
        // Load prompts
        console.log('Loading prompts from data source...');
        await loadPrompts();
        console.log('✓ Prompts loaded');
        
        // Initialize UI with prompts
        console.log('Populating UI filters...');
        populateRoleFilter();
        populateCategoryFilter();
        populateSubcategoryFilter();
        populatePromptSelect();
        console.log('✓ UI filters populated');
        
        // Load favorites and recent prompts
        console.log('Loading user preferences...');
        loadFavorites();
        loadRecentPrompts();
        console.log('✓ User preferences loaded');
        
        // Setup event listeners
        console.log('Setting up event listeners...');
        setupEventListeners();
        console.log('✓ Event listeners configured');
        
        // Update sidebar displays
        console.log('Updating sidebar displays...');
        updateFavoritesList();
        updateRecentList();
        console.log('✓ Sidebar updated');
        
        console.log('✅ Application initialized successfully!');
    } catch (error) {
        const errorMessage = error.message || String(error);
        console.error('❌ Failed to initialize application:', errorMessage);
        console.error('Full error:', error);
        
        // Display user-friendly error message
        const userMessage = `
Application Failed to Load

Error: ${errorMessage}

Troubleshooting:
1. Check browser console (F12) for detailed error messages
2. Verify data/prompts.json file exists and is valid JSON
3. Try clearing browser cache and refreshing
4. Check that the file path is correct relative to index.html

If the error persists, please check the browser console for more details.
        `.trim();
        
        showError(userMessage);
    }
}

// ============================================================================
// Data Loading & Management
// ============================================================================

/**
 * Load prompts from JSON file
 */
async function loadPrompts() {
    try {
        const storedPrompts = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PROMPTS);
        const storedSource = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PROMPTS_SOURCE);
        const useImportedPrompts = storedSource === APP_CONFIG.PROMPT_SOURCES.IMPORT && storedPrompts;

        if (useImportedPrompts) {
            console.log('Loading imported prompts from localStorage...');
            appState.allPrompts = JSON.parse(storedPrompts);
            console.log(`✓ Loaded ${appState.allPrompts.length} imported prompts from localStorage`);
        } else {
            console.log(`Loading prompts from ${APP_CONFIG.PROMPTS_FILE}...`);
            console.log(`Current URL: ${window.location.href}`);

            try {
                const response = await fetch(APP_CONFIG.PROMPTS_FILE);
                if (!response.ok) {
                    const errorDetails = `
HTTP ${response.status}: ${response.statusText}

Troubleshooting:
• If status 404: File not found - verify data/prompts.json exists
• If status 403: Access denied - check file permissions
• If using file:// protocol: Must use a local HTTP server

To run a local server:
  Python 3: python -m http.server 8000
  Python 2: python -m SimpleHTTPServer 8000
  Node.js: npx http-server
  VS Code: Install Live Server extension

Then open: http://localhost:8000 in browser
                    `.trim();
                    throw new Error(errorDetails);
                }

                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    throw new Error(`Invalid JSON format in data/prompts.json: ${parseError.message}`);
                }

                if (!Array.isArray(data)) {
                    throw new Error('Invalid prompts.json: Expected an array, got ' + typeof data);
                }

                if (data.length === 0) {
                    console.warn('⚠ Warning: data/prompts.json is empty');
                    appState.allPrompts = getDefaultPrompts();
                    console.log(`✓ Loaded ${appState.allPrompts.length} default prompts`);
                } else {
                    appState.allPrompts = data;
                    console.log(`✓ Loaded ${appState.allPrompts.length} prompts from file`);
                    validatePromptsStructure(appState.allPrompts);
                }
            } catch (fileError) {
                if (storedPrompts) {
                    console.warn('⚠ Failed to fetch data/prompts.json, falling back to stored prompts:', fileError.message);
                    appState.allPrompts = JSON.parse(storedPrompts);
                    console.log(`✓ Loaded ${appState.allPrompts.length} prompts from localStorage fallback`);
                } else {
                    throw fileError;
                }
            }
        }

        appState.filteredPrompts = [...appState.allPrompts];

        if (appState.allPrompts.length === 0) {
            throw new Error('No prompts available to load');
        }

        console.log(`✓ All prompts loaded successfully (${appState.allPrompts.length} total)`);
    } catch (error) {
        const errorMessage = error.message || String(error);
        console.error('✗ Error loading prompts:', errorMessage);
        throw new Error(errorMessage);
    }
}

/**
 * Validate prompts structure
 */
function validatePromptsStructure(prompts) {
    if (!Array.isArray(prompts)) {
        throw new Error('Prompts must be an array');
    }
    
    const requiredFields = ['id', 'role', 'category', 'name', 'description', 'tags', 'template'];
    let hasErrors = false;
    
    prompts.forEach((prompt, index) => {
        const missingFields = requiredFields.filter(field => !(field in prompt));
        if (missingFields.length > 0) {
            console.warn(`⚠ Prompt ${index} (${prompt.name || 'unnamed'}) missing fields: ${missingFields.join(', ')}`);
            hasErrors = true;
        }
        
        // Validate field types
        if (prompt.id && typeof prompt.id !== 'number') {
            console.warn(`⚠ Prompt ${index}: id should be a number, got ${typeof prompt.id}`);
        }
        if (prompt.tags && !Array.isArray(prompt.tags)) {
            console.warn(`⚠ Prompt ${index}: tags should be an array, got ${typeof prompt.tags}`);
        }
        if ('subcategory' in prompt && prompt.subcategory && typeof prompt.subcategory !== 'string') {
            console.warn(`⚠ Prompt ${index}: subcategory should be a string, got ${typeof prompt.subcategory}`);
        }
    });
    
    if (hasErrors) {
        console.log('⚠ Some prompts have validation warnings but will continue loading');
    }
}

/**
 * Load favorites from localStorage
 */
function loadFavorites() {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.FAVORITES);
    appState.favorites = stored ? JSON.parse(stored) : [];
}

/**
 * Load recent prompts from localStorage
 */
function loadRecentPrompts() {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.RECENT);
    appState.recentPrompts = stored ? JSON.parse(stored) : [];
}

/**
 * Save favorites to localStorage
 */
function saveFavorites() {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(appState.favorites));
}

/**
 * Save recent prompts to localStorage
 */
function saveRecentPrompts() {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.RECENT, JSON.stringify(appState.recentPrompts));
}

/**
 * Add prompt to recent list
 */
function addToRecent(promptId) {
    // Remove if already exists
    appState.recentPrompts = appState.recentPrompts.filter(id => id !== promptId);
    
    // Add to beginning
    appState.recentPrompts.unshift(promptId);
    
    // Keep only last 10
    appState.recentPrompts = appState.recentPrompts.slice(0, APP_CONFIG.MAX_RECENT);
    
    saveRecentPrompts();
    updateRecentList();
}

/**
 * Toggle favorite status
 */
function toggleFavorite(promptId) {
    const index = appState.favorites.indexOf(promptId);
    if (index > -1) {
        appState.favorites.splice(index, 1);
    } else {
        appState.favorites.push(promptId);
    }
    saveFavorites();
    updateFavoritesList();
}

/**
 * Check if prompt is favorited
 */
function isFavorited(promptId) {
    return appState.favorites.includes(promptId);
}

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Load theme preference from localStorage
 */
function loadTheme() {
    const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME);
    appState.isDarkMode = stored ? JSON.parse(stored) : false;
    applyTheme();
}

/**
 * Apply theme to document
 */
function applyTheme() {
    const body = document.body;
    const themeIcon = DOM.themeToggle.querySelector('.theme-icon');
    
    if (appState.isDarkMode) {
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
    }
}

/**
 * Toggle theme
 */
function toggleTheme() {
    appState.isDarkMode = !appState.isDarkMode;
    applyTheme();
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, JSON.stringify(appState.isDarkMode));
}

// ============================================================================
// UI Population & Updates
// ============================================================================

/**
 * Get unique values from prompts
 */
function getUniqueValues(key) {
    const values = appState.allPrompts
        .map(p => p[key])
        .filter(value => value !== undefined && value !== null && value !== '')
        .sort();
    return [...new Set(values)];
}

/**
 * Populate role filter dropdown
 */
function populateRoleFilter() {
    const roles = getUniqueValues('role');
    DOM.roleFilter.innerHTML = '<option value="">All Roles</option>';
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        DOM.roleFilter.appendChild(option);
    });
}

/**
 * Populate category filter dropdown
 */
function populateCategoryFilter() {
    const categories = getUniqueValues('category');
    DOM.categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        DOM.categoryFilter.appendChild(option);
    });
}

/**
 * Populate subcategory filter dropdown
 */
function populateSubcategoryFilter() {
    const subcategories = getUniqueValues('subcategory');
    DOM.subcategoryFilter.innerHTML = '<option value="">All Subcategories</option>';
    subcategories.forEach(subcategory => {
        if (!subcategory) return;
        const option = document.createElement('option');
        option.value = subcategory;
        option.textContent = subcategory;
        DOM.subcategoryFilter.appendChild(option);
    });
}

/**
 * Populate prompt select dropdown
 */
function populatePromptSelect() {
    DOM.promptSelect.innerHTML = '<option value="">Choose a prompt...</option>';
    appState.filteredPrompts.forEach(prompt => {
        const option = document.createElement('option');
        option.value = prompt.id;
        option.textContent = prompt.name;
        DOM.promptSelect.appendChild(option);
    });
}

/**
 * Display selected prompt details
 */
function displayPromptDetails(promptId) {
    if (!promptId) {
        DOM.promptDescription.innerHTML = '<p class="text-muted">Select a prompt to see details</p>';
        DOM.tagsContainer.innerHTML = '';
        return;
    }
    
    const prompt = appState.allPrompts.find(p => p.id === parseInt(promptId));
    if (!prompt) return;
    
    appState.selectedPrompt = prompt;
    
    // Display metadata and description
    const metadata = [];
    metadata.push(`<strong>Role:</strong> ${escapeHtml(prompt.role)}`);
    metadata.push(`<strong>Category:</strong> ${escapeHtml(prompt.category)}`);
    if (prompt.subcategory) {
        metadata.push(`<strong>Subcategory:</strong> ${escapeHtml(prompt.subcategory)}`);
    }
    
    DOM.promptDescription.innerHTML = `
        <div class="prompt-meta">${metadata.join(' · ')}</div>
        <p>${escapeHtml(prompt.description)}</p>
    `;
    
    // Display tags
    DOM.tagsContainer.innerHTML = prompt.tags
        .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join('');
    
    // Add to recent
    addToRecent(prompt.id);
}

/**
 * Update favorites list in sidebar
 */
function updateFavoritesList() {
    const favoritePrompts = appState.allPrompts.filter(p => appState.favorites.includes(p.id));
    
    if (favoritePrompts.length === 0) {
        DOM.favoritesList.innerHTML = '<p class="empty-message">No favorites yet</p>';
        return;
    }
    
    DOM.favoritesList.innerHTML = favoritePrompts
        .map(prompt => `
            <div class="favorite-item" data-prompt-id="${prompt.id}">
                <span class="favorite-name">${escapeHtml(prompt.name)}</span>
                <button class="favorite-remove" title="Remove favorite">×</button>
            </div>
        `)
        .join('');
    
    // Add event listeners
    DOM.favoritesList.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-remove')) {
                e.stopPropagation();
                const id = parseInt(item.dataset.promptId);
                toggleFavorite(id);
            } else {
                const id = item.dataset.promptId;
                DOM.promptSelect.value = id;
                displayPromptDetails(id);
            }
        });
    });
}

/**
 * Update recent prompts list in sidebar
 */
function updateRecentList() {
    const recentPrompts = appState.recentPrompts
        .map(id => appState.allPrompts.find(p => p.id === id))
        .filter(p => p !== undefined);
    
    if (recentPrompts.length === 0) {
        DOM.recentList.innerHTML = '<p class="empty-message">No recent prompts</p>';
        return;
    }
    
    DOM.recentList.innerHTML = recentPrompts
        .map(prompt => `
            <div class="recent-item" data-prompt-id="${prompt.id}">
                ${escapeHtml(prompt.name)}
            </div>
        `)
        .join('');
    
    // Add event listeners
    DOM.recentList.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.promptId;
            DOM.promptSelect.value = id;
            displayPromptDetails(id);
        });
    });
}

// ============================================================================
// Filtering & Search
// ============================================================================

/**
 * Filter prompts based on role and category
 */
function applyFilters() {
    const role = DOM.roleFilter.value;
    const category = DOM.categoryFilter.value;
    const subcategory = DOM.subcategoryFilter.value;
    const search = DOM.searchInput.value.toLowerCase().trim();
    
    appState.filteredPrompts = appState.allPrompts.filter(prompt => {
        const roleMatch = !role || prompt.role === role;
        const categoryMatch = !category || prompt.category === category;
        const subcategoryMatch = !subcategory || prompt.subcategory === subcategory;
        const searchMatch = !search || 
            prompt.name.toLowerCase().includes(search) ||
            prompt.description.toLowerCase().includes(search) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(search));
        
        return roleMatch && categoryMatch && subcategoryMatch && searchMatch;
    });
    
    // Reset selection and repopulate dropdown
    DOM.promptSelect.value = '';
    displayPromptDetails('');
    populatePromptSelect();
}

// ============================================================================
// Prompt Generation
// ============================================================================

/**
 * Generate prompt with requirement replacement
 */
function generatePrompt() {
    if (!appState.selectedPrompt) {
        showError('Please select a prompt first');
        return;
    }
    
    const requirement = DOM.requirementInput.value.trim();
    if (!requirement) {
        showError('Please enter a requirement');
        return;
    }
    
    let generatedPrompt = appState.selectedPrompt.template;
    generatedPrompt = generatedPrompt.replace(/{{REQUIREMENT}}/g, requirement);
    generatedPrompt = generatedPrompt.replace(/{{ROLE}}/g, appState.selectedPrompt.role || '');
    generatedPrompt = generatedPrompt.replace(/{{CATEGORY}}/g, appState.selectedPrompt.category || '');
    generatedPrompt = generatedPrompt.replace(/{{SUBCATEGORY}}/g, appState.selectedPrompt.subcategory || '');
    
    // Display generated prompt
    DOM.generatedPromptOutput.textContent = generatedPrompt;
    DOM.generatedPromptSection.style.display = 'block';
    DOM.emptyPromptMessage.style.display = 'none';
    
    // Add to recent if not already there
    addToRecent(appState.selectedPrompt.id);
}

/**
 * Copy generated prompt to clipboard
 */
async function copyToClipboard() {
    const text = DOM.generatedPromptOutput.textContent;
    try {
        await navigator.clipboard.writeText(text);
        showCopyNotification();
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyNotification();
    }
}

/**
 * Show copy notification
 */
function showCopyNotification() {
    DOM.copyNotification.style.display = 'block';
    setTimeout(() => {
        DOM.copyNotification.style.display = 'none';
    }, 2000);
}

/**
 * Clear form and reset
 */
function clearForm() {
    DOM.requirementInput.value = '';
    DOM.promptSelect.value = '';
    appState.selectedPrompt = null;
    displayPromptDetails('');
    DOM.generatedPromptSection.style.display = 'none';
    DOM.emptyPromptMessage.style.display = 'block';
}

// ============================================================================
// Import/Export
// ============================================================================

/**
 * Export prompts to JSON file
 */
function exportPrompts() {
    const dataToExport = appState.allPrompts;
    const dataString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Import prompts from JSON file
 */
function importPrompts() {
    DOM.fileInput.click();
}

/**
 * Handle file upload for import
 */
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const prompts = JSON.parse(text);
        
        // Validate structure
        if (!Array.isArray(prompts)) {
            throw new Error('Invalid format: Expected an array of prompts');
        }
        
        validatePromptsStructure(prompts);
        
        // Update state and save to localStorage as imported prompts
        appState.allPrompts = prompts;
        appState.filteredPrompts = [...prompts];
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PROMPTS_SOURCE, APP_CONFIG.PROMPT_SOURCES.IMPORT);
        
        // Refresh UI
        populateRoleFilter();
        populateCategoryFilter();
        populateSubcategoryFilter();
        populatePromptSelect();
        
        showSuccess(`Imported ${prompts.length} prompts successfully`);
        console.log(`✓ Imported ${prompts.length} prompts`);
    } catch (error) {
        console.error('Error importing prompts:', error);
        showError(`Failed to import prompts: ${error.message}`);
    }
    
    // Reset file input
    DOM.fileInput.value = '';
}

// ============================================================================
// Event Listeners
// ============================================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Header
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.uploadBtn.addEventListener('click', importPrompts);
    DOM.exportBtn.addEventListener('click', exportPrompts);
    DOM.fileInput.addEventListener('change', handleFileUpload);
    
    // Sidebar
    DOM.searchInput.addEventListener('input', applyFilters);
    DOM.roleFilter.addEventListener('change', applyFilters);
    DOM.categoryFilter.addEventListener('change', applyFilters);
    DOM.subcategoryFilter.addEventListener('change', applyFilters);
    
    // Main Content
    DOM.promptSelect.addEventListener('change', (e) => {
        displayPromptDetails(e.target.value);
    });
    DOM.generateBtn.addEventListener('click', generatePrompt);
    
    // Generated Prompt
    DOM.copyBtn.addEventListener('click', copyToClipboard);
    DOM.clearBtn.addEventListener('click', clearForm);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && DOM.requirementInput === document.activeElement) {
            generatePrompt();
        }
    });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Show error message in UI and console
 */
function showError(message) {
    console.error('❌ Error:', message);
    
    // Create error container if it doesn't exist
    let errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'errorContainer';
        errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #ef4444;
            color: white;
            padding: 20px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-height: 50vh;
            overflow-y: auto;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
        document.body.insertBefore(errorContainer, document.body.firstChild);
    }
    
    // Display the error message with formatting
    const messageContent = message.split('\n').map(line => 
        line.trim() ? `<div style="margin: 8px 0;">${escapeHtml(line)}</div>` : ''
    ).join('');
    
    errorContainer.innerHTML = `
        <div style="margin: 0 auto; max-width: 1200px;">
            <strong style="font-size: 18px;">⚠️ Application Error</strong>
            <div style="margin-top: 12px; font-size: 14px;">
                ${messageContent}
            </div>
            <div style="margin-top: 16px;">
                <button onclick="location.reload()" style="
                    background-color: white;
                    color: #ef4444;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                ">Reload Application</button>
            </div>
        </div>
    `;
}

/**
 * Show success message
 */
function showSuccess(message) {
    console.log('✅ Success:', message);
    // You could implement a toast notification here
    // For now, just log to console
}

// ============================================================================
// Application Startup
// ============================================================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

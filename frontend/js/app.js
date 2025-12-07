// const form = document.getElementById('queryForm');
// form.addEventListener('submit', function(e) {
// e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();

//   if (!title || !description) {
//     alert("Please fill in all fields.");
//     return;
//   }

//   const query = { title, category, description, submittedAt: new Date().toLocaleString() };
//   console.log('Query Submitted:', query);
//   alert("Query submitted successfully!\nTitle: " + title + "\nCategory: " + category);

//   const savedQueries = JSON.parse(localStorage.getItem('queries') || '[]');
//   savedQueries.push(query);
//   localStorage.setItem('queries', JSON.stringify(savedQueries));

//   form.reset();
// });

// DOM Elements
const queryForm = document.getElementById('queryForm');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const descriptionTextarea = document.getElementById('description');
const answerTextarea = document.getElementById('answer');
const sidebar = document.querySelector('.sidebar');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    loadRecentQueries();
    setupMobileResponsive();
}

// Setup event listeners
function setupEventListeners() {
    queryForm.addEventListener('submit', handleFormSubmit);
    
    // Input animations
    titleInput.addEventListener('focus', handleInputFocus);
    titleInput.addEventListener('blur', handleInputBlur);
    descriptionTextarea.addEventListener('focus', handleInputFocus);
    descriptionTextarea.addEventListener('blur', handleInputBlur);
    
    // Sidebar interactions
    setupSidebarEvents();
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const description = descriptionTextarea.value.trim();
    
    if (!title || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    try {
        const response = await simulateAIResponse(title, category, description);       
        showAIResponse(response);
        addToRecentQueries(title, category);       
        showNotification('Query submitted successfully!', 'success');
        resetForm();       
    } catch (error) {
        showNotification('Error submitting query. Please try again.', 'error');
        hideLoadingState();
    }
}

// Simulate AI response (replace with actual API call)
function simulateAIResponse(title, category, description) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const responses = {
                'General': `Thank you for your general query: "${title}"\n\nBased on your description, here's a comprehensive response:\n\n${description}\n\nThis is a simulated AI response. In a real implementation, this would connect to an AI service like OpenAI GPT, Claude, or a custom model to provide accurate and helpful answers.\n\nKey points to consider:\n- Your query has been categorized as ${category}\n- Our AI system would analyze the context and provide relevant information\n- You can expect detailed, accurate responses tailored to your specific needs\n\nIs there anything specific you'd like me to elaborate on?`,
                
                'Exam': `Exam Query Response: "${title}"\n\nFor your exam-related question:\n\n${description}\n\nHere are some helpful tips:\n\n1. Create a study schedule and stick to it\n2. Practice with past papers and mock tests\n3. Focus on understanding concepts rather than memorization\n4. Take regular breaks to avoid burnout\n5. Get adequate sleep before exams\n\nWould you like specific study strategies for your subject area?`,
                
                'Library': `Library Services Response: "${title}"\n\nRegarding your library inquiry:\n\n${description}\n\nLibrary services typically include:\n\n• Book borrowing and renewal\n• Digital resource access\n• Study spaces and group rooms\n• Research assistance\n• Printing and scanning facilities\n\nFor specific procedures, please contact the library desk or check the online portal.\n\nNeed help with anything else?`,
                
                'Technical': `Technical Support Response: "${title}"\n\nFor your technical issue:\n\n${description}\n\nTroubleshooting steps:\n\n1. Try refreshing the page or clearing browser cache\n2. Check your internet connection\n3. Ensure your browser is up to date\n4. Try accessing from a different device\n5. Contact IT support if the issue persists\n\nTechnical support hours: Mon-Fri 9AM-5PM\nEmail: support@university.edu\nPhone: +1-234-567-8900`,
                
                'Academic': `Academic Query Response: "${title}"\n\nRegarding your academic question:\n\n${description}\n\nAcademic guidance:\n\n• Consult with your academic advisor\n• Review the course syllabus and requirements\n• Utilize office hours for direct faculty interaction\n• Consider forming study groups with classmates\n• Access tutoring services if available\n\nFor specific academic policies, refer to the student handbook or contact the registrar's office.\n\nWould you like information about specific academic resources?`,

                'Fees': `Fees Related Query: "${title}"\n\n${description}\n\nHere’s what you can check:\n\n• Check fee payment deadlines\n• Visit the finance office for clarification\n• Use online portal for fee status\n• Email: fees@university.edu\n\nNeed help with a specific fee component?`,

                'Syllabus': `Syllabus Query: "${title}"\n\n${description}\n\nTo view or download syllabus:\n\n• Visit your course portal\n• Contact the department head\n• Ask faculty directly for recent updates\n• Check for any curriculum changes for this semester`,

                'Career': `Career Guidance: "${title}"\n\n${description}\n\nHere are steps you can take:\n\n• Visit the placement cell\n• Attend career counseling sessions\n• Improve LinkedIn/resume\n• Apply for internships\n• Explore job fairs or seminars\n\nWould you like tips for a specific field or role?`,

            };
            
            resolve(responses[category] || responses['General']);
        }, 2000);
    });
}

// Show loading state
function showLoadingState() {
    answerTextarea.value = 'Processing your query...';
    answerTextarea.classList.add('loading');
    
    // Disable form during loading
    const formElements = queryForm.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        element.disabled = true;
    });
}

// Hide loading state
function hideLoadingState() {
    answerTextarea.classList.remove('loading');
    
    const formElements = queryForm.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        element.disabled = false;
    });
}

// Show AI response
function showAIResponse(response) {
    hideLoadingState();
    answerTextarea.value = response;
    
    answerTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset form
function resetForm() {
    titleInput.value = '';
    categorySelect.value = 'General';
    descriptionTextarea.value = '';
}

// Add to recent queries
const query = { title, category, description, timestamp: new Date().toLocaleString() };
addToRecentQueries(query.title, query.category, query.timestamp);

function addToRecentQueries(title, category, timestamp) {
    const dashboard = document.querySelector('.dashboard');
    const newQuery = document.createElement('div');
    newQuery.className = 'queries';
    newQuery.innerHTML = `
        <div>
            <h4>${title}</h4>
            <p class="timestamp">🕒 <span>${timestamp}</span></p>
            <small style="color: #64748b; font-size: 12px;">${category} • Just now</small>
        </div>
        <button onclick="viewQuery('${title}', '${category}', '${timestamp}')">View Details</button>
    `;
    // Insert at the beginning (after the h2)
    const firstQuery = dashboard.querySelector('.queries');
    if (firstQuery) {
        dashboard.insertBefore(newQuery, firstQuery);
    } else {
        dashboard.appendChild(newQuery);
    }
    
    // Add animation
    newQuery.style.opacity = '0';
    newQuery.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newQuery.style.transition = 'all 0.3s ease';
        newQuery.style.opacity = '1';
        newQuery.style.transform = 'translateY(0)';
    }, 100);
    
    // Limit to 5 recent queries
    const allQueries = dashboard.querySelectorAll('.queries');
    if (allQueries.length > 5) {
        allQueries[allQueries.length - 1].remove();
    }
}

// View query details
function viewQuery(title, category = 'General', timestamp = '') {
    const modal = createModal(title, category, timestamp);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Create modal for query details
function createModal(title, category, timestamp) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Status:</strong> <span class="status-badge">Answered</span></p>
                <p><strong>Submitted:</strong> ${timestamp}</p>
                <p><strong>Description:</strong> This query was submitted through the student portal and has been processed by our AI system.</p>
            </div>
            <div class="modal-footer">
                <button onclick="closeModal(this)" class="btn-secondary">Close</button>
                <button onclick="markAsRead(this)" class="btn-primary">Mark as Read</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Add modal content styles
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateY(-50px);
        transition: transform 0.3s ease;
    `;
    
    modal.classList.add('show');
    
    return modal;
}

// Close modal
function closeModal(element) {
    const modal = element.closest('.modal-overlay');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Mark as read
function markAsRead(element) {
    showNotification('Query marked as read', 'success');
    closeModal(element);
}

// Handle input focus
function handleInputFocus(e) {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 4px 15px rgba(41, 98, 255, 0.2)';
}

// Handle input blur
function handleInputBlur(e) {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '';
}

// Setup sidebar events
function setupSidebarEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
            
            const label = this.querySelector('.nav-label').textContent;
            handleNavigation(label);
        });
    });
}

// Handle login navigation
function handleLogin() {
    window.location.href = '/login';
}

// Handle signup navigation
function handleSignup() {
    window.location.href = '/signup';
}

// Handle navigation
function handleNavigation(section) {
    switch(section) {
        case 'Dashboard':
            scrollToSection('.dashboard');
            break;
        case 'Queries':
            scrollToSection('.form-container');
            break;
        case 'Settings':
            showNotification('Settings page coming soon!', 'info');
            break;
        case 'Help':
            scrollToSection('.help-section');
            break;
        case 'Login':
            window.location.href= 'login.html';
            break;
        case 'Signup':
            window.location.href = 'signup.html';
            break;
    }
}

// Scroll to section
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Setup mobile responsive behavior
function setupMobileResponsive() {
    if (window.innerWidth <= 768) {
        sidebar.addEventListener('mouseenter', function() {
            this.style.width = '260px';
        });
        
        sidebar.addEventListener('mouseleave', function() {
            this.style.width = '80px';
        });
        
        // Touch events for mobile
        sidebar.addEventListener('touchstart', function() {
            this.style.width = '260px';
        });
        
        document.addEventListener('touchstart', function(e) {
            if (!sidebar.contains(e.target)) {
                sidebar.style.width = '80px';
            }
        });
    }
}

// Load recent queries (simulate from local storage or API)
function loadRecentQueries() {
    const sampleQueries = [
        { title: 'How to prepare for final exams?', category: 'Exam', date: 'Today' },
        { title: 'Library book renewal process', category: 'Library', date: 'Yesterday' },
        { title: 'Technical support for portal', category: 'Technical', date: '2 days ago' }
    ];
}

// Show notification
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle window resize
window.addEventListener('resize', function() {
    setupMobileResponsive();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === titleInput || document.activeElement === descriptionTextarea) {
            e.preventDefault();
            queryForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            closeModal(modal.querySelector('.close-btn'));
        }
    }
});

// Search functionality (for future enhancement)
function searchQueries(searchTerm) {
    const queries = document.querySelectorAll('.queries');
    queries.forEach(query => {
        const title = query.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm.toLowerCase())) {
            query.style.display = 'flex';
        } else {
            query.style.display = 'none';
        }
    });
}

// Export data functionality (for future enhancement)
function exportQueries() {
    const queries = Array.from(document.querySelectorAll('.queries')).map(query => ({
        title: query.querySelector('h3').textContent,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })

    }));
    
    const dataStr = JSON.stringify(queries, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_queries.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Print functionality
function printQuery(title, content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Query: ${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2962ff; }
                    .content { margin-top: 20px; line-height: 1.6; }
                    .footer { margin-top: 40px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="content">${content}</div>
                <div class="footer">
                    <p>Generated from Student Query Portal</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Theme toggle functionality (for future enhancement)
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Auto-save draft functionality
function autoSaveDraft() {
    const draft = {
        title: titleInput.value,
        category: categorySelect.value,
        description: descriptionTextarea.value,
        timestamp: new Date().toISOString()
    };
    
    if (draft.title || draft.description) {
        localStorage.setItem('queryDraft', JSON.stringify(draft));
    }
}

// Load saved draft
function loadDraft() {
    const savedDraft = localStorage.getItem('queryDraft');
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        const timeDiff = new Date() - new Date(draft.timestamp);
        
        // Only load draft if it's less than 24 hours old
        if (timeDiff < 24 * 60 * 60 * 1000) {
            titleInput.value = draft.title || '';
            categorySelect.value = draft.category || 'General';
            descriptionTextarea.value = draft.description || '';
            
            if (draft.title || draft.description) {
                showNotification('Draft restored', 'info');
            }
        }
    }
}

// Clear draft
function clearDraft() {
    localStorage.removeItem('queryDraft');
}

// Setup auto-save
function setupAutoSave() {
    let saveTimeout;
    
    [titleInput, descriptionTextarea].forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(autoSaveDraft, 1000); // Save after 1 second of inactivity
        });
    });
}

// Initialize additional features
function initializeAdditionalFeatures() {
    loadTheme();
    loadDraft();
    setupAutoSave();
    
    // Clear draft on successful submission
    queryForm.addEventListener('submit', function() {
        setTimeout(clearDraft, 2000); // Clear draft after successful submission
    });
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initializeAdditionalFeatures();
});

// Utility functions
const utils = {
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    // Truncate text
    truncateText: function(text, maxLength = 100) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Analytics (for future enhancement)
const analytics = {
    trackEvent: function(eventName, data = {}) {
        console.log('Analytics Event:', eventName, data);
    },
    
    trackPageView: function(page) {
        this.trackEvent('page_view', { page });
    },
    
    trackQuerySubmission: function(category) {
        this.trackEvent('query_submitted', { category });
    }
};

// Performance monitoring
const performance = {
    startTime: Date.now(),
    
    measureLoadTime: function() {
        const loadTime = Date.now() - this.startTime;
        console.log('Page load time:', loadTime + 'ms');
        return loadTime;
    },
    
    measureResponseTime: function(startTime) {
        const responseTime = Date.now() - startTime;
        console.log('AI response time:', responseTime + 'ms');
        return responseTime;
    }
};

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.reason);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('Network error. Please check your connection.', 'error');
});

// Service Worker registration (for future PWA enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
            });
    });
}

// TOAST QUERY SUBMIT
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// FEEDBACK NOTIFY 
document.querySelectorAll('.icon-button').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('feedback-status').innerText = "Thanks for your feedback!";
    });
});

// FILENAME 
function downloadResponse() {
    const responseText = document.getElementById('answer').value;
    const blob = new Blob([responseText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "𝚁𝚎𝚖𝚘𝚗𝚣𝙰I!_Response.txt";
    link.click();
}

// FILE UPLOAD 
document.getElementById('file-upload').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen!';
    document.getElementById('file-name').textContent = fileName;
});

// Search Logic 
document.getElementById("searchQuery").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const allQueries = document.querySelectorAll(".query-card");

allQueries.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(value) ? "block" : "none";
});
});

document.getElementById("category").addEventListener("change", function () {
    const value = this.value;
    const allQueries = document.querySelectorAll(".query-card");

allQueries.forEach(card => {
    const category = card.getAttribute("data-category");
    card.style.display = (!value || category === value) ? "block" : "none";
});
});

const timestamp = new Date().toLocaleString();
query.timestamp = timestamp;
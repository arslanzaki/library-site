// Digital University Library - Main JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize functionality based on current page
    initializeNavigation();
    
    if (document.getElementById('bookTable')) {
        initializeBookList();
    }
    
    if (document.getElementById('bookRequestForm')) {
        initializeBookRequestForm();
    }
});

// Navigation functionality
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === '/')) {
            link.classList.add('active');
        }
    });
}

// Book List functionality
function initializeBookList() {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('bookTable');
    const headers = table.querySelectorAll('th[data-sort]');
    
    let sortDirection = {};
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        filterTable();
    });
    
    // Sort functionality
    headers.forEach(header => {
        header.classList.add('sortable');
        header.addEventListener('click', function() {
            sortTable(this);
        });
    });
    
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm);
            row.style.display = matches ? '' : 'none';
        });
    }
    
    function sortTable(header) {
        const column = header.getAttribute('data-sort');
        const tableBody = table.querySelector('tbody');
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        
        // Determine sort direction
        if (!sortDirection[column] || sortDirection[column] === 'desc') {
            sortDirection[column] = 'asc';
            header.classList.remove('sorted-desc');
            header.classList.add('sorted-asc');
        } else {
            sortDirection[column] = 'desc';
            header.classList.remove('sorted-asc');
            header.classList.add('sorted-desc');
        }
        
        // Clear other column sort indicators
        headers.forEach(h => {
            if (h !== header) {
                h.classList.remove('sorted-asc', 'sorted-desc');
            }
        });
        
        // Sort rows
        rows.sort((a, b) => {
            const aText = a.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent.trim();
            const bText = b.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent.trim();
            
            let comparison = 0;
            
            if (column === 'year') {
                comparison = parseInt(aText) - parseInt(bText);
            } else if (column === 'availability') {
                comparison = aText.localeCompare(bText);
            } else {
                comparison = aText.localeCompare(bText, undefined, { sensitivity: 'base' });
            }
            
            return sortDirection[column] === 'asc' ? comparison : -comparison;
        });
        
        // Re-append sorted rows
        rows.forEach(row => tableBody.appendChild(row));
    }
    
    function getColumnIndex(column) {
        const columnMap = {
            'title': 1,
            'author': 2,
            'genre': 3,
            'year': 4,
            'availability': 5
        };
        return columnMap[column] || 1;
    }
}

// Book Request Form functionality
function initializeBookRequestForm() {
    const form = document.getElementById('bookRequestForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show success message
            showSuccessAlert();
            
            // Reset form
            form.reset();
            
            // Clear any error states
            clearErrors();
        }
    });
    
    function validateForm() {
        let isValid = true;
        clearErrors();
        
        // Validate Full Name
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) {
            showError('fullName', 'Full Name is required');
            isValid = false;
        }
        
        // Validate Email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Book Title
        const bookTitle = document.getElementById('bookTitle').value.trim();
        if (!bookTitle) {
            showError('bookTitle', 'Book Title is required');
            isValid = false;
        }
        
        // Validate Reason for Request
        const reason = document.getElementById('reason').value.trim();
        if (!reason) {
            showError('reason', 'Please provide a reason for your request');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error');
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }
    
    function clearErrors() {
        const errorGroups = document.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
        });
    }
    
    function showSuccessAlert() {
        // Create and show success alert
        const alert = document.createElement('div');
        alert.className = 'success-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">✓</span>
                <span class="alert-message">Request Submitted Successfully!</span>
            </div>
        `;
        
        // Add styles for the alert
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        const alertContent = alert.querySelector('.alert-content');
        alertContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(alert);
        
        // Remove alert after 4 seconds
        setTimeout(() => {
            alert.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 4000);
    }
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            const formGroup = this.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
            }
        });
    });
    
    function validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        
        // Clear previous errors for this field
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        // Validate based on field type
        switch(fieldId) {
            case 'fullName':
                if (!value) {
                    showError(fieldId, 'Full Name is required');
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showError(fieldId, 'Email is required');
                } else if (!emailRegex.test(value)) {
                    showError(fieldId, 'Please enter a valid email address');
                }
                break;
            case 'bookTitle':
                if (!value) {
                    showError(fieldId, 'Book Title is required');
                }
                break;
            case 'reason':
                if (!value) {
                    showError(fieldId, 'Please provide a reason for your request');
                }
                break;
        }
    }
}

// Utility functions
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.book-card, .rule-item, .schedule-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize fade-in animations when page loads
window.addEventListener('load', addFadeInAnimation);

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Escape key to close any alerts
    if (e.key === 'Escape') {
        const alerts = document.querySelectorAll('.success-alert');
        alerts.forEach(alert => {
            alert.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        });
    }
});
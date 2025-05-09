// NutriCoach AI Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add image error handler function with timeout to prevent infinite loading
    function setupImageErrorHandlers() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (!img.hasAttribute('data-error-handled')) {
                // Mark this image as already having error handling
                img.setAttribute('data-error-handled', 'true');
                
                // Get background color based on section
                let bgColor = '#2563eb'; // Default blue
                if (img.closest('#meal-plans-content')) {
                    bgColor = '#16a34a'; // Green
                } else if (img.closest('#supplements-content')) {
                    bgColor = '#9333ea'; // Purple
                } else if (img.closest('#progress-content')) {
                    bgColor = '#f59e0b'; // Amber
                }
                
                // Get icon based on section
                let icon = 'ri-image-line';
                if (img.closest('#workouts-content')) {
                    icon = 'ri-heart-pulse-line';
                } else if (img.closest('#meal-plans-content')) {
                    icon = 'ri-restaurant-line';
                } else if (img.closest('#supplements-content')) {
                    icon = 'ri-medicine-bottle-line';
                } else if (img.closest('#progress-content')) {
                    icon = 'ri-line-chart-line';
                }
                
                // Set a timeout to handle the case where the image never loads or errors
                const imgTimeout = setTimeout(() => {
                    handleImageError(img, bgColor, icon);
                }, 2000); // 2 seconds timeout
                
                // Set the onerror handler
                img.onerror = function() {
                    clearTimeout(imgTimeout); // Clear the timeout since the error event fired
                    handleImageError(this, bgColor, icon);
                };
                
                // Also handle load event to clear the timeout
                img.onload = function() {
                    clearTimeout(imgTimeout);
                };
            }
        });
    }
    
    // Helper function to handle the image error
    function handleImageError(img, bgColor, icon) {
        img.onerror = null; // Remove the handler to prevent infinite loop
        img.onload = null; // Remove onload handler
        
        // Replace the image with a div containing an icon
        const parent = img.parentNode;
        if (parent) {
            // Create replacement element
            const replacementDiv = document.createElement('div');
            replacementDiv.className = img.className;
            replacementDiv.style.backgroundColor = bgColor;
            replacementDiv.style.display = 'flex';
            replacementDiv.style.alignItems = 'center';
            replacementDiv.style.justifyContent = 'center';
            replacementDiv.innerHTML = `<i class="${icon} text-2xl text-white"></i>`;
            
            // Replace the image with our div
            parent.replaceChild(replacementDiv, img);
        }
    }
    
    // Run the image error handler setup
    setupImageErrorHandlers();
    // Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const dashboardContent = document.getElementById('dashboard-content');
    const chatContent = document.getElementById('chat-content');
    
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const mobileLogoutButton = document.getElementById('mobile-logout-button');
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    const chatInput = document.getElementById('chat-input');
    const sendMessageButton = document.getElementById('send-message-button');
    const chatMessages = document.getElementById('chat-messages');

    // Helper Functions
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    // Login handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation (would normally check on a server)
            if (email && password) {
                // Hide login screen, show dashboard
                loginScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                
                // Sample welcome message (would normally be personalized)
                showAlert('Welcome back, John!', 'success');
            } else {
                showAlert('Please enter both email and password', 'error');
            }
        });
    }

    // Logout handling
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
    
    function handleLogout() {
        // Hide dashboard, show login screen
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        showAlert('You have been successfully logged out!', 'success');
    }

    // Mobile menu handling
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
        });
    }
    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    }

    // Navigation handling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            
            // Hide mobile menu if it's open
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            
            // Hide all content sections
            const contentSections = document.querySelectorAll('main > div[id$="-content"]');
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the target section
            if (target === 'dashboard') {
                dashboardContent.classList.remove('hidden');
            } else if (target === 'chat') {
                chatContent.classList.remove('hidden');
                if (chatMessages) {
                    scrollToBottom(chatMessages);
                }
            } else if (target === 'workouts') {
                document.getElementById('workouts-content').classList.remove('hidden');
            } else if (target === 'meal-plans') {
                document.getElementById('meal-plans-content').classList.remove('hidden');
            } else if (target === 'supplements') {
                document.getElementById('supplements-content').classList.remove('hidden');
            } else if (target === 'progress') {
                document.getElementById('progress-content').classList.remove('hidden');
            } else if (target === 'profile') {
                document.getElementById('profile-content').classList.remove('hidden');
            }
            
            // Run image error handler for newly visible content
            setTimeout(setupImageErrorHandlers, 100);
            
            // Update active states in navigation
            updateActiveNavItem(target);
        });
    });

    // Chat functionality
    if (sendMessageButton && chatInput && chatMessages) {
        sendMessageButton.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Show "typing" indicator
        showTypingIndicator();
        
        // Simulate AI response after a delay
        setTimeout(function() {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Generate AI response based on user message
            const aiResponse = generateAIResponse(message);
            addChatMessage(aiResponse, 'assistant');
        }, 1500);
    }
    
    function addChatMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex ' + (sender === 'user' ? 'justify-end' : '');
        
        const currentTime = formatTime(new Date());
        
        if (sender === 'assistant') {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <i class="ri-robot-line"></i>
                </div>
                <div class="bg-gray-200 text-gray-800 rounded-xl rounded-bl-none p-3 max-w-[80%]">
                    <p>${content}</p>
                    <div class="text-xs opacity-70 text-right mt-1">
                        ${currentTime}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-blue-600 text-white rounded-xl rounded-br-none p-3 max-w-[80%]">
                    <p>${content}</p>
                    <div class="text-xs opacity-70 text-right mt-1">
                        ${currentTime}
                    </div>
                </div>
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">
                    <span class="text-sm font-medium">JD</span>
                </div>
            `;
        }
        
        chatMessages.querySelector('.space-y-4').appendChild(messageDiv);
        scrollToBottom(chatMessages);
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex typing-indicator';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                <i class="ri-robot-line"></i>
            </div>
            <div class="bg-gray-200 text-gray-800 rounded-xl rounded-bl-none p-3 max-w-[80%]">
                <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.querySelector('.space-y-4').appendChild(typingDiv);
        scrollToBottom(chatMessages);
    }
    
    function generateAIResponse(userMessage) {
        // Simple keyword-based response system
        userMessage = userMessage.toLowerCase();
        
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            return "Hello! How can I help you with your fitness and nutrition today?";
        } else if (userMessage.includes('workout') || userMessage.includes('exercise') || userMessage.includes('training')) {
            return "Based on your profile and goals, I recommend focusing on a mix of strength training (3-4 days/week) and cardio (2 days/week). For muscle building, emphasize compound movements like squats, deadlifts, bench press, and rows with progressive overload each week.";
        } else if (userMessage.includes('diet') || userMessage.includes('food') || userMessage.includes('eat') || userMessage.includes('nutrition')) {
            return "For optimal nutrition, I recommend consuming around 2,500 calories daily with a macronutrient split of 30% protein, 40% carbs, and 30% fats. Focus on whole foods like lean proteins (chicken, fish, eggs), complex carbs (rice, potatoes, oats), healthy fats (avocados, nuts, olive oil), and plenty of vegetables.";
        } else if (userMessage.includes('supplement') || userMessage.includes('protein') || userMessage.includes('creatine')) {
            return "Based on your goals, I recommend: 1) Whey protein (20-25g post-workout), 2) Creatine monohydrate (5g daily, no loading needed), 3) Fish oil (1-2g daily for overall health), and 4) Vitamin D if you don't get regular sun exposure.";
        } else if (userMessage.includes('weight') || userMessage.includes('fat') || userMessage.includes('muscle')) {
            return "To optimize body composition, focus on a slight caloric surplus (200-300 calories above maintenance) for muscle gain, or a moderate deficit (300-500 calories below maintenance) for fat loss. Combine this with progressive resistance training and adequate protein intake (1.6-2.2g per kg of bodyweight).";
        } else if (userMessage.includes('sleep') || userMessage.includes('recovery') || userMessage.includes('rest')) {
            return "Quality sleep is crucial for recovery and results. Aim for 7-9 hours per night, maintain a consistent sleep schedule, limit screen time before bed, keep your bedroom cool and dark, and consider natural supplements like magnesium if you struggle with sleep.";
        } else {
            return "That's an interesting question! Based on scientific research and best practices in fitness and nutrition, consistency is key to achieving your goals. Would you like me to provide more specific advice about workout planning, nutrition, or recovery strategies?";
        }
    }

    // Helper function for showing alerts
    function showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md fade-in';
        
        // Set styles based on alert type
        if (type === 'success') {
            alertDiv.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
        } else if (type === 'error') {
            alertDiv.classList.add('bg-red-100', 'text-red-800', 'border-l-4', 'border-red-500');
        } else { // info
            alertDiv.classList.add('bg-blue-100', 'text-blue-800', 'border-l-4', 'border-blue-500');
        }
        
        alertDiv.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    ${type === 'success' ? '<i class="ri-check-line text-green-500"></i>' : ''}
                    ${type === 'error' ? '<i class="ri-error-warning-line text-red-500"></i>' : ''}
                    ${type === 'info' ? '<i class="ri-information-line text-blue-500"></i>' : ''}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 5000);
        
        // Make alert dismissible
        const closeButton = alertDiv.querySelector('button');
        closeButton.addEventListener('click', () => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        });
    }

    // Helper function to update the active navigation item
    function updateActiveNavItem(target) {
        // Update sidebar navigation
        const sidebarLinks = document.querySelectorAll('#sidebar a');
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === target) {
                link.classList.add('text-blue-600', 'bg-blue-50', 'font-medium');
                link.classList.remove('text-gray-600', 'hover:text-blue-600', 'hover:bg-gray-100');
            } else {
                link.classList.remove('text-blue-600', 'bg-blue-50', 'font-medium');
                link.classList.add('text-gray-600', 'hover:text-blue-600', 'hover:bg-gray-100');
            }
        });
        
        // Update mobile navigation
        const mobileLinks = document.querySelectorAll('nav.fixed.bottom-0 a');
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === target) {
                link.classList.add('text-blue-600');
                link.classList.remove('text-gray-600', 'hover:text-blue-600');
            } else {
                link.classList.remove('text-blue-600');
                link.classList.add('text-gray-600', 'hover:text-blue-600');
            }
        });
        
        // Update mobile menu
        const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
        mobileMenuLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === target) {
                link.classList.add('text-blue-600', 'font-medium', 'bg-blue-50');
                link.classList.remove('text-gray-600', 'hover:text-blue-600', 'hover:bg-gray-100');
            } else {
                link.classList.remove('text-blue-600', 'font-medium', 'bg-blue-50');
                link.classList.add('text-gray-600', 'hover:text-blue-600', 'hover:bg-gray-100');
            }
        });
    }
    
    // Handle Profile Save
    const saveProfileButton = document.querySelector('#save-profile-button');
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', function() {
            // Get all the profile form values
            const fullName = document.querySelector('#profile-content input[value="John Doe"]').value;
            const email = document.querySelector('#profile-content input[type="email"]').value;
            const height = document.querySelector('#profile-content input[value="178 cm"]').value;
            const weight = document.querySelector('#profile-content input[value="78 kg"]').value;
            
            // Update displayed name in sidebar and mobile menu
            document.querySelectorAll('.font-medium.text-lg, .font-semibold').forEach(el => {
                if (el.textContent === 'John Doe') {
                    el.textContent = fullName;
                }
            });
            
            // Update avatar initials
            const initials = fullName.split(' ').map(name => name[0]).join('');
            document.querySelectorAll('.rounded-full .text-xl, .rounded-full .text-sm, .rounded-full .text-4xl').forEach(el => {
                if (el.textContent.trim() === 'JD') {
                    el.textContent = initials;
                }
            });
            
            // Update weight on dashboard
            const dashboardWeight = document.querySelector('#dashboard-content .text-2xl.font-bold');
            if (dashboardWeight && weight) {
                dashboardWeight.textContent = weight;
            }
            
            // Update welcome message
            const welcomeMessage = document.querySelector('#dashboard-content h2');
            if (welcomeMessage) {
                const firstName = fullName.split(' ')[0];
                welcomeMessage.textContent = `Welcome back, ${firstName}!`;
            }
            
            // Show success message
            showAlert('Profile updated successfully!', 'success');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    function setupImageErrorHandlers() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (!img.hasAttribute('data-error-handled')) {
                img.setAttribute('data-error-handled', 'true');
                
                let bgColor = '#2563eb';
                if (img.closest('#meal-plans-content')) {
                    bgColor = '#16a34a';
                } else if (img.closest('#supplements-content')) {
                    bgColor = '#9333ea';
                } else if (img.closest('#progress-content')) {
                    bgColor = '#f59e0b';
                }
                
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
                
                const imgTimeout = setTimeout(() => {
                    handleImageError(img, bgColor, icon);
                }, 2000);
                
                img.onerror = function() {
                    clearTimeout(imgTimeout);
                    handleImageError(this, bgColor, icon);
                };
                
                img.onload = function() {
                    clearTimeout(imgTimeout);
                };
            }
        });
    }
    
    function handleImageError(img, bgColor, icon) {
        img.onerror = null;
        img.onload = null;
        
        const parent = img.parentNode;
        if (parent) {
            const replacementDiv = document.createElement('div');
            replacementDiv.className = img.className;
            replacementDiv.style.backgroundColor = bgColor;
            replacementDiv.style.display = 'flex';
            replacementDiv.style.alignItems = 'center';
            replacementDiv.style.justifyContent = 'center';
            replacementDiv.innerHTML = `<i class="${icon} text-2xl text-white"></i>`;
            parent.replaceChild(replacementDiv, img);
        }
    }
    
    setupImageErrorHandlers();

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

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                loginScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                showAlert('Welcome back, Josiah!', 'success');
            } else {
                showAlert('Please enter both email and password', 'error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
    
    function handleLogout() {
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        showAlert('You have been successfully logged out!', 'success');
    }

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

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
            
            const contentSections = document.querySelectorAll('main > div[id$="-content"]');
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });
            
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
            
            setTimeout(setupImageErrorHandlers, 100);
            updateActiveNavItem(target);
        });
    });

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
        
        addChatMessage(message, 'user');
        chatInput.value = '';
        showTypingIndicator();
        
        setTimeout(function() {
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
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
                    <span class="text-sm font-medium">JJ</span>
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
});

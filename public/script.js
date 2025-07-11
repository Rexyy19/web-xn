// Global variables
let selectedCharacter = null;
let chatHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startStatusUpdates();
});

// === Games Card Slider ala arisu.cloud ===
document.addEventListener('DOMContentLoaded', function() {
    const gamesSlider = document.querySelector('.games-slider');
    const leftBtn = document.querySelector('.games-slider-container .slider-arrow.left');
    const rightBtn = document.querySelector('.games-slider-container .slider-arrow.right');
    if (gamesSlider && leftBtn && rightBtn) {
        leftBtn.addEventListener('click', function() {
            gamesSlider.scrollBy({ left: -160, behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', function() {
            gamesSlider.scrollBy({ left: 160, behavior: 'smooth' });
        });
    }
});

// Initialize the application
function initializeApp() {
    updateBotStatus();
    loadCharacters();
    loadRankingData();
    loadCommunityStats();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Build character selector change
    const buildGame = document.getElementById('buildGame');
    buildGame.addEventListener('change', function() {
        loadBuildCharacters(this.value);
    });

    // Initialize build character selector
    loadBuildCharacters('genshin');
}

// Switcher page navigation dengan animasi slide
function setupPageSwitcher() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.main-section');
  let currentSection = document.querySelector('.main-section.active') || sections[0];

  function showSection(targetId) {
    if (!currentSection || currentSection.id === targetId) return;
    const nextSection = document.getElementById(targetId);
    if (!nextSection) return;

    // Remove active from all
    sections.forEach(sec => sec.classList.remove('active', 'slide-in', 'slide-out'));
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Animate out current
    currentSection.classList.add('slide-out');
    setTimeout(() => {
      currentSection.classList.remove('slide-out');
      currentSection.style.display = 'none';
      // Animate in next
      nextSection.style.display = 'block';
      nextSection.classList.add('active', 'slide-in');
      setTimeout(() => {
        nextSection.classList.remove('slide-in');
      }, 350);
      currentSection = nextSection;
    }, 350);

    // Set active nav
    const btn = document.querySelector('.nav-btn[data-target="' + targetId + '"]');
    if (btn) btn.classList.add('active');
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showSection(btn.getAttribute('data-target'));
    });
  });

  // Tampilkan Home di awal
  sections.forEach(sec => sec.style.display = 'none');
  currentSection.style.display = 'block';
  currentSection.classList.add('active');
  const btn = document.querySelector('.nav-btn[data-target="' + currentSection.id + '"]');
  if (btn) btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
  setupPageSwitcher();
});

// Scroll spy navigation
function setupScrollSpyNav() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.main-section');

  function updateActiveNav() {
    let current = sections[0];
    const scrollY = window.scrollY + 80; // offset for nav height
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section;
      }
    });
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === current.id);
    });
  }

  // Scroll to section on nav click
  navBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(btn.getAttribute('data-target'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 56, // offset for nav
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

document.addEventListener('DOMContentLoaded', function() {
  setupScrollSpyNav();
});

// ==================== BOT STATUS ====================

// Update bot status
async function updateBotStatus() {
    try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        
        const statusIndicator = document.getElementById('botStatus');
        const groupCount = document.getElementById('groupCount');
        const commandCount = document.getElementById('commandCount');
        
        // Update status indicator
        statusIndicator.className = `status-indicator ${data.status}`;
        statusIndicator.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>${data.status === 'online' ? 'Online' : 'Offline'}</span>
        `;
        
        // Update stats
        groupCount.textContent = data.groups || 0;
        commandCount.textContent = data.commands || 0;
        
        // Update dashboard status
        updateDashboardStatus(data);
        
    } catch (error) {
        console.error('Error updating bot status:', error);
        document.getElementById('botStatus').innerHTML = `
            <i class="fas fa-circle"></i>
            <span>Error</span>
        `;
    }
}

// Update dashboard status
function updateDashboardStatus(data) {
    document.getElementById('dashboardStatus').textContent = data.status === 'online' ? 'Online' : 'Offline';
    document.getElementById('dashboardUptime').textContent = formatUptime(data.uptime);
    document.getElementById('dashboardGroups').textContent = data.groups || 0;
    document.getElementById('dashboardCommands').textContent = data.commands || 0;
}

// Format uptime
function formatUptime(seconds) {
    if (!seconds) return '-';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Start status updates
function startStatusUpdates() {
    setInterval(updateBotStatus, 30000); // Update every 30 seconds
}

// ==================== GAME TOOLS ====================

// Search Genshin Impact profile
async function searchGenshin() {
    const uid = document.getElementById('genshinUID').value.trim();
    const resultBox = document.getElementById('genshinResult');
    
    if (!uid) {
        resultBox.innerHTML = '<div class="error">Masukkan UID terlebih dahulu</div>';
        return;
    }
    
    resultBox.innerHTML = '<div class="loading">Mencari data Genshin...</div>';
    
    try {
        const response = await fetch(`/api/genshin/${uid}`);
        const data = await response.json();
        
        if (data.success) {
            displayGenshinResult(data.data);
        } else {
            resultBox.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        resultBox.innerHTML = '<div class="error">Terjadi kesalahan saat mengambil data</div>';
        console.error('Error:', error);
    }
}

// Display Genshin result
function displayGenshinResult(data) {
    const resultBox = document.getElementById('genshinResult');
    
    const characters = data.characters.map((char, index) => 
        `<div class="character-item">${index + 1}. ${char.name}</div>`
    ).join('');
    
    resultBox.innerHTML = `
        <div class="profile-info">
            <h4>${data.nickname}</h4>
            <p><strong>UID:</strong> ${data.uid}</p>
            <p><strong>AR:</strong> ${data.ar} | <strong>WL:</strong> ${data.wl}</p>
            <p><strong>Signature:</strong> ${data.signature}</p>
            <p><strong>Achievements:</strong> ${data.achievement}</p>
            <p><strong>Spiral Abyss:</strong> ${data.abyss}</p>
        </div>
        <div class="characters-section">
            <h5>Karakter (${data.characters.length})</h5>
            <div class="character-grid">
                ${characters}
            </div>
        </div>
    `;
}

// Search Honkai: Star Rail profile
async function searchHSR() {
    const uid = document.getElementById('hsrUID').value.trim();
    const resultBox = document.getElementById('hsrResult');
    
    if (!uid) {
        resultBox.innerHTML = '<div class="error">Masukkan UID terlebih dahulu</div>';
        return;
    }
    
    resultBox.innerHTML = '<div class="loading">Mencari data HSR...</div>';
    
    try {
        const response = await fetch(`/api/hsr/${uid}`);
        const data = await response.json();
        
        if (data.success) {
            displayHSRResult(data.data);
        } else {
            resultBox.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        resultBox.innerHTML = '<div class="error">Terjadi kesalahan saat mengambil data</div>';
        console.error('Error:', error);
    }
}

// Display HSR result
function displayHSRResult(data) {
    const resultBox = document.getElementById('hsrResult');
    
    const characters = data.characters.map((char, index) => 
        `<div class="character-item">${index + 1}. ${char.name} (Lv.${char.level})</div>`
    ).join('');
    
    resultBox.innerHTML = `
        <div class="profile-info">
            <h4>${data.nickname}</h4>
            <p><strong>UID:</strong> ${data.uid}</p>
            <p><strong>TL:</strong> ${data.trailblazeLevel} | <strong>EQ:</strong> ${data.equilibrium}</p>
            <p><strong>Signature:</strong> ${data.signature}</p>
        </div>
        <div class="characters-section">
            <h5>Karakter (${data.characters.length})</h5>
            <div class="character-grid">
                ${characters}
            </div>
        </div>
    `;
}

// Load characters for database
async function loadCharacters() {
    try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        
        if (data.success) {
            displayCharacters(data.data.genshin, 'genshin');
        }
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

// Display characters
function displayCharacters(characters, game) {
    const characterList = document.getElementById('characterList');
    
    if (!characters || characters.length === 0) {
        characterList.innerHTML = '<div class="no-data">Tidak ada data karakter</div>';
        return;
    }
    
    const characterItems = characters.map(char => 
        `<div class="character-item" onclick="showCharacterDetail('${char}', '${game}')">
            ${char}
        </div>`
    ).join('');
    
    characterList.innerHTML = characterItems;
}

// Show characters by game
function showCharacters(game) {
    // Update active button
    document.querySelectorAll('.game-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load and display characters
    loadCharactersForGame(game);
}

// Load characters for specific game
async function loadCharactersForGame(game) {
    try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        
        if (data.success) {
            const characters = game === 'genshin' ? data.data.genshin : data.data.hsr;
            displayCharacters(characters, game);
        }
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

// Load build characters
async function loadBuildCharacters(game) {
    const buildCharacter = document.getElementById('buildCharacter');
    buildCharacter.innerHTML = '<option value="">Pilih karakter...</option>';
    
    try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        
        if (data.success) {
            const characters = game === 'genshin' ? data.data.genshin : data.data.hsr;
            
            characters.forEach(char => {
                const option = document.createElement('option');
                option.value = char;
                option.textContent = char;
                buildCharacter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading build characters:', error);
    }
}

// Show character detail
function showCharacterDetail(character, game) {
    // This could open a modal or navigate to character detail page
    console.log(`Showing detail for ${character} from ${game}`);
}

// ==================== COMMUNITY ====================

// Load ranking data
async function loadRankingData() {
    try {
        const response = await fetch('/api/community/ranking');
        const data = await response.json();
        
        if (data.success) {
            displayRanking(data.data);
        }
    } catch (error) {
        console.error('Error loading ranking:', error);
    }
}

// Display ranking
function displayRanking(rankingData) {
    const rankingList = document.getElementById('rankingList');
    
    if (!rankingData || Object.keys(rankingData).length === 0) {
        rankingList.innerHTML = '<div class="no-data">Belum ada data ranking</div>';
        return;
    }
    
    let rankingHTML = '';
    
    // Process ranking data
    Object.entries(rankingData).forEach(([groupId, groupData]) => {
        const sortedUsers = Object.entries(groupData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10
        
        rankingHTML += `
            <div class="group-ranking">
                <h5>Group: ${groupId}</h5>
                ${sortedUsers.map(([user, score], index) => `
                    <div class="ranking-item">
                        <div class="ranking-info">
                            <div class="ranking-number">${index + 1}</div>
                            <div class="ranking-name">${user}</div>
                        </div>
                        <div class="ranking-score">${score} pts</div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    rankingList.innerHTML = rankingHTML;
}

// Load community stats
function loadCommunityStats() {
    // This would load from actual data
    document.getElementById('totalMembers').textContent = '150+';
    document.getElementById('activeGroups').textContent = '5';
    document.getElementById('totalMessages').textContent = '10K+';
}

// ==================== AI CHAT ====================

// Load AI characters
async function loadAICharacters() {
    try {
        const response = await fetch('/api/ai/characters');
        const data = await response.json();
        
        if (data.success) {
            displayAICharacters(data.data);
        }
    } catch (error) {
        console.error('Error loading AI characters:', error);
    }
}

// Display AI characters
function displayAICharacters(characters) {
    const characterSelector = document.getElementById('characterSelector');
    
    if (!characters || Object.keys(characters).length === 0) {
        characterSelector.innerHTML = '<div class="no-data">Tidak ada karakter AI</div>';
        return;
    }
    
    const characterOptions = Object.entries(characters).map(([key, char]) => `
        <div class="character-option" onclick="selectCharacter('${key}', '${char.name}')">
            <i class="fas fa-robot"></i>
            <span>${char.name}</span>
        </div>
    `).join('');
    
    characterSelector.innerHTML = characterOptions;
}

// Select character for chat
function selectCharacter(characterKey, characterName) {
    selectedCharacter = characterKey;
    
    // Update UI
    document.querySelectorAll('.character-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.character-option').classList.add('selected');
    
    document.getElementById('selectedCharName').textContent = characterName;
    document.getElementById('chatInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    
    // Clear chat history
    chatHistory = [];
    document.getElementById('chatMessages').innerHTML = `
        <div class="welcome-message">
            <i class="fas fa-robot"></i>
            <p>Selamat datang! Anda sekarang chat dengan ${characterName}.</p>
        </div>
    `;
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !selectedCharacter) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Simulate AI response (in real implementation, this would call the AI API)
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message, selectedCharacter);
            addMessageToChat('ai', response);
        }, 1000 + Math.random() * 2000); // Random delay for realism
        
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
        console.error('Error sending message:', error);
    }
}

// Add message to chat
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    const name = sender === 'user' ? 'Anda' : selectedCharacter;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <i class="${icon}"></i>
            <span>${name}</span>
        </div>
        <div class="message-content">${message}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({ sender, message, timestamp: new Date() });
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-header">
            <i class="fas fa-robot"></i>
            <span>${selectedCharacter}</span>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate AI response (simulated)
function generateAIResponse(message, character) {
    const responses = {
        'paimon': [
            'Ehe~ Paimon senang chat dengan Traveler!',
            'Paimon akan membantu Traveler dengan senang hati!',
            'Wah, pertanyaan yang menarik, Traveler!'
        ],
        'klee': [
            'Bom bom bakudan! Klee senang bermain dengan kamu!',
            'Klee suka sekali bermain dengan bom!',
            'Mama Jean bilang Klee harus hati-hati dengan bom!'
        ],
        'venti': [
            'Ah, pertanyaan yang bagus! Mari kita bernyanyi bersama~',
            'Wine dan musik adalah teman terbaik!',
            'Kebebasan adalah hal yang paling indah!'
        ],
        'default': [
            'Terima kasih atas pertanyaannya!',
            'Saya senang bisa membantu!',
            'Pertanyaan yang sangat menarik!'
        ]
    };
    
    const characterResponses = responses[character] || responses.default;
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
}

// ==================== DASHBOARD ACTIONS ====================

// Restart bot
function restartBot() {
    if (confirm('Apakah Anda yakin ingin restart bot?')) {
        // This would call the actual restart API
        alert('Restart command sent to bot');
    }
}

// Clear cache
function clearCache() {
    if (confirm('Apakah Anda yakin ingin clear cache?')) {
        // This would call the actual clear cache API
        alert('Cache cleared successfully');
    }
}

// Backup data
function backupData() {
    // This would trigger a data backup
    alert('Backup process started. You will be notified when complete.');
}

// ==================== UTILITY FUNCTIONS ====================

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notifications
const notificationCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.info {
        background: #667eea;
    }
    
    .notification.success {
        background: #51cf66;
    }
    
    .notification.error {
        background: #ff6b6b;
    }
    
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

// Inject notification CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Add additional CSS for chat messages
const chatCSS = `
    .message {
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 15px;
        max-width: 80%;
    }
    
    .user-message {
        background: #667eea;
        color: white;
        margin-left: auto;
    }
    
    .ai-message {
        background: #f8f9fa;
        color: #333;
        margin-right: auto;
    }
    
    .message-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .message-content {
        line-height: 1.4;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #667eea;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .error {
        color: #ff6b6b;
        text-align: center;
        padding: 20px;
    }
    
    .no-data {
        color: #666;
        text-align: center;
        padding: 20px;
        font-style: italic;
    }
`;

// Inject chat CSS
const chatStyle = document.createElement('style');
chatStyle.textContent = chatCSS;
document.head.appendChild(chatStyle); 
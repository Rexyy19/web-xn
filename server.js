const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global variables untuk bot status
let botStatus = {
    online: false,
    uptime: 0,
    groups: 0,
    commands: 0,
    lastUpdate: new Date()
};

// ==================== API ENDPOINTS ====================

// Bot Status API
app.get('/api/bot/status', (req, res) => {
    res.json({
        status: botStatus.online ? 'online' : 'offline',
        uptime: botStatus.uptime,
        groups: botStatus.groups,
        commands: botStatus.commands,
        lastUpdate: botStatus.lastUpdate
    });
});

// Game Data API - Genshin Impact
app.get('/api/genshin/:uid', async (req, res) => {
    const { uid } = req.params;
    
    try {
        const data = await scrapeGenshinData(uid);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Game Data API - Honkai: Star Rail
app.get('/api/hsr/:uid', async (req, res) => {
    const { uid } = req.params;
    
    try {
        const data = await scrapeHSRData(uid);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Character Database API
app.get('/api/characters', (req, res) => {
    try {
        const genshinCharacters = loadGenshinCharacters();
        const hsrCharacters = loadHSRCharacters();
        
        res.json({
            success: true,
            data: {
                genshin: genshinCharacters,
                hsr: hsrCharacters
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Build Guides API
app.get('/api/builds/:game/:character', (req, res) => {
    const { game, character } = req.params;
    
    try {
        const buildPath = path.join(__dirname, `../data/${game}guides/${character}.jpg`);
        
        if (fs.existsSync(buildPath)) {
            res.sendFile(buildPath);
        } else {
            res.status(404).json({
                success: false,
                error: 'Build guide not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Community Data API
app.get('/api/community/ranking', (req, res) => {
    try {
        const rankingData = loadRankingData();
        res.json({
            success: true,
            data: rankingData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// AI Characters API
app.get('/api/ai/characters', (req, res) => {
    try {
        const characters = loadAICharacters();
        res.json({
            success: true,
            data: characters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== HELPER FUNCTIONS ====================

async function scrapeGenshinData(uid) {
    const url = `https://enka.network/u/${uid}/`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        const nickname = $('.details h1').text().trim() || '-';
        const arwl = $('.details .ar').text().trim();
        const signature = $('.details .signature').text().trim() || '-';
        
        const arMatch = arwl.match(/AR (\d+)/);
        const wlMatch = arwl.match(/WL (\d+)/);
        const ar = arMatch ? arMatch[1] : '-';
        const wl = wlMatch ? wlMatch[1] : '-';
        
        let achievement = '-', abyss = '-';
        $('table.stats tr.stat').each((_, el) => {
            const label = $(el).find('td').last().text().trim();
            const value = $(el).find('td').first().text().trim();
            
            if (label === 'Total Achievements') achievement = value;
            else if (label === 'Spiral Abyss') abyss = value;
        });
        
        const characters = [];
        $('.CharacterList .avatar.live').each((i, el) => {
            const style = $(el).find('figure').attr('style') || '';
            const match = style.match(/UI_AvatarIcon_Side_([A-Za-z0-9]+)/);
            const rawName = match ? match[1] : `Karakter ${i + 1}`;
            const name = rawName.replace(/_/g, ' ');
            characters.push({ name, rawName });
        });
        
        return {
            nickname,
            uid,
            ar,
            wl,
            signature,
            abyss,
            achievement,
            characters
        };
    } catch (error) {
        throw new Error('Failed to fetch Genshin data');
    }
}

async function scrapeHSRData(uid) {
    const url = `https://enka.network/hsr/${uid}/`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        const nickname = $('h1').first().text().trim();
        const trailblazeLevel = $('h1').first().next().text().match(/TL\s*(\d+)/)?.[1] || '-';
        const equilibrium = $('h1').first().next().text().match(/EQ\s*(\d+)/)?.[1] || '-';
        const signature = $('.signature').text().trim() || '-';
        
        const characters = [];
        $('.avatar.live').each((i, el) => {
            const $char = $(el);
            const style = $char.find('figure').attr('style') || '';
            const level = $char.find('.level').text().trim() || '??';
            
            let iconId = 'unknown';
            const avatarMatch = style.match(/AvatarRoundIcon\/(\d+)\.png/);
            if (avatarMatch) iconId = avatarMatch[1];
            
            let name = $char.find('.avatar-name, .name, .character-name').text().trim();
            if (!name) {
                name = $char.find('figure').attr('data-name') || 'Unknown';
            }
            
            characters.push({ 
                iconId, 
                name,
                level
            });
        });
        
        return {
            nickname,
            uid,
            trailblazeLevel,
            equilibrium,
            signature,
            characters
        };
    } catch (error) {
        throw new Error('Failed to fetch HSR data');
    }
}

function loadGenshinCharacters() {
    try {
        const guidesDir = path.join(__dirname, '../data/giguides');
        const files = fs.readdirSync(guidesDir);
        return files
            .filter(f => f.endsWith('.jpg'))
            .map(f => f.replace('.jpg', ''))
            .sort();
    } catch (error) {
        return [];
    }
}

function loadHSRCharacters() {
    try {
        const guidesDir = path.join(__dirname, '../data/hsrguides');
        const files = fs.readdirSync(guidesDir);
        return files
            .filter(f => f.endsWith('.png'))
            .map(f => f.replace('.png', ''))
            .sort();
    } catch (error) {
        return [];
    }
}

function loadRankingData() {
    try {
        const rankingDir = path.join(__dirname, '../data/ranking');
        const files = fs.readdirSync(rankingDir);
        const data = {};
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const groupId = file.replace('.json', '');
                const filePath = path.join(rankingDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                data[groupId] = JSON.parse(content);
            }
        });
        
        return data;
    } catch (error) {
        return {};
    }
}

function loadAICharacters() {
    try {
        const charactersPath = path.join(__dirname, '../data/characters.json');
        const content = fs.readFileSync(charactersPath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        return {};
    }
}

// Update bot status setiap 30 detik
setInterval(() => {
    botStatus.uptime = process.uptime();
    botStatus.lastUpdate = new Date();
    // Di sini bisa ditambahkan logic untuk cek status bot yang sebenarnya
}, 30000);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Web server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🎮 Game Tools: http://localhost:${PORT}/tools`);
    console.log(`🤖 AI Chat: http://localhost:${PORT}/chat`);
});

module.exports = app; 
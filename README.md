# 🌐 ZenBot Web Interface

Platform web canggih untuk mengelola bot WhatsApp dengan fitur game integration, AI chat, dan community management.

## 🚀 Fitur Utama

### 🎮 Game Tools
- **Real-time Game Data Integration** - Cek profil Genshin Impact dan Honkai: Star Rail
- **Character Database** - Database karakter lengkap dengan build guides
- **UID Verification** - Verifikasi akun game member
- **Build Guides** - Panduan build karakter yang selalu update

### 🤖 AI Chat Interface
- **Character Selection** - Pilih karakter AI favorit
- **Real-time Chat** - Chat interaktif dengan AI
- **Chat History** - Riwayat percakapan
- **Multi-character Support** - Dukungan berbagai karakter

### 👥 Community Management
- **Ranking Leaderboard** - Papan ranking member
- **Activity Stats** - Statistik aktivitas grup
- **Member Profiles** - Profil member dengan UID game
- **Group Analytics** - Analisis performa grup

### 📊 Dashboard Admin
- **Bot Status Monitoring** - Monitor status bot real-time
- **Quick Actions** - Restart, clear cache, backup data
- **Performance Metrics** - Metrik performa bot
- **Error Logs** - Log error dan debugging

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18.x atau lebih tinggi
- Bot WhatsApp yang sudah berjalan
- Dependencies yang sudah terinstall

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment Variables**
```bash
# Tambahkan di .env atau environment variables
PORT=3000
BOT_API_URL=http://localhost:8080  # URL bot jika berbeda
```

3. **Run Web Server**
```bash
# Development mode
npm run web:dev

# Production mode
npm run web

# Run bot dan web server bersamaan
npm run dev
```

4. **Access Web Interface**
```
http://localhost:3000
```

## 📁 Struktur File

```
web/
├── server.js              # Express.js server
├── public/                # Static files
│   ├── index.html         # Main page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript
└── README.md              # Documentation
```

## 🔌 API Endpoints

### Bot Status
```
GET /api/bot/status
```
**Response:**
```json
{
  "status": "online",
  "uptime": 3600,
  "groups": 5,
  "commands": 150,
  "lastUpdate": "2024-01-01T00:00:00.000Z"
}
```

### Game Data
```
GET /api/genshin/:uid
GET /api/hsr/:uid
```
**Response:**
```json
{
  "success": true,
  "data": {
    "nickname": "PlayerName",
    "uid": "800347418",
    "ar": "60",
    "wl": "9",
    "signature": "Bio player",
    "characters": [...]
  }
}
```

### Character Database
```
GET /api/characters
```
**Response:**
```json
{
  "success": true,
  "data": {
    "genshin": ["Raiden", "Zhongli", "Venti"],
    "hsr": ["Acheron", "Argenti", "Sparkle"]
  }
}
```

### Build Guides
```
GET /api/builds/:game/:character
```
**Response:** Image file (JPG/PNG)

### Community Data
```
GET /api/community/ranking
```
**Response:**
```json
{
  "success": true,
  "data": {
    "groupId": {
      "userId": 150,
      "userId2": 120
    }
  }
}
```

### AI Characters
```
GET /api/ai/characters
```
**Response:**
```json
{
  "success": true,
  "data": {
    "paimon": {
      "name": "Paimon",
      "game": "Genshin Impact",
      "personality": "..."
    }
  }
}
```

## 🎨 UI Components

### Navigation
- Responsive navbar dengan mobile menu
- Smooth scrolling navigation
- Active state indicators

### Hero Section
- Bot status real-time
- Quick action buttons
- Statistics display

### Game Tools
- Search interface untuk UID
- Result display dengan formatting
- Character database browser
- Build guide viewer

### AI Chat
- Character selection sidebar
- Real-time chat interface
- Typing indicators
- Message history

### Dashboard
- Status monitoring cards
- Quick action buttons
- Performance metrics
- Error handling

## 🔧 Configuration

### Server Configuration
```javascript
// web/server.js
const PORT = process.env.PORT || 3000;
const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:8080';
```

### CORS Configuration
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Static Files
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

## 🚀 Deployment

### Local Development
```bash
npm run web:dev
```

### Production
```bash
npm run web
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "web"]
```

## 🔒 Security

### Rate Limiting
- Implement rate limiting untuk API endpoints
- Protect against abuse dan spam

### CORS
- Configure CORS untuk domain yang diizinkan
- Secure cross-origin requests

### Input Validation
- Validate semua input dari user
- Sanitize data sebelum processing

## 📱 Responsive Design

### Mobile Support
- Mobile-first design approach
- Touch-friendly interface
- Responsive navigation

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Performance

### Optimization
- Minified CSS dan JavaScript
- Image optimization
- Lazy loading untuk konten
- Caching strategies

### Monitoring
- Real-time performance metrics
- Error tracking
- User analytics

## 🔄 Integration

### Bot Integration
- Real-time bot status updates
- Command execution via web
- Data synchronization

### External APIs
- Enka.Network integration
- Weather API (optional)
- News API (optional)

## 🐛 Troubleshooting

### Common Issues

1. **Server tidak start**
   - Cek port availability
   - Verify dependencies installation
   - Check environment variables

2. **API calls gagal**
   - Verify bot server running
   - Check network connectivity
   - Review API endpoints

3. **UI tidak responsive**
   - Clear browser cache
   - Check CSS/JS loading
   - Verify file paths

### Debug Mode
```bash
DEBUG=* npm run web:dev
```

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] User authentication
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] PWA support
- [ ] WebSocket integration
- [ ] File upload/download
- [ ] Export functionality
- [ ] API documentation

### Technical Improvements
- [ ] Database integration
- [ ] Caching layer
- [ ] Load balancing
- [ ] CDN integration
- [ ] Automated testing
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub Discussions
- **Contact**: Reach out to maintainers

---

**ZenBot Web Interface** - Powered by Express.js, Modern CSS, and Vanilla JavaScript 🚀 
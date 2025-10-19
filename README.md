# 🚀 Insider Trends - Moteur de Recherche Instagram

> **Solution de veille et d'analyse de tendances sociales pour entreprises**

## 🎯 **Vue d'ensemble**

Insider Trends est une plateforme de recherche et d'analyse de tendances Instagram qui permet de :
- 🔍 **Rechercher** des hashtags et mots-clés
- 📊 **Analyser** les performances des posts
- 📈 **Suivre** les tendances en temps réel
- 🎨 **Générer** des rapports automatiques

## 🏗️ **Architecture**

### **Backend (Railway)**
- **FastAPI** : API REST moderne
- **Instagram Graph API** : Scraping officiel
- **MeiliSearch** : Moteur de recherche
- **OAuth 2.0** : Authentification Instagram
- **Rate Limiting** : 3 req/heure par IP

### **Frontend (Vercel)**
- **Serverless Functions** : Pages dynamiques
- **HTML/CSS/JS** : Interface utilisateur
- **Responsive Design** : Mobile-first
- **Dark Theme** : Design moderne

## 🚀 **Déploiement**

### **Backend (Railway)**
```bash
# Variables d'environnement requises
IG_ACCESS_TOKEN=your_instagram_token
IG_USER_ID=your_user_id
MEILI_HOST=https://meili.insidr.dev
MEILI_MASTER_KEY=your_master_key
```

### **Frontend (Vercel)**
- Déploiement automatique depuis GitHub
- Configuration dans `vercel.json`
- Serverless functions pour les pages

## 🔧 **Endpoints API**

### **Recherche**
- `GET /v1/search/posts` : Recherche Instagram
- `GET /api/healthz` : Health check

### **Authentification**
- `GET /auth/login` : OAuth Instagram
- `GET /auth/callback` : Callback OAuth

### **Webhooks**
- `GET /webhook` : Vérification Meta
- `POST /webhook` : Événements Meta

## 📱 **Pages Frontend**

- `/` : Page d'accueil
- `/search` : Recherche hashtags
- `/privacy` : Confidentialité
- `/terms` : Conditions
- `/data-deletion` : Suppression
- `/review` : Review Meta

## 🎯 **Fonctionnalités**

### **✅ Opérationnelles**
- Scraping Instagram hashtags
- Recherche en temps réel
- OAuth Instagram complet
- Pages légales GDPR
- Rate limiting backend
- Design responsive

### **🔧 En développement**
- Advanced Access Meta
- Tech Provider Meta
- App Review Meta
- Frontend moderne (Lovable)
- Multi-platform (TikTok/Twitter)

## 🚀 **Roadmap**

### **Phase 1 : MVP Instagram**
- ✅ Backend Railway + Frontend Vercel
- ✅ Scraping Instagram officiel
- ✅ Recherche temps réel
- 🔄 Advanced Access Meta
- 🔄 App Review Meta

### **Phase 2 : Multi-platform**
- 🔄 TikTok API
- 🔄 Twitter/X API
- 🔄 Analytics avancées
- 🔄 Rapports automatiques

### **Phase 3 : IA & Analytics**
- 🔄 RAG Tech Stack
- 🔄 LLM Insights
- 🔄 Tendances prédictives
- 🔄 Slides automatiques

## 🛠️ **Tech Stack**

### **Backend**
- **FastAPI** : API moderne
- **Instagram Graph API** : Scraping officiel
- **MeiliSearch** : Moteur de recherche
- **PostgreSQL** : Base de données
- **Redis** : Cache et queues

### **Frontend**
- **Next.js** : Framework React
- **Tailwind CSS** : Styling
- **TypeScript** : Type safety
- **Vercel** : Déploiement

### **Infrastructure**
- **Railway** : Backend hosting
- **Vercel** : Frontend hosting
- **MeiliSearch** : Search engine
- **Docker** : Containerisation

## 📊 **Métriques**

- **Uptime** : 99.9%
- **Latence** : <200ms
- **Rate Limit** : 3 req/heure/IP
- **Posts/Requête** : 5-10 max

## 🔒 **Sécurité**

- **OAuth 2.0** : Authentification sécurisée
- **Rate Limiting** : Protection DDoS
- **GDPR** : Conformité européenne
- **HTTPS** : Chiffrement SSL

## 📞 **Support**

- **Email** : support@insidr.dev
- **GitHub** : Issues et PR
- **Documentation** : Wiki complet

## 📄 **Licence**

MIT License - Voir [LICENSE](LICENSE)

---

**Développé avec ❤️ pour l'analyse de tendances sociales**
# TikTok OAuth - Guide de dépannage

## Problème : "client_key" error lors de la connexion TikTok

Si tu vois l'erreur **"We couldn't log in with TikTok. This may be due to specific app settings. client_key"**, voici comment diagnostiquer et résoudre le problème.

---

## Diagnostic rapide

### Étape 1 : Vérifier les variables d'environnement Railway

**Dans Railway Dashboard** → Ton service backend → Variables :

Assure-toi d'avoir ces 3 variables configurées :
- ✅ `TIKTOK_CLIENT_KEY` - Le Client Key de ton app TikTok (ex: `aw3xxxxx...`)
- ✅ `TIKTOK_CLIENT_SECRET` - Le Client Secret de ton app TikTok  
- ✅ `TIKTOK_REDIRECT_URI` - L'URI de callback (ex: `https://insidr-production.up.railway.app/api/v1/auth/tiktok/callback`)

### Étape 2 : Utiliser l'endpoint de diagnostic

**Teste l'endpoint de debug** :
```
GET https://insidr-production.up.railway.app/api/v1/oauth/debug/tiktok
```

Cela retourne :
- Si `TIKTOK_CLIENT_KEY` est défini
- La longueur du client_key (doit être > 10 caractères)
- Le redirect_uri utilisé
- Des recommandations spécifiques

---

## Causes courantes et solutions

### 1. **TIKTOK_CLIENT_KEY manquant ou vide dans Railway**

**Symptôme** : `has_client_key: false` dans la réponse du debug endpoint

**Solution** :
1. Va sur [TikTok Developer Portal](https://developers.tiktok.com/)
2. Sélectionne ton app
3. Copie le **Client Key** (pas le Client Secret)
4. Ajoute-le dans Railway : `TIKTOK_CLIENT_KEY=aw3xxxxx...`
5. Redéploie le service

---

### 2. **redirect_uri ne correspond pas entre le code et TikTok Portal**

**Symptôme** : L'erreur apparaît après avoir configuré `TIKTOK_CLIENT_KEY`

**Solution** :
1. **Dans Railway**, vérifie la valeur de `TIKTOK_REDIRECT_URI` :
   ```
   https://insidr-production.up.railway.app/api/v1/auth/tiktok/callback
   ```

2. **Dans TikTok Developer Portal** → Ton app → **Redirect URL** :
   - Ajoute EXACTEMENT la même URL
   - **Important** : L'URL doit être **identique** (même majuscules/minuscules, même trailing slash si présent)
   - Exemple : `https://insidr-production.up.railway.app/api/v1/auth/tiktok/callback`

3. Sauvegarde dans TikTok Portal

---

### 3. **Application TikTok en statut "Development" non approuvée**

**Symptôme** : Tout est configuré mais ça ne marche toujours pas

**Solution** :
1. Va sur [TikTok Developer Portal](https://developers.tiktok.com/)
2. Vérifie le statut de ton app :
   - **"In Development"** → Tu ne peux tester qu'avec ton propre compte TikTok
   - **"Submitted"** → En attente d'approbation
   - **"Live"** → Approuvé, fonctionne pour tous les utilisateurs

3. **Pour App Review** :
   - Soumets ton app pour review dans TikTok Portal
   - Fournis une vidéo de démo montrant le flux OAuth
   - Une fois approuvée, le statut passe à "Live"

---

### 4. **Client Key incorrect ou copié avec des espaces**

**Symptôme** : `client_key_length` très court (< 10) dans le debug

**Solution** :
1. Vérifie dans Railway que `TIKTOK_CLIENT_KEY` n'a pas d'espaces avant/après
2. Copie-colle le Client Key depuis TikTok Portal directement
3. Ne modifie pas la valeur

---

## Checklist complète

Avant de tester TikTok OAuth, vérifie :

- [ ] `TIKTOK_CLIENT_KEY` est défini dans Railway (variable d'environnement)
- [ ] `TIKTOK_CLIENT_SECRET` est défini dans Railway  
- [ ] `TIKTOK_REDIRECT_URI` est défini dans Railway
- [ ] Le redirect_uri dans Railway correspond EXACTEMENT à celui dans TikTok Portal
- [ ] L'application TikTok est créée et active dans [TikTok Developer Portal](https://developers.tiktok.com/)
- [ ] Le statut de l'app est "Live" (ou "In Development" si tu testes avec ton propre compte)
- [ ] Les scopes demandés (`user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`) sont activés dans TikTok Portal

---

## Test manuel

### 1. Vérifier la configuration backend

```bash
curl https://insidr-production.up.railway.app/api/v1/oauth/debug/tiktok
```

### 2. Tester le flux OAuth

1. Va sur https://veyl.io/auth
2. Clique sur "Connect with TikTok"
3. Si tu vois l'erreur "client_key", vérifie les points ci-dessus
4. Si ça fonctionne, tu devrais être redirigé vers TikTok pour autoriser

---

## Support

Si le problème persiste après avoir vérifié tous les points :

1. Vérifie les logs Railway pour voir les messages d'erreur détaillés
2. Utilise `/api/v1/oauth/debug/tiktok` pour voir la configuration actuelle
3. Vérifie que Google/Facebook/Instagram fonctionnent (pour confirmer que c'est spécifique à TikTok)

---

**Note** : TikTok OAuth est plus strict que les autres providers. Le `redirect_uri` doit être **exactement identique** entre le code et le portal, sans différence.


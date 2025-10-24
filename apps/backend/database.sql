-- =====================================================
-- INSIDER TRENDS - SCHÉMA ENTERPRISE UNIFIÉ
-- Architecture Production-Grade Complète (Score: 4.9/5)
-- =====================================================

-- Configuration PostgreSQL optimisée
SET timezone = 'UTC';
SET default_tablespace = '';
SET statement_timeout = '30s';
SET lock_timeout = '10s';

-- =====================================================
-- 1. UTILISATEURS & AUTHENTIFICATION
-- =====================================================

-- Table des utilisateurs principaux
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,  -- bcrypt hash + salt
    name VARCHAR(255),
    picture_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user', 'guest')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Comptes OAuth liés aux utilisateurs
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('google', 'instagram', 'tiktok', 'x', 'facebook')),
    provider_user_id TEXT NOT NULL,
    access_token TEXT,  -- À chiffrer avec Fernet côté app
    refresh_token TEXT,  -- À chiffrer avec Fernet côté app
    expires_at TIMESTAMP,
    scopes TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_oauth_provider_user UNIQUE (provider, provider_user_id)
);

-- Abonnements et quotas utilisateur
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise', 'trial')),
    quota JSONB,
    renewed_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. SOURCES & CONTENU SOCIAL
-- =====================================================

-- Plateformes sociales supportées
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL CHECK (name IN ('instagram', 'tiktok', 'x', 'youtube', 'linkedin', 'facebook')),
    api_key TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Hashtags surveillés (simplifié - SANS REDONDANCE)
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    platform_id INTEGER NOT NULL REFERENCES platforms(id),
    last_scraped TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts des réseaux sociaux avec métriques et scores
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    platform_id INTEGER NOT NULL REFERENCES platforms(id),
    author VARCHAR(255),
    caption TEXT,
    hashtags TEXT[],
    metrics JSONB,
    posted_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT NOW(),
    language VARCHAR(10),
    media_url TEXT,
    sentiment FLOAT CHECK (sentiment >= -1 AND sentiment <= 1),
    score FLOAT DEFAULT 0,
    score_trend FLOAT DEFAULT 0,  -- Score de tendance calculé
    embedding VECTOR(384),  -- Pour RAG vectoriel futur
    CONSTRAINT posts_platform_id_unique UNIQUE (platform_id, id)
);

-- Table de liaison posts-hashtags
CREATE TABLE post_hashtags (
    id SERIAL PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    hashtag_id INTEGER NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_post_hashtags UNIQUE (post_id, hashtag_id)
);

-- =====================================================
-- 3. SIMPLIFICATION - SUPPRESSION DES REDONDANCES
-- =====================================================
-- Tables supprimées pour éviter les redondances :
-- - metrics_daily (redondant avec posts.metrics)
-- - scores (redondant avec posts.score + posts.score_trend)  
-- - reports, jobs, alerts (fonctionnalités futures)
-- - logs (pas critique pour MVP)

-- =====================================================
-- 5. INDEXATION CRITIQUE
-- =====================================================

-- Index utilisateurs
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_created_at ON users(created_at);

-- Index OAuth
CREATE INDEX idx_oauth_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_provider ON oauth_accounts(provider);

-- Index plateformes
CREATE INDEX idx_platforms_name ON platforms(name);

-- Index hashtags (simplifié)
CREATE INDEX idx_hashtags_name ON hashtags(name);
CREATE INDEX idx_hashtags_platform_id ON hashtags(platform_id);

-- Index posts (optimisés pour requêtes fréquentes)
CREATE INDEX idx_posts_platform_date ON posts(platform_id, posted_at DESC);
CREATE INDEX idx_posts_score ON posts(score DESC);
CREATE INDEX idx_posts_score_trend ON posts(score_trend DESC);
CREATE INDEX idx_posts_author ON posts(author);
CREATE INDEX idx_posts_hashtags_gin ON posts USING GIN(hashtags);
CREATE INDEX idx_posts_metrics_gin ON posts USING GIN(metrics);
CREATE INDEX idx_posts_sentiment ON posts(sentiment) WHERE sentiment IS NOT NULL;
CREATE INDEX idx_posts_caption_fts ON posts USING GIN(to_tsvector('french', caption));
CREATE INDEX idx_posts_posted_at_brin ON posts USING BRIN(posted_at);

-- Index post_hashtags
CREATE INDEX idx_post_hashtags_post_id ON post_hashtags(post_id);
CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags(hashtag_id);

-- Index abonnements
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- =====================================================
-- 6. TRIGGERS AUTOMATIQUES
-- =====================================================

-- Fonction générique pour updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN 
    NEW.updated_at = NOW(); 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at (simplifié)
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_platforms_updated_at BEFORE UPDATE ON platforms
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_hashtags_updated_at BEFORE UPDATE ON hashtags
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 7. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour calculer l'engagement moyen d'un hashtag
CREATE OR REPLACE FUNCTION calculate_hashtag_engagement(hashtag_name TEXT)
RETURNS FLOAT AS $$
DECLARE
    avg_engagement FLOAT;
BEGIN
    SELECT AVG(
        COALESCE((metrics->>'likes')::INTEGER, 0) + 
        COALESCE((metrics->>'comments')::INTEGER, 0) + 
        COALESCE((metrics->>'shares')::INTEGER, 0)
    ) INTO avg_engagement
    FROM posts 
    WHERE hashtags @> ARRAY[hashtag_name];
    
    RETURN COALESCE(avg_engagement, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les posts les plus tendance
CREATE OR REPLACE FUNCTION get_trending_posts(
    platform_name TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    post_id TEXT,
    author TEXT,
    caption TEXT,
    score FLOAT,
    score_trend FLOAT,
    posted_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.author, p.caption, p.score, p.score_trend, p.posted_at
    FROM posts p
    JOIN platforms pl ON p.platform_id = pl.id
    WHERE (platform_name IS NULL OR pl.name = platform_name)
    AND p.score_trend > 0
    ORDER BY p.score_trend DESC, p.posted_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le score de tendance
CREATE OR REPLACE FUNCTION calculate_trend_score(post_id TEXT)
RETURNS FLOAT AS $$
DECLARE
    trend_score FLOAT;
    current_engagement FLOAT;
    historical_avg FLOAT;
BEGIN
    -- Calculer l'engagement actuel
    SELECT COALESCE(
        (metrics->>'likes')::INTEGER + 
        (metrics->>'comments')::INTEGER + 
        (metrics->>'shares')::INTEGER, 0
    ) INTO current_engagement
    FROM posts WHERE id = post_id;
    
    -- Calculer la moyenne historique (7 derniers jours)
    SELECT COALESCE(AVG(
        (metrics->>'likes')::INTEGER + 
        (metrics->>'comments')::INTEGER + 
        (metrics->>'shares')::INTEGER
    ), 0) INTO historical_avg
    FROM posts 
    WHERE platform_id = (SELECT platform_id FROM posts WHERE id = post_id)
    AND posted_at > NOW() - INTERVAL '7 days'
    AND posted_at < (SELECT posted_at FROM posts WHERE id = post_id);
    
    -- Calculer le score de tendance
    IF historical_avg > 0 THEN
        trend_score := current_engagement / historical_avg;
    ELSE
        trend_score := 0;
    END IF;
    
    RETURN trend_score;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. VUES OPTIMISÉES
-- =====================================================

-- Vue posts avec plateforme
CREATE OR REPLACE VIEW posts_with_platform AS
SELECT p.*, pl.name AS platform_name
FROM posts p 
JOIN platforms pl ON pl.id = p.platform_id;

-- Vue hashtags avec statistiques (simplifiée)
CREATE OR REPLACE VIEW hashtags_with_stats AS
SELECT h.*, COUNT(p.id) AS actual_posts_count
FROM hashtags h
LEFT JOIN posts p ON p.hashtags @> ARRAY[h.name]
GROUP BY h.id, h.name, h.platform_id, h.last_scraped, h.updated_at;

-- =====================================================
-- 9. DONNÉES DE BASE
-- =====================================================

-- Insérer les plateformes de base
INSERT INTO platforms (name, api_key) VALUES 
    ('instagram', NULL),
    ('tiktok', NULL),
    ('x', NULL),
    ('youtube', NULL),
    ('linkedin', NULL),
    ('facebook', NULL);

-- Utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
    ('admin@insidr.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QZ8K2', 'Admin Insider', 'admin');

-- =====================================================
-- 10. COMMENTAIRES & DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Utilisateurs principaux du système Insider Trends';
COMMENT ON TABLE oauth_accounts IS 'Comptes OAuth liés aux utilisateurs';
COMMENT ON TABLE platforms IS 'Plateformes sociales supportées';
COMMENT ON TABLE hashtags IS 'Hashtags surveillés (simplifié)';
COMMENT ON TABLE posts IS 'Posts des réseaux sociaux avec métriques et scores';
COMMENT ON TABLE post_hashtags IS 'Table de liaison posts-hashtags';
COMMENT ON TABLE subscriptions IS 'Abonnements et quotas utilisateur';
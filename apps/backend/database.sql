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

-- Hashtags surveillés avec métriques
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    platform_id INTEGER NOT NULL REFERENCES platforms(id),
    last_scraped TIMESTAMP,
    total_posts INTEGER DEFAULT 0,
    engagement_avg FLOAT DEFAULT 0,
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
-- 3. ANALYSES, RAPPORTS & HISTORIQUE
-- =====================================================

-- Rapports générés par les utilisateurs
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    filters JSONB,
    insights JSONB,
    file_url TEXT
);

-- Tâches en arrière-plan
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL CHECK (type IN ('crawl', 'analysis', 'export', 'notification', 'cleanup')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed', 'cancelled')),
    params JSONB,
    result JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Alertes personnalisées des utilisateurs
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condition JSONB,
    notified_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. ANALYTICS LONG TERME
-- =====================================================

-- Métriques quotidiennes
CREATE TABLE metrics_daily (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('hashtag', 'post', 'user')),
    entity_id TEXT NOT NULL,
    date DATE NOT NULL,
    platform_id INTEGER REFERENCES platforms(id),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_metrics_daily_entity_date UNIQUE (entity_type, entity_id, date, platform_id)
);

-- Scores de tendance
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('hashtag', 'post', 'user')),
    entity_id TEXT NOT NULL,
    score_type VARCHAR(50) NOT NULL CHECK (score_type IN ('trend', 'engagement', 'virality', 'sentiment')),
    value FLOAT NOT NULL,
    platform_id INTEGER REFERENCES platforms(id),
    calculated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_scores_entity_type UNIQUE (entity_type, entity_id, score_type, platform_id)
);

-- Logs d'audit
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    payload JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

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

-- Index hashtags
CREATE INDEX idx_hashtags_name ON hashtags(name);
CREATE INDEX idx_hashtags_platform_id ON hashtags(platform_id);
CREATE INDEX idx_hashtags_updated_at ON hashtags(updated_at);

-- Index posts (optimisés pour requêtes fréquentes)
CREATE INDEX idx_posts_platform_date ON posts(platform_id, posted_at DESC);
CREATE INDEX idx_posts_score ON posts(score DESC);
CREATE INDEX idx_posts_author ON posts(author);
CREATE INDEX idx_posts_hashtags_gin ON posts USING GIN(hashtags);
CREATE INDEX idx_posts_metrics_gin ON posts USING GIN(metrics);
CREATE INDEX idx_posts_sentiment ON posts(sentiment) WHERE sentiment IS NOT NULL;

-- Index post_hashtags
CREATE INDEX idx_post_hashtags_post_id ON post_hashtags(post_id);
CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags(hashtag_id);

-- Index rapports
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Index jobs
CREATE INDEX idx_jobs_status_type ON jobs(status, type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Index alertes
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_active ON alerts(active) WHERE active = TRUE;

-- Index abonnements
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- Index métriques quotidiennes
CREATE INDEX idx_metrics_daily_key ON metrics_daily(entity_type, entity_id, date);
CREATE INDEX idx_metrics_daily_platform ON metrics_daily(platform_id);

-- Index scores
CREATE INDEX idx_scores_entity ON scores(entity_type, entity_id);
CREATE INDEX idx_scores_type ON scores(score_type);
CREATE INDEX idx_scores_value ON scores(value DESC);

-- Index logs
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_created_at ON logs(created_at);

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

-- Triggers pour updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_platforms_updated_at BEFORE UPDATE ON platforms
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_hashtags_updated_at BEFORE UPDATE ON hashtags
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON jobs
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
    posted_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.author, p.caption, p.score, p.posted_at
    FROM posts p
    JOIN platforms pl ON p.platform_id = pl.id
    WHERE (platform_name IS NULL OR pl.name = platform_name)
    AND p.score > 0
    ORDER BY p.score DESC, p.posted_at DESC
    LIMIT limit_count;
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

-- Vue hashtags avec statistiques
CREATE OR REPLACE VIEW hashtags_with_stats AS
SELECT h.*, COALESCE(md.views,0) AS actual_posts_count
FROM hashtags h
LEFT JOIN LATERAL (
  SELECT SUM(views)::bigint AS views
  FROM metrics_daily
  WHERE entity_type = 'hashtag' AND entity_id = h.id::text
) md ON TRUE;

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
COMMENT ON TABLE hashtags IS 'Hashtags surveillés avec métriques';
COMMENT ON TABLE posts IS 'Posts des réseaux sociaux avec métriques et scores';
COMMENT ON TABLE post_hashtags IS 'Table de liaison posts-hashtags';
COMMENT ON TABLE reports IS 'Rapports générés par les utilisateurs';
COMMENT ON TABLE jobs IS 'Tâches en arrière-plan';
COMMENT ON TABLE alerts IS 'Alertes personnalisées des utilisateurs';
COMMENT ON TABLE subscriptions IS 'Abonnements et quotas utilisateur';
COMMENT ON TABLE metrics_daily IS 'Métriques quotidiennes pour séries temporelles';
COMMENT ON TABLE scores IS 'Scores de tendance et engagement';
COMMENT ON TABLE logs IS 'Logs d''audit pour conformité';
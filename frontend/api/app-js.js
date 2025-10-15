export default function handler(req, res) {
  const content = `const API = "/api/backend";

async function search() {
  const q = document.getElementById("q").value.trim();
  const res = document.getElementById("results");
  
  // Si pas de recherche, afficher tous les posts Instagram
  const searchQuery = q || "";
  const r = await fetch(\`\${API}/v1/search/posts?q=\${searchQuery}&limit=20&sort=score_trend:desc\`);
  const data = await r.json();
  
  if (!data.hits?.length) {
    res.innerHTML = \`<li>Aucun résultat pour "\${q}"<br><small>Essayez un autre hashtag</small></li>\`;
    return;
  }
  
  res.innerHTML = data.hits.map(h => \`
    <li style="padding:1rem;border-bottom:1px solid #333;background:#1a1a1a;border-radius:8px;margin-bottom:0.5rem;">
      <div style="display:flex;gap:1rem;align-items:flex-start">
        <div style="width:60px;height:60px;background:#333;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">
          \${h.media_type || 'POST'}
        </div>
        <div style="flex:1">
          <div style="display:flex;gap:1rem;align-items:center;margin-bottom:0.5rem;">
            <strong style="color:#fff;">\${h.username || 'Instagram User'}</strong>
            <span style="color:#888;font-size:12px;">\${h.media_type || 'POST'}</span>
          </div>
          <div style="display:flex;gap:1rem;margin-bottom:0.5rem;font-size:12px;color:#888;">
            <span>❤️ \${h.like_count||0}</span>
            <span>💬 \${h.comments_count||0}</span>
            <span>🔥 \${(h.score_trend||0).toFixed(1)}</span>
          </div>
          <p style="color:#ccc;font-size:14px;margin:0.5rem 0;">\${(h.caption||'Pas de description').slice(0,150)}\${(h.caption||'').length > 150 ? '...' : ''}</p>
          <div style="font-size:12px;color:#666;">
            <span>ID: \${h.id}</span>
            \${h.permalink ? \` | <a href="\${h.permalink}" target="_blank" style="color:#0095f6;">Voir sur Instagram</a>\` : ''}
          </div>
        </div>
      </div>
    </li>
  \`).join('');
}

// Fonction d'ingestion supprimée - Utilisation de la recherche directe

document.getElementById("go").onclick = search;
document.getElementById("q").oninput = () => {
  clearTimeout(window.t);
  window.t = setTimeout(search, 300);
};
document.getElementById("q").onkeydown = e => e.key === 'Enter' && search();`;

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(content);
}

const API = "";
const $ = id => document.getElementById(id);

async function search() {
  const q = $("q").value.trim();
  const res = $("#results");
  
  try {
    const r = await fetch(`${API}/v1/search/posts?q=${q}&limit=20&sort=score_trend:desc`);
    if (!r.ok) {
      res.innerHTML = `<li class="alert">❌ Erreur ${r.status}</li>`;
      return;
    }
    
    const data = await r.json();
    
    if (!data.hits?.length) {
      res.innerHTML = `<li class="muted">Aucun résultat pour "${q}"<br><button onclick="ingest('${q}')">Ingérer #${q}</button></li>`;
      return;
    }
    
    res.innerHTML = data.hits.map(h => `
      <li>
        <div style="display:flex;gap:1rem">
          ${h.media_url ? `<img src="${h.media_url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px">` : ''}
          <div style="flex:1">
            <strong>${h.username || 'Instagram'}</strong>
            <span class="badge">❤️ ${h.like_count||0}</span>
            <span class="badge">💬 ${h.comments_count||0}</span>
            <span class="badge">🔥 ${(h.score_trend||0).toFixed(1)}</span>
            <p>${(h.caption||'').slice(0,200)}</p>
            <small>${(h.hashtags||[]).slice(0,5).map(x=>'#'+x).join(' ')} ${h.permalink?`<a href="${h.permalink}" target="_blank">→ Instagram</a>`:''}</small>
          </div>
        </div>
      </li>
    `).join('');
    
  } catch (e) {
    res.innerHTML = `<li class="alert">❌ ${e.message}</li>`;
  }
}

async function ingest(tag) {
  const res = $("#results");
  res.innerHTML = `<li class="muted">⏳ Ingestion en cours...</li>`;
  
  try {
    const r = await fetch(`${API}/v1/ingest/instagram/hashtag`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({tag: tag.replace('#',''), kind: 'top', limit: 30})
    });
    
    const data = await r.json();
    
    if (!r.ok) {
      res.innerHTML = `<li class="alert">❌ ${data.detail||'Erreur'}</li>`;
      return;
    }
    
    res.innerHTML = `<li class="muted">✅ ${data.inserted} posts indexés</li>`;
    setTimeout(search, 1500);
    
  } catch (e) {
    res.innerHTML = `<li class="alert">❌ ${e.message}</li>`;
  }
}

// Events
$("#go").onclick = search;
$("#q").oninput = () => {
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(search, 300);
};
$("#q").onkeydown = e => e.key === 'Enter' && search();

const API = "/api";

async function search() {
  const q = document.getElementById("q").value.trim();
  const res = document.getElementById("results");
  
  const r = await fetch(`${API}/v1/search/posts?q=${q}&limit=20&sort=score_trend:desc`);
  const data = await r.json();
  
  if (!data.hits?.length) {
    res.innerHTML = `<li>Aucun résultat<br><button onclick="ingest('${q}')">Ingérer #${q}</button></li>`;
    return;
  }
  
  res.innerHTML = data.hits.map(h => `
    <li>
      <div style="display:flex;gap:1rem">
        ${h.media_url ? `<img src="${h.media_url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px">` : ''}
        <div style="flex:1">
          <strong>${h.username || 'Instagram'}</strong>
          <span>❤️ ${h.like_count||0}</span>
          <span>💬 ${h.comments_count||0}</span>
          <span>🔥 ${(h.score_trend||0).toFixed(1)}</span>
          <p>${(h.caption||'').slice(0,200)}</p>
          <small>${(h.hashtags||[]).slice(0,5).map(x=>'#'+x).join(' ')} ${h.permalink?`<a href="${h.permalink}" target="_blank">→</a>`:''}</small>
        </div>
      </div>
    </li>
  `).join('');
}

async function ingest(tag) {
  const res = document.getElementById("results");
  res.innerHTML = `<li>⏳ Ingestion...</li>`;
  
  const r = await fetch(`${API}/v1/ingest/instagram/hashtag`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({tag: tag.replace('#',''), kind: 'top', limit: 30})
  });
  
  const data = await r.json();
  res.innerHTML = `<li>✅ ${data.inserted} posts</li>`;
  setTimeout(search, 1500);
}

document.getElementById("go").onclick = search;
document.getElementById("q").oninput = () => {
  clearTimeout(window.t);
  window.t = setTimeout(search, 300);
};
document.getElementById("q").onkeydown = e => e.key === 'Enter' && search();

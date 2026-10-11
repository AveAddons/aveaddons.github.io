(() => {
  'use strict';
  const cfg = window.AZEROTH_CONFIG || { githubOwner: 'AveAddons', addonsRepo: 'addons', discordUrl: '' };
  const repo = `https://github.com/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}`;
  const cards = document.getElementById('cards');
  const status = document.getElementById('status');
  const hint = document.getElementById('catalogHint');
  const search = document.getElementById('search');
  let addons = [];
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const images = { chronicle: 'assets/addons/chronicle.png', foreverjourneyxp: 'assets/addons/foreverjourneyxp.png', 'leatrix maps': 'assets/addons/leatrix-maps.png' };
  const prettyName = name => name.replace(/[-_]+/g,' ').trim();
  function render() {
    const q = search.value.trim().toLowerCase();
    const filtered = addons.filter(a => `${a.name} ${a.description}`.toLowerCase().includes(q));
    cards.innerHTML = filtered.map(a => {
      const key = a.name.toLowerCase().trim();
      const img = images[key] || `assets/addons/${key.replace(/[^a-z0-9]+/g,'-')}.png`;
      return `<article class="card"><div class="card-cover"><span class="fallback-letter">${escapeHTML(a.name.charAt(0))}</span><img src="${escapeHTML(img)}" alt="${escapeHTML(a.name)} Banner" loading="lazy" onerror="this.remove()"></div><div class="card-body"><div class="card-title"><h3>${escapeHTML(a.name)}</h3><span class="version">${escapeHTML(a.version)}</span></div><p>${escapeHTML(a.description)}</p><div class="card-buttons">${a.download ? `<a class="btn primary" href="${escapeHTML(a.download)}" target="_blank" rel="noopener noreferrer">↓ &nbsp; Download</a>` : '<span class="btn disabled">Kein ZIP verfügbar</span>'}<a class="btn outline" href="${escapeHTML(a.url)}" target="_blank" rel="noopener noreferrer">Details ↗</a></div></div></article>`;
    }).join('') || '<p class="empty">Keine passenden Addons gefunden.</p>';
  }
  async function load() {
    try {
      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}/releases?per_page=100`, {headers:{Accept:'application/vnd.github+json'}});
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const releases = await response.json();
      const latest = new Map();
      for (const r of releases) {
        if (r.draft || r.prerelease) continue;
        const tag = r.tag_name || '';
        const match = tag.match(/^(.+?)[-_ ]v?(\d+\.\d+(?:\.\d+)?(?:[-.][\w.]+)?)$/i);
        const name = prettyName(match ? match[1] : (r.name || tag).replace(/\s+v?\d+\.\d+.*$/i,''));
        if (!name || latest.has(name.toLowerCase())) continue;
        const zip = (r.assets || []).find(asset => asset.name.toLowerCase().endsWith('.zip'));
        latest.set(name.toLowerCase(), {name, version:match ? `v${match[2]}` : tag, description:(r.body || 'Addon für World of Warcraft Forever.').replace(/[#*`>\[\]]/g,'').replace(/\s+/g,' ').trim().slice(0,170), download:zip?.browser_download_url || '', url:r.html_url});
      }
      addons = [...latest.values()];
      status.textContent = `${addons.length} Addon${addons.length === 1 ? '' : 's'} verfügbar`;
      hint.textContent = addons.length ? 'Downloads kommen direkt aus den öffentlichen GitHub-Releases.' : 'Noch keine veröffentlichten Releases vorhanden.';
    } catch (e) {
      status.textContent = 'Verbindung fehlgeschlagen';
      hint.textContent = 'GitHub-Releases konnten nicht geladen werden. Bitte später erneut versuchen.';
    }
    render();
  }
  document.getElementById('allReleases').href = repo + '/releases';
  if (cfg.discordUrl && /^https:\/\//i.test(cfg.discordUrl)) {
    ['discordTop','discordHero','discordMain'].forEach(id => { const a=document.getElementById(id); a.href=cfg.discordUrl; a.target='_blank'; a.rel='noopener noreferrer'; });
  } else {
    document.getElementById('discordMain').textContent = 'Discord-Link folgt';
    document.getElementById('discordMain').classList.add('disabled');
  }
  const menu = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menu.addEventListener('click', () => { const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  search.addEventListener('input',render);
  load();
})();

'use strict';
const cfg = window.AVE_CONFIG;
const cards = document.getElementById('cards');
const status = document.getElementById('status');
const hint = document.getElementById('catalogHint');
const search = document.getElementById('search');
const repo = `https://github.com/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}`;
const imageMap = {
  chronicle: 'assets/addons/chronicle.png',
  'chronicle forever': 'assets/addons/chronicle.png',
  foreverjourneyxp: 'assets/addons/foreverjourneyxp.png'
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let addons = [];
function imageFor(name) { return imageMap[name.toLowerCase().trim()] || ''; }
function render() {
  const q = search.value.toLowerCase().trim();
  const filtered = addons.filter(a => `${a.name} ${a.description}`.toLowerCase().includes(q));
  cards.innerHTML = filtered.map(a => {
    const img = imageFor(a.name);
    const cover = img ? `<img class="cover-image" src="${esc(img)}" alt="${esc(a.name)} Banner" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="cover-fallback" hidden>${esc(a.name)}</span>` : `<span class="cover-fallback">${esc(a.name)}</span>`;
    return `<article class="card"><div class="card-cover">${cover}</div><div class="card-content"><h3>${esc(a.name === 'Chronicle' ? 'Chronicle Forever' : a.name)}</h3><p>${esc(a.description)}</p><div class="card-meta">${esc(a.version)} · GitHub Release</div><div class="card-actions"><a class="btn gold-btn" href="${esc(a.download || '#')}" ${a.download ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true"'}>↓ &nbsp; Download</a><a class="btn outline-btn" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Details →</a></div></div></article>`;
  }).join('') || '<p class="empty">Keine passenden Addons gefunden.</p>';
}
async function load() {
  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}/releases?per_page=100`, {headers:{Accept:'application/vnd.github+json'}});
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const releases = await res.json();
    const latest = new Map();
    for (const release of releases) {
      if (release.draft || release.prerelease) continue;
      const tag = release.tag_name || release.name || '';
      const match = tag.match(/^(.+?)[-_ ]v?(\d+\.\d+(?:\.\d+)?(?:[-.][\w.]+)?)$/i);
      const name = (match ? match[1] : release.name || tag).trim();
      if (!name || latest.has(name.toLowerCase())) continue;
      const zip = (release.assets || []).find(asset => asset.name.toLowerCase().endsWith('.zip'));
      const description = (release.body || 'Ein Addon für World of Warcraft Forever.').replace(/[#*`>\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 170);
      latest.set(name.toLowerCase(), {name, version:match ? 'v'+match[2] : tag, description, download:zip?.browser_download_url || '', url:release.html_url});
    }
    addons = [...latest.values()];
    status.textContent = `${addons.length} Addon${addons.length === 1 ? '' : 's'} verfügbar`;
    hint.textContent = addons.length ? 'Downloads und Versionen werden automatisch aus GitHub-Releases geladen.' : 'Noch keine veröffentlichten Releases vorhanden.';
  } catch (err) {
    addons = [];
    status.textContent = 'Verbindung nicht verfügbar';
    hint.textContent = 'GitHub-Releases konnten nicht geladen werden. Bitte später erneut versuchen.';
    console.error(err);
  }
  render();
}
search.addEventListener('input', render);
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('allReleases').href = repo+'/releases';
document.getElementById('githubLink').href = repo;
document.getElementById('supportLink').href = repo+'/issues';
for (const id of ['githubLink','supportLink']) {const el=document.getElementById(id);el.target='_blank';el.rel='noopener noreferrer';}
if (cfg.discordUrl) for (const id of ['discordHero','discordFooter']) {const el=document.getElementById(id);el.href=cfg.discordUrl;el.target='_blank';el.rel='noopener noreferrer';}
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
load();


const cfg = window.AVE_CONFIG;
const cards = document.getElementById('cards');
const status = document.getElementById('status');
const hint = document.getElementById('catalogHint');
const search = document.getElementById('search');

let addons = [];

const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

const repo = `https://github.com/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}`;

// Vorschaubilder der Addons
const addonImages = {
  'chronicle': 'assets/addons/chronicle.png'
};

// Automatische Bildzuordnung
function getAddonImage(name) {
  const key = name.toLowerCase().trim();
  return addonImages[key] || '';
}

const demo = [
  {
    name: 'Dein erstes Addon',
    version: 'Demo',
    description: 'Hier erscheint dein erstes veröffentlichtes GitHub-Release.',
    download: '',
    url: repo + '/releases',
    demo: true
  },
  {
    name: 'Weitere Addons',
    version: 'Demo',
    description: 'Neue Releases werden automatisch eingelesen.',
    download: '',
    url: repo + '/releases',
    demo: true
  }
];

// Addon-Karten anzeigen
function render() {
  const q = search.value.trim().toLowerCase();

  const filtered = addons.filter(a =>
    (a.name + ' ' + a.description).toLowerCase().includes(q)
  );

  cards.innerHTML = filtered.map(a => {
    const image = getAddonImage(a.name);

    const cover = image
      ? `<div class="card-cover">
           <span class="cover-letter">${escapeHTML(a.name[0] || 'A')}</span>
           <img
             class="addon-cover-image"
             src="${escapeHTML(image)}"
             alt="${escapeHTML(a.name)} Vorschaubild"
             loading="lazy"
             onerror="this.remove()"
           >
         </div>`
      : `<div class="card-cover">
           ${escapeHTML(a.name[0] || 'A')}
         </div>`;

    return `
      <article class="card">
        ${cover}

        <div class="card-body">
          <h3>${escapeHTML(a.name)}</h3>

          <p>${escapeHTML(a.description)}</p>

          <div class="card-meta">
            ${escapeHTML(a.version)}
            ${a.demo ? '· Beispiel' : '· GitHub Release'}
          </div>

          <div class="card-actions">
            <a
              class="download"
              href="${escapeHTML(a.download || '#')}"
              ${a.download
                ? 'target="_blank" rel="noopener noreferrer"'
                : 'aria-disabled="true"'}
            >
              ↓ Download
            </a>

            <a
              href="${escapeHTML(a.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Details ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('') || '<p>Keine passenden Addons gefunden.</p>';
}

// GitHub Releases automatisch laden
async function load() {
  try {
    const r = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}/releases?per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      }
    );

    if (!r.ok) throw Error('HTTP ' + r.status);

    const releases = await r.json();
    const latest = new Map();

    for (const release of releases) {
      if (release.draft || release.prerelease) continue;

      const tag = release.tag_name || release.name || '';

      const match = tag.match(
        /^(.+?)[-_ ]v?(\d+\.\d+(?:\.\d+)?(?:[-.][\w.]+)?)$/i
      );

      const name = (
        match ? match[1] : release.name || tag
      ).trim();

      if (!name || latest.has(name.toLowerCase())) continue;

      const asset = release.assets.find(a =>
        a.name.toLowerCase().endsWith('.zip')
      );

      latest.set(name.toLowerCase(), {
        name,
        version: match ? 'v' + match[2] : tag,
        description: (
          release.body ||
          'Addon für World of Warcraft Forever.'
        ).replace(/[#*`>\[\]]/g, '').slice(0, 150),
        download: asset?.browser_download_url || '',
        url: release.html_url
      });
    }

    addons = [...latest.values()];

    status.textContent =
      `${addons.length} Addon${addons.length === 1 ? '' : 's'} verfügbar`;

    hint.textContent = addons.length
      ? 'Downloads werden aus den öffentlichen GitHub-Releases geladen.'
      : 'Noch keine Releases veröffentlicht.';

    if (!addons.length) addons = demo;

  } catch (e) {
    addons = demo;
    status.textContent = 'Demo-Vorschau';
    hint.textContent = 'Keine Verbindung zu öffentlichen Releases.';
  }

  render();
}

// Suche
search.addEventListener('input', render);

// Footer
document.getElementById('year').textContent =
  new Date().getFullYear();

// Links
document.getElementById('releaseLink').href =
  repo + '/releases';

const supportLink = document.getElementById('supportLink');
supportLink.href = repo + '/issues';
supportLink.target = '_blank';
supportLink.rel = 'noopener noreferrer';

// Discord
if (cfg.discordUrl) {
  const a = document.getElementById('discordSide');
  if (a) {
    a.href = cfg.discordUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
}

// Mobiles Menü
const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const navBackdrop = document.getElementById('navBackdrop');

function closeNav() {
  sidebar.classList.remove('open');
  if (navBackdrop) navBackdrop.classList.remove('visible');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));

  if (navBackdrop) {
    navBackdrop.classList.toggle('visible', open);
  }
});

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeNav);
}

document.querySelectorAll('.sidebar nav a').forEach(a => {
  a.addEventListener('click', closeNav);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

// Addons laden
load();

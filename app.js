'use strict';
const cfg=window.AZEROTH_CONFIG||{githubOwner:'AveAddons',addonsRepo:'addons',discordUrl:''};
const repo=`https://github.com/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}`;
const cards=document.getElementById('cards'),status=document.getElementById('status'),search=document.getElementById('search');
const images={chronicle:'assets/addons/chronicle.png',foreverjourneyxp:'assets/addons/foreverjourneyxp.png'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[[^\]]+\]\([^)]*\)/g,'').replace(/[#*`>_]/g,'').replace(/\s+/g,' ').trim();
let addons=[];
function normalized(name){return name.toLowerCase().replace(/[^a-z0-9]/g,'');}
function addonKey(name){const n=normalized(name);if(n==='chronicle'||n==='chronicleforever')return 'chronicle';if(n==='foreverjourneyxp')return 'foreverjourneyxp';return n;}
function displayName(name){return addonKey(name)==='chronicle'?'Chronicle Forever':name;}
function getImage(name){const key=normalized(name);return images[key]||(key.startsWith('chronicle')?images.chronicle:key.startsWith('foreverjourneyxp')?images.foreverjourneyxp:'');}
function parseRelease(r){
 const tag=r.tag_name||'';const title=r.name||tag;
 const m=tag.match(/^(.+?)[-_ ]v?(\d+\.\d+(?:\.\d+)?(?:[-.][\w.]+)?)$/i);
 let name=(m?m[1]:title.replace(/\s+v?\d+\.\d+(?:\.\d+)?(?:[-.][\w.]+)?$/i,'')).trim();
 name=name.replace(/[-_]+/g,' ').trim();
 if(!name)name=title||'Addon';
 const asset=(r.assets||[]).find(a=>a.name.toLowerCase().endsWith('.zip'));
 return {name,version:m?'v'+m[2]:(title.match(/v?\d+\.\d+(?:\.\d+)?/i)?.[0]||tag||'Release'),description:clean(r.body).slice(0,190)||'Addon für World of Warcraft Forever.',download:asset?.browser_download_url||'',url:r.html_url||repo+'/releases',date:r.published_at||r.created_at||''};
}
function render(){const q=search.value.toLowerCase().trim();const visible=addons.filter(a=>(a.name+' '+a.description).toLowerCase().includes(q));cards.innerHTML=visible.map(a=>{const img=getImage(a.name);return `<article class="card"><div class="card-image">${img?`<img src="${esc(img)}" alt="${esc(a.name)} Banner" loading="lazy" onerror="this.replaceWith(document.createTextNode('${esc(a.name[0]||'A')}'))">`:`<span class="card-placeholder">${esc(a.name[0]||'A')}</span>`}</div><div class="card-body"><h3>${esc(a.name)} <span class="version">${esc(a.version)}</span></h3><p>${esc(a.description)}</p><div class="card-info"><span>✦ World of Warcraft Forever</span><span>GitHub Release</span></div><div class="card-actions"><a class="download ${a.download?'':'disabled'}" href="${esc(a.download||'#')}" ${a.download?'target="_blank" rel="noopener noreferrer"':'aria-disabled="true"'}>↓ Download</a><a class="details" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Details ↗</a></div></div></article>`}).join('')||'<p class="empty">Keine passenden Addons gefunden.</p>'}
async function load(){try{const r=await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.addonsRepo)}/releases?per_page=100`,{headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('HTTP '+r.status);const releases=(await r.json()).filter(r=>!r.draft&&!r.prerelease).sort((a,b)=>new Date(b.published_at||b.created_at)-new Date(a.published_at||a.created_at));const map=new Map();for(const r of releases){const a=parseRelease(r);const key=addonKey(a.name);if(!map.has(key))map.set(key,{...a,name:displayName(a.name)})}addons=[...map.values()];status.textContent=`${addons.length} Addon${addons.length===1?'':'s'} verfügbar`;if(!addons.length)cards.innerHTML='<p class="empty">Noch keine veröffentlichten Releases vorhanden.</p>';else render()}catch(e){status.textContent='Releases momentan nicht erreichbar';cards.innerHTML='<p class="empty">Bitte versuche es später erneut oder öffne die GitHub-Releases.</p>';console.error('GitHub Releases:',e)}}
search.addEventListener('input',render);document.getElementById('releasesLink').href=repo+'/releases';document.getElementById('year').textContent=new Date().getFullYear();if(cfg.discordUrl){['discordTop','discordHero','discordBottom'].forEach(id=>{const el=document.getElementById(id);el.href=cfg.discordUrl;el.target='_blank';el.rel='noopener noreferrer'})}
const menu=document.getElementById('menu'),nav=document.getElementById('navigation');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));load();

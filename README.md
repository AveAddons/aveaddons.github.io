# AveAddons · World of Warcraft Forever

Statische, responsive Addon-Website für GitHub Pages. Keine Build-Tools erforderlich.

## Schnellstart

1. GitHub-Organisation `AveAddons` anlegen (falls verfügbar).
2. Repository `AveAddons.github.io` anlegen und den **Inhalt dieses Ordners** in dessen Hauptverzeichnis hochladen.
3. Repository `addons` unter derselben Organisation anlegen und **öffentlich** stellen.
4. In `config.js` `githubOwner`, `addonsRepo` und optional `discordUrl` anpassen.
5. In den Einstellungen des Website-Repositories unter **Pages → Build and deployment → Deploy from a branch** den Branch `main` und `/ (root)` auswählen.
6. Die Website ist nach der Bereitstellung unter `https://aveaddons.github.io` erreichbar, falls der Organisationsname `AveAddons` ist.

## Addons automatisch veröffentlichen

Im `addons`-Repository unter **Releases → Draft a new release** ein Release mit Tag `BagBrother-v1.0.0` erstellen und eine ZIP-Datei `BagBrother-v1.0.0.zip` als Asset anhängen. Der Beschreibungstext des Releases erscheint in der Addon-Karte. Für jedes Addon zeigt die Website das neueste veröffentlichte, nicht als Prerelease markierte Release an. Die GitHub API ist öffentlich, aber hat ohne Authentifizierung Rate Limits; nach Veröffentlichung kann die Anzeige verzögert sein. Die Website zeigt nur die ersten 100 Releases des Repositories an.

**Wichtig:** Die Demo-Karten sind Platzhalter und bieten keine echten Downloads. Logo-Grafik ist unter `assets/aveaddons-logo.png` abgelegt und kann bei Bedarf eingebunden werden. Die aktuelle Kopfzeile verwendet ein leichtgewichtiges typografisches A-Signet.

## Struktur

- `index.html`: Startseite und Addon-Katalog
- `styles.css`: responsives Dark/Gold-Design
- `app.js`: Releases laden, suchen und anzeigen
- `config.js`: GitHub-/Discord-Konfiguration
- `docs.html`: Installationsanleitung
- `assets/aveaddons-logo.png`: ausgewähltes AveAddons-Logo

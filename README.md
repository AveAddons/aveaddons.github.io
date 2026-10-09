# AveAddons – Website v2

Website für World of Warcraft Forever. Statisches Hosting über GitHub Pages.

## Upload auf GitHub (wichtig)

Alle Dateien **aus dem ZIP direkt in das Hauptverzeichnis** von `AveAddons/aveaddons.github.io` hochladen (nicht den übergeordneten Ordner). Vorhandene Dateien überschreiben. Die Ordnerstruktur `assets/aveaddons-logo.png` muss erhalten bleiben.

Benötigte Dateien: `index.html`, `docs.html`, `styles.css`, `app.js`, `config.js`, `README.md`, `assets/aveaddons-logo.png`.

## Automatische Addons

In `config.js` stehen Organisation `AveAddons` und Repository `addons`. Erst ein **öffentliches** Repository `AveAddons/addons` anlegen. Danach für jedes Addon ein GitHub Release mit Tag `AddonName-v1.2.3` erstellen und eine ZIP-Datei als Release Asset anhängen. Die Website liest Releases beim Aufruf über die öffentliche GitHub-API. Ohne Releases werden Demo-Karten angezeigt.

Discord-Link in `config.js` ergänzen.

## Hinweis

Dies ist eine eigenständige Community-Seite, kein offizielles Blizzard-Angebot. Alle Beispieldaten sind Platzhalter.

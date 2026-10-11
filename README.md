# AzerothForge Website

Statische GitHub-Pages-Website für `AveAddons/addons` Releases.

## Auf GitHub Pages veröffentlichen
1. Die Dateien und den Ordner `assets` in den Stamm des Repositories `AveAddons/aveaddons.github.io` hochladen. **Nicht** den äußeren ZIP-Ordner hochladen.
2. Vorhandene Dateien `index.html`, `styles.css`, `app.js`, `config.js` ersetzen.
3. Die bestehende `docs.html` im Repository behalten, falls du sie weiterhin nutzen möchtest.
4. Unter `https://aveaddons.github.io/` prüfen. GitHub Pages braucht manchmal wenige Minuten.

Die beiden Beispielbanner liegen unter `assets/addons/`. Du kannst sie später mit deinen eigenen Dateien `chronicle.png` und `foreverjourneyxp.png` überschreiben.

## Discord
In `config.js` den Wert `discordUrl` auf deinen Einladungslink setzen. Solange leer, führt Discord zur Support-Sektion.

## Releases
Es werden veröffentlichte, nicht als Pre-Release markierte GitHub-Releases automatisch angezeigt. Der Download-Button nutzt die erste ZIP-Datei in den Release-Assets.

Die öffentliche Website heißt AzerothForge. GitHub-Organisation und bestehende Repository-URLs bleiben unverändert.

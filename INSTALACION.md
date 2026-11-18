# App Mantenimiento CDLP — instalación

La app se instala en el celular como una app normal. Funciona sin internet: todo (textos y fotos) se guarda primero en el teléfono, y apenas hay señal se sube solo a tu Google Drive. La Torre de Control importa esos registros cada vez que la abres.

```
Celular (app, sin conexión)  ──con señal──▶  Google Drive "CDLP App Sync"  ──al abrir la Torre──▶  Torre de Control
```

## Paso 1 · Servicio de sincronización en Google (5 min, una sola vez)
1. Entra a https://script.google.com con la **misma cuenta de Google que tienes conectada en Claude** → **Nuevo proyecto**.
2. Borra el contenido, pega todo el archivo `Code.gs` y guarda (nombre sugerido: *Sync App CDLP*).
3. **Implementar → Nueva implementación** → engranaje → **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. **Implementar**, autoriza el acceso a Drive (si aparece "Google no verificó esta app": *Configuración avanzada → Ir a Sync App CDLP*).
5. Copia la **URL de la aplicación web** (termina en `/exec`).

## Paso 2 · Publicar la app (5 min, una sola vez) — GitHub Pages, gratis
1. Crea una cuenta en https://github.com (gratis).
2. Botón **+ → New repository** → nombre `app-cdlp` → **Public** → *Create repository*.
3. Clic en **uploading an existing file** y arrastra estos 5 archivos: `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png` → **Commit changes**.
4. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → **Save**.
5. Al minuto la app queda en `https://TU-USUARIO.github.io/app-cdlp/`.

## Paso 3 · Enlace para los técnicos
Arma este enlace (o pídeselo a Claude con las dos direcciones):

```
https://TU-USUARIO.github.io/app-cdlp/?u=URL_DEL_PASO_1&k=gArCe4ymy-9mvdLdJhKSxStv
```

Cada técnico lo abre **en Chrome (Android) o Safari (iPhone)**, una vez y con internet:
- Android: aparece "📲 Instalar la app" (o menú ⋮ → *Instalar app / Agregar a pantalla de inicio*).
- iPhone: botón Compartir → *Agregar a pantalla de inicio*.
Desde ahí se abre con el ícono **Mant. CDLP**, con o sin señal.

## Paso 4 · Torre de Control
- Mantén **Google Drive conectado** en Claude (Configuración → Conectores).
- Al abrir la Torre verás abajo a la derecha **📲 App celular: sincronizada HH:MM**. Tócalo para sincronizar al momento.
- La Torre crea/actualiza las tareas de CDLP, guarda las fotos, descuenta materiales de bodega al cerrar, genera la OT en PDF y envía el libro maestro (con stock) a la app.

## Uso sin conexión
- La barra de color arriba indica: **📴 Sin conexión** · **⏳ N pendientes de subir** · **☁ Todo sincronizado**.
- Cada foto se guarda en el teléfono en el mismo momento (ícono 📱; cambia a ☁ al subir).
- La cámara se abre dentro de la app, así que no se pierde nada al tomar fotos.
- No borres los datos del navegador ni desinstales la app mientras haya pendientes de subir.

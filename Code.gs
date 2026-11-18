/**
 * Sincronización App Técnico CDLP  →  Google Drive  →  Torre de Control M&I Komatsu
 *
 * Recibe desde la app instalada en el celular los registros (tareas) y las fotos,
 * y los guarda en tu Google Drive, carpeta "CDLP App Sync":
 *   CDLP App Sync/records/<id>.json   (una tarea por archivo, se sobrescribe al avanzar)
 *   CDLP App Sync/photos/<id>.jpg     (cada foto una sola vez)
 *   CDLP App Sync/libro_*.json        (libro maestro que exporta la Torre; la app lo descarga)
 * La Torre lee esa carpeta con tu conector de Google Drive e importa todo.
 *
 * INSTALACIÓN (una sola vez):
 * 1. Entra a https://script.google.com con la cuenta de Google conectada a Claude → "Nuevo proyecto".
 * 2. Borra lo que aparece, pega TODO este archivo y guarda (nombre: "Sync App CDLP").
 * 3. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo      ·      Quién tiene acceso: Cualquier usuario
 * 4. Autoriza el acceso a Drive cuando lo pida y copia la "URL de la aplicación web".
 */

var TOKEN = 'gArCe4ymy-9mvdLdJhKSxStv';   // código de enlace: el mismo que va en el enlace de la app
var ROOT_NAME = 'CDLP App Sync';

function folder_(parent, name) {
  var it = parent ? parent.getFoldersByName(name) : DriveApp.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent ? parent.createFolder(name) : DriveApp.createFolder(name);
}
function root_() { return folder_(null, ROOT_NAME); }
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function safe_(s) { return String(s || '').replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 80); }

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.token !== TOKEN) return out_({ ok: false, error: 'token' });
  if (p.action === 'ping') return out_({ ok: true, at: new Date().toISOString() });
  if (p.action === 'libro') {
    var root = root_(), files = root.getFiles(), best = null;
    while (files.hasNext()) {
      var f = files.next();
      if (/^libro_.*\.json$/.test(f.getName()) && (!best || f.getDateCreated() > best.getDateCreated())) best = f;
    }
    if (!best) return out_({ ok: true, libro: null });
    // limpia exportaciones antiguas
    var again = root.getFiles();
    while (again.hasNext()) { var g = again.next(); if (/^libro_.*\.json$/.test(g.getName()) && g.getId() !== best.getId()) g.setTrashed(true); }
    return out_({ ok: true, libro: JSON.parse(best.getBlob().getDataAsString('UTF-8')) });
  }
  return out_({ ok: false, error: 'action' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) return out_({ ok: false, error: 'token' });
    lock.waitLock(20000);
    var root = root_();

    if (body.action === 'photo') {
      var pf = folder_(root, 'photos'), name = safe_(body.id) + '.jpg';
      var ex = pf.getFilesByName(name);
      if (ex.hasNext()) return out_({ ok: true, fileId: ex.next().getId(), existed: true });
      var blob = Utilities.newBlob(Utilities.base64Decode(body.data), body.mime || 'image/jpeg', name);
      var file = pf.createFile(blob);
      file.setDescription(JSON.stringify({ recordId: body.recordId || '', takenAt: body.takenAt || '', by: body.by || '' }));
      return out_({ ok: true, fileId: file.getId() });
    }

    if (body.action === 'record') {
      var rf = folder_(root, 'records'), rec = body.record || {}, rname = safe_(rec.id) + '.json';
      if (!safe_(rec.id)) return out_({ ok: false, error: 'id' });
      rec.syncedAt = new Date().toISOString();
      var text = JSON.stringify(rec);
      var it = rf.getFilesByName(rname);
      if (it.hasNext()) { it.next().setContent(text); }
      else { rf.createFile(rname, text, 'application/json'); }
      return out_({ ok: true, syncedAt: rec.syncedAt });
    }

    return out_({ ok: false, error: 'action' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

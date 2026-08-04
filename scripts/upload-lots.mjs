#!/usr/bin/env node
/**
 * Sube las imágenes recortadas de lotes (desde el Canva) a Cloudinary
 * reutilizando el mismo preset UNSIGNED que ya usa el widget del admin
 * (VITE_CLOUDINARY_UPLOAD_PRESET). No requiere credenciales secretas:
 * el preset unsigned es público por diseño.
 *
 * Uso:
 *   npm run upload:lots                  → sube todo lo que haya en ./canva-lotes
 *   npm run upload:lots -- mi-carpeta    → sube desde otra carpeta
 *
 * Antes de correr:
 *   1. Exporta cada lote del Canva como PNG/JPG (ideal: recorte por lote).
 *   2. Nómbralos de forma que se identifique el lote (ej. lote-01.png,
 *      lote-02.png ...) — el nombre se guarda en el JSON de salida.
 *   3. Déjalos en la carpeta ./canva-lotes (gitignoreada).
 *
 * Salida:
 *   - Imprime el resumen en consola.
 *   - Escribe ./canva-lotes/urls.json con el mapeo archivo → secure_url.
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, resolve, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

/**
 * Lee las variables VITE_* desde .env o .env.local del proyecto.
 * Vite no las carga en scripts Node, así que las parseamos manualmente,
 * con fallback a process.env (por si alguien las exporta en su shell).
 */
function readCloudinaryConfig() {
  // Precedencia (igual que Vite/dotenv): shell > .env.local > .env
  const env = {};

  // .env primero, luego .env.local → el último en asignar gana
  for (const envFileName of [".env", ".env.local"]) {
    const envPath = join(PROJECT_ROOT, envFileName);
    try {
      const content = readFileSync(envPath, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    } catch {
      /* archivo no presente → continuar con el siguiente */
    }
  }

  // El shell manda sobre los archivos
  for (const key of ["VITE_CLOUDINARY_CLOUD_NAME", "VITE_CLOUDINARY_UPLOAD_PRESET"]) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }

  return {
    cloudName: env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: env.VITE_CLOUDINARY_UPLOAD_PRESET,
  };
}

const { cloudName, uploadPreset } = readCloudinaryConfig();

if (!cloudName || !uploadPreset) {
  console.error(
    "❌ Faltan variables de entorno. Verifica que .env tenga:\n" +
      "   VITE_CLOUDINARY_CLOUD_NAME=...\n" +
      "   VITE_CLOUDINARY_UPLOAD_PRESET=..."
  );
  process.exit(1);
}

/** Carpeta de entrada: argumento opcional, por defecto ./canva-lotes */
const inputDirArg = process.argv[2];
const inputDir = inputDirArg
  ? resolve(process.cwd(), inputDirArg)
  : join(PROJECT_ROOT, "canva-lotes");

async function listImages(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  const files = [];
  for (const name of entries) {
    const full = join(dir, name);
    const info = await stat(full);
    if (info.isFile() && IMAGE_EXTENSIONS.has(extname(name).toLowerCase())) {
      files.push({ name, full });
    }
  }
  return files.sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));
}

async function uploadFile({ name, full }) {
  const buffer = await readFile(full);
  const blob = new Blob([buffer]);

  const form = new FormData();
  form.append("file", blob, name);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  return {
    file: name,
    public_id: json.public_id,
    secure_url: json.secure_url,
    width: json.width,
    height: json.height,
  };
}

async function main() {
  console.log("☁️  Subiendo imágenes de lotes a Cloudinary…\n");
  console.log(`   Cloud:   ${cloudName}`);
  console.log(`   Preset:  ${uploadPreset}`);
  console.log(`   Carpeta: ${inputDir}\n`);

  const files = await listImages(inputDir);
  if (files.length === 0) {
    console.error(
      "❌ No se encontraron imágenes en la carpeta. Pasos:\n" +
        "   1. Exporta cada lote desde el Canva (PNG o JPG).\n" +
        "   2. Nómbralos para identificar el lote (ej. lote-01.png).\n" +
        `   3. Colócalos en: ${inputDir}\n` +
        "   4. Vuelve a correr: npm run upload:lots"
    );
    process.exit(1);
  }

  console.log(`   Archivos encontrados (${files.length}):`);
  for (const f of files) console.log(`     • ${f.name}`);
  console.log("");

  const uploaded = [];
  const failed = [];

  for (const file of files) {
    process.stdout.write(`   Subiendo ${file.name}… `);
    try {
      uploaded.push(await uploadFile(file));
      console.log("✅");
    } catch (err) {
      failed.push({ file: file.name, error: err.message });
      console.log("❌");
    }
  }

  // Escribir JSON de resultados dentro de la carpeta gitignoreada
  const outPath = join(inputDir, "urls.json");
  await mkdir(inputDir, { recursive: true });
  await writeFile(
    outPath,
    JSON.stringify({ uploaded, failed, generatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );

  console.log("\n──────────────────────────────────────────────");
  console.log(`   ✅ Subidas: ${uploaded.length}   ❌ Fallidas: ${failed.length}`);
  console.log(`   Resultado: ${outPath}`);
  console.log("──────────────────────────────────────────────\n");

  if (uploaded.length > 0) {
    console.log("   URLs (mapeo archivo → secure_url):");
    for (const u of uploaded) {
      console.log(`     ${u.file}  →  ${u.secure_url}`);
    }
  }

  if (failed.length > 0) {
    console.error("\n   Fallos:");
    for (const f of failed) console.error(`     ${f.file}: ${f.error}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("❌ Error inesperado:", err);
  process.exit(1);
});

#!/bin/bash
# Script para migrar todas las imágenes del proyecto a Cloudinary
# Cloud Name: j5a9xyaq
# Upload Preset: la_holanda_upload
# API: https://api.cloudinary.com/v1_1/j5a9xyaq/image/upload

CLOUD_NAME="j5a9xyaq"
UPLOAD_PRESET="la_holanda_upload"
API_URL="https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload"
BASE_DIR="/c/Users/jucar/OneDrive/Documentos/Proyectos Pasantia/Lotes/RepositorioCodigo/lotes-quindio"

# Archivo donde guardaremos el mapeo
MAPPING_FILE="${BASE_DIR}/scripts/cloudinary-mapping.txt"
> "$MAPPING_FILE"

# Función para normalizar nombre de archivo (quitar espacios, caracteres especiales)
normalize_name() {
  echo "$1" | sed 's/ /_/g' | sed 's/[^a-zA-Z0-9._-]/_/g'
}

upload_file() {
  local filepath="$1"
  local folder="$2"
  local filename="$3"
  
  echo "Subiendo: $filename (folder: $folder)..."
  
  local public_id="laholanda/${folder}/$(echo "$filename" | sed 's/\.[^.]*$//')"
  
  response=$(curl -s -X POST "$API_URL" \
    -F "file=@${filepath}" \
    -F "upload_preset=${UPLOAD_PRESET}" \
    -F "public_id=${public_id}" 2>&1)
  
  # Extraer secure_url del JSON de respuesta
  secure_url=$(echo "$response" | grep -o '"secure_url":"[^"]*"' | head -1 | sed 's/"secure_url":"//' | sed 's/"//')
  
  if [ -n "$secure_url" ]; then
    echo "  ✅ $secure_url" 
    echo "${folder}/${filename}|${secure_url}" >> "$MAPPING_FILE"
  else
    echo "  ❌ Error subiendo $filename"
    echo "  Respuesta: $response" | head -c 200
    echo ""
  fi
}

echo "=== Migrando imágenes de lots/ ==="
for filepath in "${BASE_DIR}/public/lots/"*; do
  filename=$(basename "$filepath")
  if [ -f "$filepath" ]; then
    upload_file "$filepath" "lots" "$filename"
  fi
done

echo ""
echo "=== Migrando imágenes de landscapes/ ==="
for filepath in "${BASE_DIR}/public/landscapes/"*; do
  filename=$(basename "$filepath")
  if [ -f "$filepath" ]; then
    upload_file "$filepath" "landscapes" "$filename"
  fi
done

echo ""
echo "=== Migrando imágenes de Events/ ==="
for filepath in "${BASE_DIR}/src/assets/Events/"*; do
  filename=$(basename "$filepath")
  if [ -f "$filepath" ]; then
    upload_file "$filepath" "events" "$filename"
  fi
done

echo ""
echo "=== Migrando isotipo (logo) ==="
upload_file "${BASE_DIR}/public/laHolandaIsotipo.png" "brand" "laHolandaIsotipo.png"

echo ""
echo "=== SUBIDA COMPLETADA ==="
echo "Mapeo guardado en: $MAPPING_FILE"
echo ""
echo "Resumen:"
wc -l < "$MAPPING_FILE" | tr -d ' ' | xargs -I {} echo "{} imágenes subidas exitosamente"
echo ""
cat "$MAPPING_FILE"

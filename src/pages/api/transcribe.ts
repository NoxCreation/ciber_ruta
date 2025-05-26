import type { NextApiRequest, NextApiResponse } from "next/types"
import formidable from "formidable"
import fs from "fs"
import axios from "axios"

// URL del servidor FastAPI
const TRANSCRIPTION_SERVICE_URL = "http://194.163.45.115:2520/transcribe"

// Configuración para deshabilitar el bodyParser predeterminado
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar que sea una solicitud POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  try {
    // Parsear el formulario multipart/form-data
    const form = formidable({})

    const [fields, files] = await form.parse(req)
    console.log("fields", fields)

    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: "No se proporcionó archivo de audio" })
    }

    console.log(`Archivo recibido: ${file.originalFilename}, tamaño: ${file.size} bytes, tipo: ${file.mimetype}`)

    // Verificar que el archivo tenga contenido
    if (file.size === 0) {
      return res.status(400).json({ error: "El archivo de audio está vacío" })
    }

    // Leer el archivo completo en memoria
    const fileBuffer = fs.readFileSync(file.filepath)
    console.log(`Archivo leído en memoria: ${fileBuffer.length} bytes`)

    // Usar axios para enviar el archivo directamente
    const formData = new FormData()

    // Crear un Blob desde el buffer
    const blob = new Blob([fileBuffer], { type: "audio/wav" })

    // Añadir el archivo al FormData
    formData.append("file", blob, "audio.wav")

    // Enviar el FormData al servidor FastAPI usando axios
    console.log("Enviando audio al servidor de transcripción...")
    const response = await axios.post(TRANSCRIPTION_SERVICE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "text",
    })

    console.log("Transcripción recibida:", response.data || "[vacío]")

    // Devolver la transcripción
    res.setHeader("Content-Type", "text/plain")
    return res.status(200).send(response.data)
  } catch (error) {
    console.error("Error en la transcripción:", error)
    return res.status(500).json({
      error: "Error al procesar la transcripción",
      details: (error as any).message,
    })
  }
}

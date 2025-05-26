"use client"

import { useState, useRef, useEffect } from "react"
import { IconButton, Stack, Text } from "@chakra-ui/react"
import { FiMic, FiSquare } from "react-icons/fi"

// Esta función convierte cualquier AudioBuffer a un WAV con el formato exacto que Vosk necesita
function audioBufferToWav(buffer: AudioBuffer): Blob {
    // Asegurarse de que el audio sea mono (promediando canales si es necesario)
    let monoData: Float32Array
    if (buffer.numberOfChannels === 1) {
        monoData = buffer.getChannelData(0)
    } else {
        // Promedio de todos los canales a mono
        monoData = new Float32Array(buffer.length)
        for (let i = 0; i < buffer.length; i++) {
            let sum = 0
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                sum += buffer.getChannelData(channel)[i]
            }
            monoData[i] = sum / buffer.numberOfChannels
        }
    }

    // Convertir floats a 16-bit PCM
    const numSamples = monoData.length
    const dataLength = numSamples * 2 // 2 bytes por muestra (16-bit)
    const buffer16 = new ArrayBuffer(44 + dataLength) // 44 bytes para el encabezado WAV
    const view = new DataView(buffer16)
    const sampleRate = 16000 // Forzar 16 kHz

    // Escribir el encabezado WAV
    // RIFF chunk descriptor
    writeString(view, 0, "RIFF")
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, "WAVE")

    // fmt sub-chunk
    writeString(view, 12, "fmt ")
    view.setUint32(16, 16, true) // tamaño del subchunk (16 para PCM)
    view.setUint16(20, 1, true) // formato de audio (1 es PCM)
    view.setUint16(22, 1, true) // mono
    view.setUint32(24, sampleRate, true) // frecuencia de muestreo
    view.setUint32(28, sampleRate * 2, true) // byte rate (16kHz * 2 bytes)
    view.setUint16(32, 2, true) // block align (canales * bytes por muestra)
    view.setUint16(34, 16, true) // bits por muestra

    // data sub-chunk
    writeString(view, 36, "data")
    view.setUint32(40, dataLength, true)

    // Escribir los datos de audio (convertir float32 a int16)
    let offset = 44
    for (let i = 0; i < numSamples; i++) {
        // Convertir de -1.0,1.0 a -32768,32767
        const sample = Math.max(-1, Math.min(1, monoData[i]))
        const sample16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(offset, sample16, true)
        offset += 2
    }

    return new Blob([buffer16], { type: "audio/wav" })

    function writeString(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i))
        }
    }
}

// Esta función recibe un blob de audio y lo convierte al formato que necesita Vosk
async function convertAudioToVoskFormat(audioBlob: Blob): Promise<Blob> {
    // Crear un AudioContext (solo se puede crear en respuesta a una interacción del usuario)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
    // Convertir el blob a ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer()
    // Decodificar el audio
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    // Convertir el AudioBuffer a WAV con el formato correcto para Vosk
    const wavBlob = audioBufferToWav(audioBuffer)
    // Cerrar el AudioContext para liberar recursos
    audioContext.close()
    return wavBlob
}

export default function AudioRecorder({
    onRecording,
    onTranscribing,
    setTimer,
    transcriptCallback
}: {
    onRecording?: (state: boolean) => void
    onTranscribing?: (state: boolean) => void
    setTimer?: (value: number) => void
    transcriptCallback: (text: string) => void
}) {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Actualizar el temporizador de grabación
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1)
                if (setTimer) setTimer(recordingTime + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            setRecordingTime(0)
            if (setTimer) setTimer(0)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isRecording])

    const startRecording = async () => {
        try {
            // Limpiar cualquier grabación anterior
            audioChunksRef.current = []
            //transcriptCallback("")

            // Solicitar acceso al micrófono
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            })

            // Opciones para el MediaRecorder - usar audio/webm para mayor compatibilidad
            const options = { mimeType: "audio/webm" }

            // Crear un nuevo MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, options)

            // Guardar los chunks de audio cuando estén disponibles
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            // Iniciar la grabación
            mediaRecorder.start(100) // Capturar en chunks de 100ms
            mediaRecorderRef.current = mediaRecorder
            setIsRecording(true)
            if (onRecording) onRecording(true)
        } catch (error) {
            console.error("Error al iniciar la grabación:", error)
            //("No se pudo acceder al micrófono. Por favor, verifica los permisos.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Detener la grabación
            mediaRecorderRef.current.stop()

            // Detener todas las pistas de audio
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

            setIsRecording(false)
            if (onRecording) onRecording(false)

            // Procesar el audio cuando la grabación se detenga
            mediaRecorderRef.current.onstop = async () => {
                await sendAudioForTranscription()
            }
        }
    }

    const sendAudioForTranscription = async () => {
        if (audioChunksRef.current.length === 0) return

        try {
            if (onTranscribing) onTranscribing(true)

            // Crear un blob con todos los chunks de audio
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
            console.log(`Blob de audio original: ${audioBlob.size} bytes`)

            // Convertir el audio al formato que Vosk necesita
            const wavBlob = await convertAudioToVoskFormat(audioBlob)
            console.log(`Blob de audio WAV convertido: ${wavBlob.size} bytes`)

            // Crear un FormData y añadir el blob como un archivo
            const formData = new FormData()
            formData.append("file", wavBlob, "audio.wav")

            // Enviar el audio al endpoint de Next.js
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Error de respuesta:", errorText)
                //throw new Error(`Error en la transcripción: ${response.status} ${response.statusText}`)
                return
            }

            // Leer la respuesta como texto
            const transcriptionText = await response.text()

            if (!transcriptionText.trim()) {
                transcriptCallback(
                    "No se detectó ningún texto en el audio. Por favor, intenta hablar más claramente o más cerca del micrófono.",
                )
            } else {
                transcriptCallback(transcriptionText)
            }
        } catch (error) {
            console.error("Error al transcribir el audio:", error)
            transcriptCallback(`Error al transcribir el audio: ${(error as Error).message}`)
        } finally {
            if (onTranscribing) onTranscribing(false)
        }
    }

    // Formatear el tiempo de grabación
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Calcular el porcentaje de tiempo restante para completar 1 minuto
    const calculateRemainingPercentage = (seconds: number): number => {
        // Definir el tiempo máximo (1 minuto = 60 segundos)
        const maxTime = 60

        // Si ya pasó el tiempo máximo, devolver 0%
        if (seconds >= maxTime) {
            return 0
        }

        // Calcular el porcentaje de tiempo transcurrido
        const elapsedPercentage = (seconds / maxTime) * 100

        // Calcular el porcentaje restante
        const remainingPercentage = 100 - elapsedPercentage

        // Devolver el porcentaje restante redondeado a 2 decimales
        return Math.round(remainingPercentage * 100) / 100
    }

    useEffect(() => {
        if (100 - calculateRemainingPercentage(recordingTime) >= 100) {
            stopRecording()
        }
    }, [recordingTime])

    return (
        <Stack alignItems={'center'} w={'fit-content'} gap={1} position={'relative'}>
            <IconButton zIndex={1} className={isRecording ? "pulse" : ''} aria-label="Call support" rounded="full"
                colorPalette={'blue'} variant={'surface'} size={'lg'}
                onClick={!isRecording ? startRecording : stopRecording}
            >
                {!isRecording && <FiMic />}
                {isRecording && <FiSquare />}
            </IconButton>
            {isRecording && <Text fontSize={'14px'} color={'gray.600'}>
                {formatTime(recordingTime)}
            </Text>}
        </Stack>
    )
}

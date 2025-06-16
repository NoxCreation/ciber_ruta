/*
    MIGRA A LA BD LOS CAMBIOS NUEVOS HECHOS 
*/


import { syncDatabase, testConnection } from "@/utils/engine"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    try {
        // Prueba la conexión
        const isConnected = await testConnection()
        if (!isConnected) {
            return res.status(500).json({ error: "No se pudo conectar a la base de datos" })
        }

        // Sincroniza la base de datos
        const isSynced = await syncDatabase()
        if (!isSynced) {
            return res.status(500).json({ error: "Error al sincronizar la base de datos" })
        }

        return res.status(200).json({ message: "Base de datos inicializada correctamente" })
    } catch (error) {
        console.error("Error:", error)
        return res.status(500).json({ error: "Error interno del servidor" })
    }
}
/*
    ESTE PROVIDER MANTIENE LA CONECCION SOCKET ESCUCHANDO LOS CAMBIOS QUE N8N HAGA EN LA BD PARA
    MODIFICAR LA INTERFAZ
*/

import useConectWS from "@/hooks/useConectWS";
import useViewChange from "@/hooks/useViewChange";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef } from "react";

export const ChangeDetected = ({
    children
}: {
    children: ReactNode
}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session } = useSession();
    const userId = session ? session?.user.id : "";
    const { setStateConection, setDataInterface } = useConectWS()

    const connectWebSocket = () => {
        // Cerrar cualquier conexión existente
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Limpiar cualquier intento de reconexión previo
        if (reconnectRef.current) {
            clearTimeout(reconnectRef.current);
            reconnectRef.current = null;
        }

        const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Conexión WebSocket establecida");
            setStateConection(true)
            if (userId) {
                ws.send(JSON.stringify({
                    action: 'subscribe',
                    channel: 'changes_users',
                    resource_id: userId
                }));
            }
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const body = JSON.parse(message.data.interface)
            const viewId  = body.viewId
            useViewChange.getState().setView(viewId)
            setDataInterface(body.data)
        };

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };

        ws.onclose = (event) => {
            console.log(`WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`);
            setStateConection(false)

            // Programar reconexión después de 2 segundos
            if (userId) {
                reconnectRef.current = setTimeout(() => {
                    console.log("Intentando reconectar...");
                    connectWebSocket();
                }, 2000);
            }
        };
    };

    useEffect(() => {
        if (userId) {
            connectWebSocket();
        }

        return () => {
            // Limpiar al desmontar el componente
            if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                    action: 'unsubscribe',
                    channel: 'changes_users',
                    resource_id: userId
                }));
                wsRef.current.close();
                wsRef.current = null;
            }

            if (reconnectRef.current) {
                clearTimeout(reconnectRef.current);
                reconnectRef.current = null;
            }
        };
    }, [userId]);

    return (
        <>{children}</>
    )
}
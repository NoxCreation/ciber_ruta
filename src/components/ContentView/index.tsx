import { ReactNode, useEffect, useRef } from "react";
import {
    Box,
} from "@chakra-ui/react";
import { OverlayGradient } from "../OverlayGradient";
import { ChatMessage } from "@/types/ChatMessage";

export const ContentView = ({
    chat,
    topGradientPercent = 20,
    bottomGradientPercent = 20,
    children
}: {
    chat?: Array<ChatMessage>
    topGradientPercent?: number
    bottomGradientPercent?: number
    children: ReactNode
}) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Desplazamiento automático a la parte inferior cuando llegan nuevos mensajes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    return (
        <Box
            flex={1}
            position="relative"
            overflow="hidden"
            h={'100%'}
        >
            <OverlayGradient
                color="#f4f4f5"
                position={'absolute'}
                top={0}
                left={0}
                right={0}
                gradient="top-bottom"
                height={`${topGradientPercent}%`}
            />

            {/* Contenedor de mensajes con scroll */}
            <Box
                ref={chatContainerRef}
                p={4}
                height="100%"
                overflowY="auto"
                css={{
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none'
                }}
            >
                {children}
            </Box>

            <OverlayGradient
                color="#f4f4f5"
                position={'absolute'}
                bottom={0}
                left={0}
                right={0}
                gradient="bottom-top"
                height={`${bottomGradientPercent}%`}
            />
        </Box>
    )
}
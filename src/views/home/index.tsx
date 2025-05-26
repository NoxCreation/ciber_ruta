import useChat from "@/hooks/useChat";
import useConversationAgent from "@/hooks/useConversationAgent";
import { ChatItem } from "@/components/ChatItem";
import { ContentView } from "@/components/ContentView"
import WaveCircleVisualizer from "@/components/WaveCircleVisualizer";
import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { Fragment, useEffect } from "react";

export const ViewHome = () => {
    const { chat, setChat } = useChat();
    const {
        transcribing,
        currentAudio,
        isRecording,
        stopCurrentAudio,
        togglePlayAudio,
    } = useConversationAgent()

    // Detener audio cuando se inicia grabación
    useEffect(() => {
        if (isRecording) {
            stopCurrentAudio(setChat, chat);
        }
    }, [isRecording]);

    // Limpieza de las URL de audio cuando se desmonta un componente
    useEffect(() => {
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            chat.forEach(message => {
                if (message.audioUrl) {
                    URL.revokeObjectURL(message.audioUrl);
                }
            });
        };
    }, [chat]);

    return (
        <ContentView
            chat={chat}
            topGradientPercent={100}
            bottomGradientPercent={40}
        >
            <Fragment>
                <Stack alignItems={'center'} justifyContent={'center'} h={'100%'} w={'100%'} position={'absolute'} zIndex={5}>
                    <WaveCircleVisualizer
                        isListening={true}
                        visualizerSize={110}
                        waveColor="#2563eb"
                        waveType={"wave1"}
                    />
                </Stack>

                <Stack gap={4} pb={4} pt={10}>
                    {chat.map((item, index) => (
                        <ChatItem
                            key={index}
                            actor={item.actor}
                            message={item.message}
                            audioUrl={item.audioUrl}
                            isPlaying={item.isPlaying}
                            userBg={'gray.300'}
                            agentBg={'blue.300'}
                            onPlayAudio={() => item.audioUrl && togglePlayAudio(item.audioUrl, index, setChat, chat)}
                        />
                    ))}
                    {transcribing && (
                        <Flex justifyContent="flex-end">
                            <Box
                                maxW={'80%'}
                                px={4}
                                py={2}
                                borderRadius="lg"
                                bg={'gray.300'}
                            >
                                <Spinner size="sm" />
                                <Text ml={2} display="inline">Transcribiendo...</Text>
                            </Box>
                        </Flex>
                    )}
                </Stack>
            </Fragment>
        </ContentView>
    )
}
import { Box, Flex, Text } from "@chakra-ui/react";
import useConversationAgent from "@/hooks/useConversationAgent";
import useChat from "@/hooks/useChat";
import dynamic from "next/dynamic";

const AudioRecorder = dynamic(
    () => import('../AudioRecorder'),
    { ssr: false }
);

export const ButtonBarRecord = () => {
    const { chat, setChat, addChat } = useChat();
    const {
        transcribing,
        loading,
        setTranscribing,
        setIsRecording,
        sendMessage
    } = useConversationAgent()

    return (
        <Box
            p={4}
        >
            <Flex gap={2} alignItems="center" justifyContent={'center'} flexDir={'column'}>
                <AudioRecorder
                    transcriptCallback={async (value) => {
                        await sendMessage(value, chat, addChat, setChat);
                    }}
                    onTranscribing={(t) => {
                        setTranscribing(t);
                    }}
                    onRecording={(recording) => {
                        setIsRecording(recording);
                    }}
                />
                {loading && <Text fontSize={'12px'}>Generando respuesta</Text>}
                {transcribing && <Text fontSize={'12px'}>Transcribiendo audio a texto</Text>}
            </Flex>
        </Box>
    )
}
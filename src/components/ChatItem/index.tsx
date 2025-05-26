import { Avatar, Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { FiPause, FiPlay } from "react-icons/fi";

export const ChatItem = ({
    actor,
    message,
    audioUrl,
    isPlaying,
    userBg,
    agentBg,
    onPlayAudio,
}: {
    actor: string,
    message?: string,
    audioUrl?: string,
    isPlaying?: boolean,
    userBg: string,
    agentBg: string,
    onPlayAudio: () => void
}) => {
    const isUser = actor === 'user';

    return (
        <Flex
            justifyContent={isUser ? "flex-end" : "flex-start"}
            alignItems="flex-end"
            gap={2}
        >
            {!isUser && (
                <Avatar.Root>
                    <Avatar.Fallback name="A" />
                </Avatar.Root>
            )}

            <Box
                bg={isUser ? userBg : agentBg}
                px={4}
                py={2}
                borderRadius={isUser ? "18px 18px 0 18px" : "18px 18px 18px 0"}
                maxW={['80%', '70%']}
                boxShadow="4px 0 30px #ecebeb"
            >
                {message && <Text whiteSpace="pre-wrap">{message}</Text>}
                {audioUrl && (
                    <Flex align="center" mt={message ? 2 : 0}>
                        <IconButton
                            aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
                            onClick={onPlayAudio}
                            size="sm"
                            variant="ghost"
                            rounded={"full"}
                        >{isPlaying ? <FiPause /> : <FiPlay />}</IconButton>
                        <Text ml={2}>Respuesta de voz</Text>
                    </Flex>
                )}
            </Box>

            {isUser && (
                <Avatar.Root>
                    <Avatar.Fallback name="Usuario" />
                </Avatar.Root>
            )}
        </Flex>
    );
}
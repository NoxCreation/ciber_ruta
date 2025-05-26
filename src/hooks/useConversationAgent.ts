// Este contexto está hecho con Zustand, una alternativa más facil de tener estados globales

import { ChatMessage } from '@/types/ChatMessage';
import axios from 'axios';
import { create } from 'zustand';

// Definimos el estado y las acciones
type ConversationAgentStore = {
    transcribing: boolean;
    currentAudio: HTMLAudioElement | null
    isRecording: boolean;
    loading: boolean;
    setCurrentAudio: (audio: HTMLAudioElement | null) => void
    setLoading: (loading: boolean) => void
    setTranscribing: (transcribing: boolean) => void
    setIsRecording: (isRecording: boolean) => void
    stopCurrentAudio: (setChat: (chat: Array<ChatMessage>) => void, chat: Array<ChatMessage>) => void
    togglePlayAudio: (audioUrl: string, index: number, setChat: (chat: Array<ChatMessage>) => void, chat: Array<ChatMessage>) => void
    sendMessage: (message: string, chat: Array<ChatMessage>, addChat: (data: ChatMessage) => Array<ChatMessage>, setChat: (chat: Array<ChatMessage>) => void) => void
};

// Creamos el hook para acceder al chat
const useConversationAgent = create<ConversationAgentStore>((set, get) => ({
    transcribing: false,
    currentAudio: null,
    isRecording: false,
    loading: false,
    setCurrentAudio: (audio) => set(() => ({ currentAudio: audio })),
    setLoading: (loading) => set(() => ({ loading })),
    setTranscribing: (transcribing) => set(() => ({ transcribing })),
    setIsRecording: (isRecording) => set(() => ({ isRecording })),
    stopCurrentAudio: (setChat, chat) => {
        if (get().currentAudio != undefined) {
            (get().currentAudio as HTMLAudioElement).pause();
            (get().currentAudio as HTMLAudioElement).currentTime = 0;
            get().setCurrentAudio(null);
        }
        setChat(chat.map((msg: ChatMessage) => ({
            ...msg,
            isPlaying: false
        })));
    },
    togglePlayAudio: (audioUrl, index, setChat, chat) => {
        // Si el audio que se quiere reproducir es el que ya está sonando, lo pausamos
        if (get().currentAudio && chat[index].isPlaying) {
            get().stopCurrentAudio(setChat, chat);
            return;
        }

        // Si hay otro audio sonando, lo detenemos primero
        if (get().currentAudio) {
            get().stopCurrentAudio(setChat, chat);
        }

        // Crear nuevo elemento de audio
        const audio = new Audio(audioUrl);
        get().setCurrentAudio(audio);

        // Marcar como reproduciendo
        setChat(chat.map((msg, i) => ({
            ...msg,
            isPlaying: i === index ? true : false
        })))

        audio.play();

        audio.onended = () => {
            setChat(chat.map((msg) => ({
                ...msg,
                isPlaying: false
            })));
            get().setCurrentAudio(null);
        };

        audio.onpause = () => {
            setChat(chat.map((msg) => ({
                ...msg,
                isPlaying: false
            })));
        };
    },
    sendMessage: async (message, chat, addChat, setChat) => {
        if (!message.trim()) return;

        addChat({
            actor: 'user',
            message
        });

        const data = JSON.stringify({
            "message": message,
            "sessionId": 1
        });

        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.NEXT_PUBLIC_URL_AGENT_N8N,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data,
                responseType: 'blob'
            } as any;

            get().setLoading(true);
            const response = await axios.request(config);

            if (response.status === 200) {
                const audioUrl = URL.createObjectURL(response.data);
                const updatedChat = addChat({
                    actor: 'agent',
                    audioUrl,
                    isPlaying: false
                });

                const newMessageIndex = updatedChat.length - 1;
                get().togglePlayAudio(audioUrl, newMessageIndex, setChat, updatedChat);
            }
            get().setLoading(false);
        } catch (error) {
            console.error("Error sending message:", error);
            //alert("No se pudo obtener la respuesta del agente");

            addChat({
                actor: 'agent',
                message: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente."
            });
        }
    }
}));

export default useConversationAgent;

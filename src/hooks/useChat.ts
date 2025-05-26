// Este contexto está hecho con Zustand, una alternativa más facil de tener estados globales

import { ChatMessage } from '@/types/ChatMessage';
import { create } from 'zustand';

// Definimos el estado y las acciones
type ChatStore = {
    chat: Array<ChatMessage>;
    setChat: (chat: Array<ChatMessage>) => void
    addChat: (data: ChatMessage) => Array<ChatMessage>;
};

// Creamos el hook para acceder al chat
const useChat = create<ChatStore>((set, get) => ({
    chat: [],
    setChat: (chat: Array<ChatMessage>) => set(() => ({ chat })),
    addChat: (data) => {
        // Usamos la función de actualización de `set` para obtener el estado más reciente
        set((state) => {
            const newChat = [...state.chat, data];
            return { chat: newChat };
        });
        return get().chat; // Retorna el estado actualizado
    },
}));

export default useChat;

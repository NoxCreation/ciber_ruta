// Este contexto está hecho con Zustand, una alternativa más facil de tener estados globales


import { create } from 'zustand';

// Definimos el estado y las acciones
type ChatStore = {
    isConnected: boolean;
    setStateConection: (isConnected: boolean) => void
};

// Creamos el hook para acceder al chat
const useConectWS = create<ChatStore>((set) => ({
    isConnected: false,
    setStateConection: (isConnected: boolean) => set(() => ({ isConnected })),
}));

export default useConectWS;

// Este contexto está hecho con Zustand, una alternativa más facil de tener estados globales


import { create } from 'zustand';

// Definimos el estado y las acciones
type ChatStore = {
    isConnected: boolean;
    data: Array<any>
    setStateConection: (isConnected: boolean) => void
    setDataInterface: (data: Array<any>) => void
};

// Creamos el hook para acceder al chat
const useConectWS = create<ChatStore>((set) => ({
    isConnected: false,
    data: [],
    setStateConection: (isConnected: boolean) => set(() => ({ isConnected })),
    setDataInterface: (data: Array<any>) => set(() => ({ data })),
}));

export default useConectWS;

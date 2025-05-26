// Tiene como objetivo responder al cambio de vistas

import { create } from 'zustand';

type ViewChangeStore = {
    viewShow: number;
    previousView: number | null;
    setView: (newView: number) => void;
};

const useViewChange = create<ViewChangeStore>((set) => ({
    viewShow: 0,
    previousView: null,
    setView: (newView) => {
        set((state) => ({
            previousView: state.viewShow,
            viewShow: newView
        }));

        // Limpiar previousView después de la transición
        setTimeout(() => {
            set({ previousView: null });
        }, 500); // Ajusta este tiempo según la duración de tu animación
    }
}));

export default useViewChange;

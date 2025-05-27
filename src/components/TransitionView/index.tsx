import useViewChange from '@/hooks/useViewChange';
import { ViewHome } from '@/views/home';
import { ViewMap } from '@/views/maps';
import { Stack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ButtonBarRecord } from '../ButtonBarRecord';
import { ViewAbout } from '@/views/about';
import { ViewProfile } from '@/views/profile';

const TransitionView = () => {
    const { viewShow } = useViewChange();

    return (
        <Stack h={'100vh'} overflow={'hidden'}>
            <AnimatePresence mode='wait' >
                <motion.div
                    key={viewShow}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        height: '100%'
                    }}
                >
                    {renderView(viewShow)}
                </motion.div>
            </AnimatePresence>
        </Stack>
    );
};

// Poner todas las vistas a renderizar
const renderView = (viewId: number) => {
    switch (viewId) {
        case 0: return (
            <Stack flexDir={'column'} h={'100%'}>
                <ViewHome />
                <ButtonBarRecord />
            </Stack>
        );
        case 1: return <ViewAbout />;
        case 2: return <ViewMap />;
        case 3: return <ViewProfile />;
        default: return null;
    }
};

export default TransitionView;
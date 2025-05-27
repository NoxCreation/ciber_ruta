'use client'

import {
    ChakraProvider,
    createSystem,
    defaultConfig,
} from '@chakra-ui/react'
import type { PropsWithChildren } from 'react'

const customTheme = {
    fonts: {
        body: 'var(--font-outfit)',
    },
    radii: {
        l1: '0.125rem',
        l2: '0.25rem',
        l3: '0.375rem',
    },
    colors: {
        primary: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#283c77',  // Aquí defines el color primario principal
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
        }
    }
}

const system = createSystem({
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        ...customTheme
    }
})

export const UIProvider = ({ children }: PropsWithChildren) => (
    <ChakraProvider value={system}>
        {children}
    </ChakraProvider>
)
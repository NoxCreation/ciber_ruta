import { Box, BoxProps } from "@chakra-ui/react"

type Props = {
    color?: string,
    gradient?: 'top-bottom' | 'bottom-top'
} & BoxProps

export const OverlayGradient = ({
    color = '#ffffff',
    gradient = 'top-bottom',
    ...props
}: Props) => {

    function hexToRgba(hex: string, alpha: number) {
        // Remueve el símbolo #
        hex = hex.replace(/^#/, '');

        // Convierte a valores RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Devuelve el formato rgba como cadena
        return `rgba(${r},${g},${b},${alpha})`;
    }

    return (
        <Box
            height="150px"
            background={`linear-gradient(to bottom, ${gradient == 'top-bottom' ? hexToRgba(color, 50) : hexToRgba(color, 0)} 0%, ${gradient == 'top-bottom' ? hexToRgba(color, 0) : hexToRgba(color, 50)} 100%)`}
            zIndex={2}
            pointerEvents="none"
            {...props}
        />
    )
}
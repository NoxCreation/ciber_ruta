import { Stack } from "@chakra-ui/react"

export const LabelStrongPassword = ({
    strength,
    errors,
    isValid
}: {
    strength: number,
    errors: string[],
    isValid: boolean
}) => {
    return (
        <Stack w={'100%'}>
            <Stack fontSize={"12px"}>
                <strong>Fuerza: {strength}%</strong>
                <Stack style={{ height: '10px', backgroundColor: '#e0e0e0', margin: '5px 0' }}>
                    <Stack
                        style={{
                            width: `${strength}%`,
                            height: '100%',
                            backgroundColor: strength === 100 ? '#4CAF50' : strength >= 50 ? '#FFC107' : '#F44336',
                        }}
                    />
                </Stack>
            </Stack>

            {errors.length > 0 && (
                <ul style={{ color: 'red', fontSize: "12px", marginLeft: '14px' }}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}

            {isValid && <p style={{ color: 'green', fontSize: "12px" }}>¡Contraseña segura! ✅</p>}
        </Stack>
    )
}
import { useState, useMemo } from 'react';

const usePasswordStrength = () => {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);

    // Caracteres especiales (símbolos comunes en contraseñas)
    const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

    // Verifica si la contraseña tiene al menos un carácter especial
    const hasSpecialChar = (pass: string) => {
        return pass.split('').some(char => specialChars.includes(char));
    };

    const evaluatePassword = (pass: string) => {
        const newErrors: string[] = [];
        let score = 0;

        // 1. Longitud mínima de 9 caracteres
        if (pass.length >= 9) {
            score += 25;
        } else {
            newErrors.push("Mínimo 8 caracteres");
        }

        // 2. Al menos una mayúscula
        if (/[A-Z]/.test(pass)) {
            score += 25;
        } else {
            newErrors.push("Al menos una mayúscula");
        }

        // 3. Al menos un número
        if (/\d/.test(pass)) {
            score += 25;
        } else {
            newErrors.push("Al menos un número");
        }

        // 4. Al menos un carácter especial (usando la función helper)
        if (hasSpecialChar(pass)) {
            score += 25;
        } else {
            newErrors.push("Al menos un carácter especial");
        }

        setStrength(score);
        setErrors(newErrors);

        return { score, errors: newErrors }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        evaluatePassword(newPassword);
    };

    // Determina si la contraseña es válida (cumple todos los requisitos)
    const isValid = useMemo(() => strength === 100, [strength]);

    return {
        password,
        strength,
        errors,
        isValid,
        handlePasswordChange,
        evaluatePassword,
    };
};

export default usePasswordStrength;
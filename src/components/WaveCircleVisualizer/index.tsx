import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    visualizerSize?: number;
    waveColor?: string;
    isListening?: boolean
    waveType?: "wave1" | "wave2" | "wave3" | "wave4" | "wave5" | "wave6"
}

const WaveCircleVisualizer = ({
    visualizerSize = 300,
    waveColor = '#00ffcc',
    isListening = true,
    waveType = "wave1"
}: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(null);
    const audioContextRef = useRef<AudioContext>(null);
    const analyserRef = useRef<AnalyserNode>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode>(null);

    // Función para convertir HEX a RGBA
    const toRGBA = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = visualizerSize;
            canvas.height = visualizerSize;
        }
    }, [visualizerSize]);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();

            analyser.fftSize = 256;
            const microphone = audioContext.createMediaStreamSource(stream);

            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            microphoneRef.current = microphone;

            switch (waveType) {
                case 'wave1': visualize1(); break;
                case 'wave2': visualize2(); break;
                case 'wave3': visualize3(); break;
                case 'wave4': visualize4(); break;
                case 'wave5': visualize5(); break;
                case 'wave6': visualize6(); break;
            }
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopListening = (callBack: () => void) => {
        audioContextRef.current?.close();
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        callBack()
    };

    const visualize1 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = visualizerSize * 0.2;
            const amplitude = (dataArray.reduce((a, b) => a + b) / bufferLength) * (visualizerSize / 300);

            // Círculo principal
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.5, 0, 2 * Math.PI);

            // Gradiente
            const gradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.3,
                centerX, centerY, baseRadius * 1.5
            );

            gradient.addColorStop(0, toRGBA(waveColor, 0.8));
            gradient.addColorStop(1, toRGBA(waveColor, 0.3));

            ctx.strokeStyle = gradient;
            ctx.lineWidth = visualizerSize * 0.02 + amplitude * 0.01;
            ctx.shadowBlur = visualizerSize * 0.05 + amplitude * 0.1;
            ctx.shadowColor = toRGBA(waveColor, 0.5);
            ctx.stroke();

            // Onda secundaria
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.3, 0, 2 * Math.PI);
            ctx.strokeStyle = toRGBA(waveColor, 0.4);
            ctx.lineWidth = visualizerSize * 0.01 + amplitude * 0.005;
            ctx.stroke();
        };

        draw();
    };

    const visualize2 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let rotation = 0;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = visualizerSize * 0.3;
            const barCount = 40;

            rotation += 0.003;

            // Fondo con efecto de neblina
            ctx.fillStyle = toRGBA(waveColor, 0.00);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Barras radiales dinámicas
            for (let i = 0; i < barCount; i++) {
                const angle = ((Math.PI * 2) / barCount) * i + rotation;
                const frequencyValue = dataArray[i % bufferLength];
                const barHeight = Math.max(5, (frequencyValue / 300) * maxRadius);
                const barWidth = visualizerSize * 0.015;

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle);

                // Gradiente para las barras
                const gradient = ctx.createLinearGradient(0, 0, 0, -barHeight);
                gradient.addColorStop(0, toRGBA(waveColor, 0.6));
                gradient.addColorStop(1, toRGBA(waveColor, 0.2));

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    -barWidth / 2,
                    -maxRadius,
                    barWidth,
                    -barHeight
                );

                ctx.restore();
            }

            // Anillo central pulsante
            const averageAmplitude = dataArray.reduce((a, b) => a + b) / bufferLength;
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius * 0.2 + averageAmplitude * 0.1, 0, Math.PI * 2);
            ctx.fillStyle = toRGBA(waveColor, 0.2);
            ctx.fill();
        };

        draw();
    };

    const visualize3 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let phase = 0;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = visualizerSize * 0.25;
            const amplitude = dataArray.reduce((a, b) => a + b) / bufferLength;

            phase = (phase + 0.05) % (Math.PI * 2);

            // Onda sinusoidal circular
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
                const frequencyIndex = Math.floor(angle / (Math.PI * 2) * bufferLength);
                const waveAmplitude = dataArray[frequencyIndex] * (visualizerSize / 300);

                const radius = baseRadius +
                    Math.sin(angle * 8 + phase) * waveAmplitude * 0.3 +
                    amplitude * 0.2;

                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                if (angle === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            // Gradiente de energía
            const gradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.5,
                centerX, centerY, baseRadius * 2
            );
            gradient.addColorStop(0, toRGBA(waveColor, 0.9));
            gradient.addColorStop(1, toRGBA(waveColor, 0.1));

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 30;
            ctx.shadowColor = toRGBA(waveColor, 0.5);
            ctx.fill();

            // Pulsos energéticos aleatorios
            if (Math.random() < 0.1) {
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.cos(phase) * baseRadius,
                    centerY + Math.sin(phase) * baseRadius,
                    amplitude * 0.3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = toRGBA(waveColor, 0.7);
                ctx.fill();
            }
        };

        draw();
    };

    const visualize4 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = visualizerSize * 0.2;
            const amplitude = (dataArray.reduce((a, b) => a + b) / bufferLength) * (visualizerSize / 300);

            // Círculo principal con relleno
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.5, 0, 2 * Math.PI);

            // Gradiente de relleno
            const fillGradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.1,
                centerX, centerY, baseRadius * 2
            );
            fillGradient.addColorStop(1, toRGBA(waveColor, 0.3));
            /* fillGradient.addColorStop(1, toRGBA(waveColor, 0.2)); */

            ctx.fillStyle = fillGradient;
            ctx.shadowBlur = visualizerSize * 0.1;
            ctx.shadowColor = toRGBA(waveColor, 0.3);
            ctx.fill();

            // Círculo secundario con relleno
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.2, 0, 2 * Math.PI);

            // Relleno secundario
            ctx.fillStyle = toRGBA(waveColor, 1);
            ctx.shadowBlur = visualizerSize * 0.1;
            ctx.fill();

        };

        draw();
    };

    const visualize5 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let phase = 0;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = visualizerSize * 0.2;
            const amplitude = (dataArray.reduce((a, b) => a + b) / bufferLength) * (visualizerSize / 250);

            phase = (phase + 0.015) % (Math.PI * 2);

            // Capa base con efecto de neblina
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = toRGBA(waveColor, 0.00);
            ctx.fill();

            // Círculo principal con efecto 3D
            const mainGradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.1,
                centerX, centerY, baseRadius * 2
            );
            mainGradient.addColorStop(0, toRGBA(waveColor, 0.9));
            mainGradient.addColorStop(1, toRGBA(waveColor, 0.2));

            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = mainGradient;
            ctx.shadowBlur = visualizerSize * 0.1;
            ctx.shadowColor = toRGBA(waveColor, 0.4);
            ctx.fill();

            // Borde dinámico con interferencia
            const borderGradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.3,
                centerX, centerY, baseRadius * 1.8
            );
            borderGradient.addColorStop(0, toRGBA(waveColor, 0.8));
            borderGradient.addColorStop(1, toRGBA(waveColor, 0.3));

            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.5, 0, 2 * Math.PI);
            ctx.strokeStyle = borderGradient;
            ctx.lineWidth = visualizerSize * 0.02 + amplitude * 0.015;
            ctx.shadowBlur = visualizerSize * 0.08;
            ctx.shadowColor = toRGBA(waveColor, 0.6);
            ctx.stroke();

            // Efecto de partículas orbitales
            const particleCount = 36;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + phase;
                const frequencyValue = dataArray[Math.floor(i * (bufferLength / particleCount))];
                const particleRadius = baseRadius * 1.4 + amplitude * 0.7;

                const x = centerX + Math.cos(angle) * particleRadius;
                const y = centerY + Math.sin(angle) * particleRadius;

                ctx.beginPath();
                ctx.arc(x, y,
                    visualizerSize * 0.008 + (frequencyValue * visualizerSize) / 5000,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = toRGBA(waveColor, 0.5 + (frequencyValue / 300));
                ctx.fill();
            }

            // Núcleo central pulsante
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 0.4 + amplitude * 0.1, 0, 2 * Math.PI);
            ctx.fillStyle = toRGBA(waveColor, 0.8);
            ctx.shadowBlur = 25;
            ctx.shadowColor = toRGBA(waveColor, 0.5);
            ctx.fill();
        };

        draw();
    };

    const visualize6 = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = visualizerSize * 0.25;
            const amplitude = (dataArray.reduce((a, b) => a + b) / bufferLength) * (visualizerSize / 350);

            // Capa base suave
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 1.8, 0, 2 * Math.PI);
            ctx.fillStyle = toRGBA(waveColor, 0.00);
            ctx.fill();

            // Círculo principal con efecto de profundidad
            const mainGradient = ctx.createRadialGradient(
                centerX, centerY, baseRadius * 0.1,
                centerX, centerY, baseRadius * 1.5
            );
            mainGradient.addColorStop(0, toRGBA(waveColor, 0.7));
            mainGradient.addColorStop(1, toRGBA(waveColor, 0.2));

            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.4, 0, 2 * Math.PI);
            ctx.fillStyle = mainGradient;
            ctx.shadowBlur = visualizerSize * 0.08;
            ctx.shadowColor = toRGBA(waveColor, 0.3);
            ctx.fill();

            // Borde dinámico
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius + amplitude * 0.4, 0, 2 * Math.PI);
            ctx.strokeStyle = toRGBA(waveColor, 0.6);
            ctx.lineWidth = visualizerSize * 0.015 + amplitude * 0.008;
            ctx.shadowBlur = visualizerSize * 0.05;
            ctx.shadowColor = toRGBA(waveColor, 0.5);
            ctx.stroke();

            // Núcleo brillante
            /* ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 0.3 + amplitude * 0.05, 0, 2 * Math.PI);
            ctx.fillStyle = toRGBA(waveColor, 0.9);
            ctx.fill(); */
        };

        draw();
    };

    useEffect(() => {
        stopListening(() => isListening ? startListening() : {})
    }, [waveType, isListening, visualizerSize])

    return (
        <Box position="relative">
            <canvas
                ref={canvasRef}
                width={visualizerSize}
                height={visualizerSize}
                style={{
                    width: visualizerSize,
                    height: visualizerSize,
                    filter: `drop-shadow(0 0 ${visualizerSize * 0.03}px ${toRGBA(waveColor, 0.3)})`
                }}
            />
        </Box>
    );
};

export default WaveCircleVisualizer;
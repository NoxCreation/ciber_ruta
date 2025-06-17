"use client"

import { Stack } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import 'leaflet/dist/leaflet.css'

const MapWithNoSSR = dynamic(
    () => import('react-leaflet').then((mod) => {
        const { MapContainer, TileLayer, Marker } = mod;

        // Solución para el problema de iconos en Leaflet
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        return function Map({ center }: { center: [number, number] }) {
            return (
                <MapContainer
                    center={center}
                    zoom={15}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    zoomControl={false}
                    dragging={false}
                    doubleClickZoom={false}
                    attributionControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={center} />
                </MapContainer>
            )
        }
    }),
    {
        ssr: false,
        loading: () => (
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                Cargando mapa...
            </div>
        )
    }
)

export const MiniMap = ({ center }: { center: [number, number] }) => {
    return (
        <Stack
            w="250px"
            h="150px"
            position="relative"
            overflow="hidden"
            borderRadius="md"
        >
            <MapWithNoSSR center={center} />
        </Stack>
    )
}
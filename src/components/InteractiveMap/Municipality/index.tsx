import type { Polygon, MultiPolygon } from 'geojson'

// MAPAS
import { artemisaGeoJSON } from "./art";
import { havanaGeoJSON } from "./lha";
import { camagueyGeoJSON } from "./cam";
import { pinerrioGeoJSON } from "./pri";
import { mayabequeGeoJSON } from "./may";
import { matanzaGeoJSON } from "./mat";
import { villaclaraGeoJSON } from "./vcl";
import { sspiritusGeoJSON } from "./ssp";
import { cienfuegosGeoJSON } from "./cfg";
import { cavilaGeoJSON } from "./cav";
import { ltunasGeoJSON } from "./ltu";
import { holguinGeoJSON } from "./hol";
import { guantanamoGeoJSON } from "./gtm";
import { santiagocubaGeoJSON } from "./stg";
import { granmaGeoJSON } from "./gra";
import { ijuventudGeoJSON } from "./ijv";

export const maps = [
    {
        id: 0,
        name: "Pinar del Río",
        geoJson: pinerrioGeoJSON,
        coordinates: [22.3247, -83.7999],
        zoom: 8
    },
    {
        id: 1,
        name: "Artemisa",
        geoJson: artemisaGeoJSON,
        coordinates: [22.7561, -82.8133],
        zoom: 9
    },
    {
        id: 2,
        name: "La Habana",
        geoJson: havanaGeoJSON,
        coordinates: [23.068556, -82.278915],
        zoom: 10
    },
    {
        id: 3,
        name: "Mayabeque",
        geoJson: mayabequeGeoJSON,
        coordinates: [22.8977, -82.0338],
        zoom: 9
    },
    {
        id: 4,
        name: "Matanza",
        geoJson: matanzaGeoJSON,
        coordinates: [22.6140, -81.1212],
        zoom: 8
    },
    {
        id: 5,
        name: "Villa Clara",
        geoJson: villaclaraGeoJSON,
        coordinates: [22.6140, -80.0607],
        zoom: 8
    },
    {
        id: 6,
        name: "Cienfuegos",
        geoJson: cienfuegosGeoJSON,
        coordinates: [22.2179, -80.3933],
        zoom: 9
    },
    {
        id: 7,
        name: "Sancti Spiritus",
        geoJson: sspiritusGeoJSON,
        coordinates: [22.0042, -79.3833],
        zoom: 9
    },
    {
        id: 8,
        name: "Ciego de Ávila",
        geoJson: cavilaGeoJSON,
        coordinates: [21.9813, -78.6254],
        zoom: 9
    },
    {
        id: 9,
        name: "Camagüey",
        geoJson: camagueyGeoJSON,
        coordinates: [21.4582, -77.8029],
        zoom: 8
    },
    {
        id: 10,
        name: "Las Tunas",
        geoJson: ltunasGeoJSON,
        coordinates: [21.0589, -76.9909],
        zoom: 9
    },
    {
        id: 11,
        name: "Holguin",
        geoJson: holguinGeoJSON,
        coordinates: [20.7895, -75.73639],
        zoom: 9
    },
    {
        id: 12,
        name: "Granma",
        geoJson: granmaGeoJSON,
        coordinates: [20.2828, -76.9629],
        zoom: 9
    },
    {
        id: 13,
        name: "Santiago de Cuba",
        geoJson: santiagocubaGeoJSON,
        coordinates: [20.2364, -76.1034],
        zoom: 9
    },
    {
        id: 14,
        name: "Guantánamo",
        geoJson: guantanamoGeoJSON,
        coordinates: [20.2210, -74.9281],
        zoom: 9
    },
    {
        id: 15,
        name: "Isla de la Juventud",
        geoJson: ijuventudGeoJSON,
        coordinates: [21.6651, -82.8492],
        zoom: 9
    },
]

interface Location {
    province: string | null
    municipality: string | null
}

// Función auxiliar para verificar si un punto está dentro de un polígono
function isPointInPolygon(point: [number, number], polygon: number[][][]): boolean {
    const [lat, lng] = point
    let inside = false

    for (const ring of polygon) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const [xi, yi] = ring[i]
            const [xj, yj] = ring[j]

            const intersect = ((yi > lat) !== (yj > lat)) &&
                (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)

            if (intersect) inside = !inside
        }
    }

    return inside
}

// Función principal para encontrar la provincia y municipio
export function findLocation(lat: number, lng: number): Location {
    const point: [number, number] = [lat, lng]

    for (const map of maps) {
        const features = map.geoJson.features

        for (const feature of features) {
            const geometry = feature.geometry as Polygon | MultiPolygon

            if (geometry.type === 'Polygon') {
                if (isPointInPolygon(point, geometry.coordinates)) {
                    return {
                        province: map.name,
                        municipality: feature.properties?.municipality || null
                    }
                }
            } else if (geometry.type === 'MultiPolygon') {
                // Para MultiPolygon, verificamos cada polígono individual
                for (const polygon of geometry.coordinates) {
                    if (isPointInPolygon(point, polygon)) {
                        return {
                            province: map.name,
                            municipality: feature.properties?.municipality || null
                        }
                    }
                }
            }
        }
    }

    // Si no se encuentra la ubicación
    return {
        province: null,
        municipality: null
    }
}

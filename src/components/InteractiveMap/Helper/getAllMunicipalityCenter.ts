import type { Polygon, MultiPolygon } from 'geojson'
import { maps } from '../Municipality'

export interface MunicipalityCenter {
    province: string
    municipality: string
    center: {
        lat: number
        lng: number
    }
}

// Función para calcular el centro de un array de coordenadas
function calculatePolygonCenter(coordinates: number[][]): [number, number] {
    let sumLat = 0
    let sumLng = 0
    const len = coordinates.length

    for (const [lng, lat] of coordinates) {
        sumLat += lat
        sumLng += lng
    }

    return [sumLat / len, sumLng / len]
}

// Función para calcular el centro de un polígono (puede tener huecos)
function calculateCenter(geometry: Polygon | MultiPolygon): [number, number] {
    if (geometry.type === 'Polygon') {
        // Usamos solo el anillo exterior (primer array de coordenadas)
        return calculatePolygonCenter(geometry.coordinates[0])
    } else {
        // Para MultiPolygon, calculamos el centro de cada polígono y luego su promedio
        const centers = geometry.coordinates.map(polygon =>
            calculatePolygonCenter(polygon[0])
        )

        return [
            centers.reduce((sum, [lat]) => sum + lat, 0) / centers.length,
            centers.reduce((sum, [, lng]) => sum + lng, 0) / centers.length
        ]
    }
}

// Función principal para obtener los centros de los municipios
export function getAllMunicipalityCenters(provinceName?: string): MunicipalityCenter[] {
    const centers: MunicipalityCenter[] = []

    // Si se especifica una provincia, filtramos el array maps
    const targetMaps = provinceName
        ? maps.filter(map => map.name === provinceName)
        : maps

    for (const map of targetMaps) {
        const features = map.geoJson.features

        for (const feature of features) {
            const geometry = feature.geometry as Polygon | MultiPolygon
            const municipalityName = feature.properties?.municipality

            if (municipalityName) {
                const [lat, lng] = calculateCenter(geometry)

                centers.push({
                    province: map.name,
                    municipality: municipalityName,
                    center: {
                        lat,
                        lng
                    }
                })
            }
        }
    }

    return centers
}

// Ejemplos de uso:
/*
// Obtener todos los centros de municipios
const allCenters = getAllMunicipalityCenters()
console.log(allCenters)

// Obtener solo los centros de los municipios de La Habana
const habanaCenters = getAllMunicipalityCenters('La Habana')
console.log(habanaCenters)
*/
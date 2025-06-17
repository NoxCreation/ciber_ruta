"use client"

import { MapContainer, GeoJSON, useMapEvents, useMap, TileLayer } from "react-leaflet"
import type { Feature } from "geojson"
import "leaflet/dist/leaflet.css"
import { useCallback, useMemo, useState, useEffect, useRef, type ReactNode } from "react"
import type L from "leaflet"
import { Box, Text, Select, Stack, Flex, Checkbox } from "@chakra-ui/react"
import { maps } from "./Municipality"
import type { LatLngExpression } from "leaflet"
import CustomMarker from "./CustomMarker"

// Componente para capturar eventos del mapa
function MapEventHandler({
    onMapChange,
    onDblClick,
}: {
    onMapChange: (center: L.LatLng, zoom: number) => void
    onDblClick?: (latlng: L.LatLng) => void
}) {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter()
            const zoom = map.getZoom()
            onMapChange(center, zoom)
        },
        dblclick: (e) => {
            if (onDblClick) {
                onDblClick(e.latlng)
            }
        },
    })
    return null
}

// Componente para actualizar la vista del mapa
function ChangeMapView({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) {
    const map = useMap()

    useEffect(() => {
        map.setView(coordinates, zoom, {
            animate: true,
            duration: 1,
        })
    }, [map, coordinates, zoom])

    return null
}

interface MapProps {
    onChangeMunicipality?: ({
        province,
        municipality,
    }: {
        province: string
        municipality: string
    }) => void
    onChangeProvince?: (province: string) => void
    onDblClick?: (layer: any) => void
    initLoadReliefMap?: boolean
    showConfig?: boolean
    markets?: Array<{
        position: [number, number]
        popupText: string | ReactNode
        color: string
        onClick: () => void
        onDblClick?: () => void
        showAtention?: boolean
    }>
    customMarkets?: Array<ReactNode>
    options?: ReactNode
}

export default function InteractiveMap({
    markets,
    customMarkets,
    options,
    initLoadReliefMap,
    showConfig = true,
    onChangeMunicipality,
    onChangeProvince,
    onDblClick,
}: MapProps) {
    const [loadReliefMap, setLoadReliefMap] = useState(initLoadReliefMap ? true : false)
    const [loadJSONMap, setLoadJSONMap] = useState(initLoadReliefMap ? false : true)
    const [mapSelect, setMapSelect] = useState(maps[0])
    const [select, setSelect] = useState("Select a municipality")
    const [mapCenter, setMapCenter] = useState<L.LatLng | null>(null)
    const [mapZoom, setMapZoom] = useState<number | null>(null)
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
    const refSelectedFeature = useRef(selectedFeature)
    useEffect(() => {
        refSelectedFeature.current = selectedFeature
    }, [selectedFeature])
    const [selectedLayer, setSelectedLayer] = useState<L.Layer | null>(null)
    const refSelectedLayer = useRef(selectedLayer)
    useEffect(() => {
        refSelectedLayer.current = selectedLayer
    }, [selectedLayer])

    // Find marker with showAtention=true
    const attentionMarker = useMemo(() => {
        return markets?.find((marker) => marker.showAtention === true)
    }, [markets])

    // Initial map coordinates - use attention marker if available
    const initialCoordinates = useMemo(() => {
        if (attentionMarker) {
            return attentionMarker.position
        }
        return mapSelect.coordinates as [number, number]
    }, [attentionMarker, mapSelect.coordinates])

    // Initial zoom level - use a closer zoom for attention markers
    const initialZoom = useMemo(() => {
        if (attentionMarker) {
            return 15 // You can adjust this zoom level as needed
        }
        return mapSelect.zoom
    }, [attentionMarker, mapSelect.zoom])

    // Función para manejar cambios en el mapa
    const handleMapChange = useCallback((center: L.LatLng, zoom: number) => {
        setMapCenter(center)
        setMapZoom(zoom)
    }, [])

    // Estilo por defecto para los municipios
    const defaultStyle = {
        fillColor: "#FFF",
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: "#666",
    }

    // Estilo cuando se pasa el mouse por encima
    const highlightStyle = {
        fillColor: "#fff2d3",
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: "#ff7500",
    }

    // Estilo para el municipio seleccionado
    const selectedStyle = {
        fillColor: "#fff2d3",
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: "#ff7500",
    }

    // Manejador de eventos para cuando el mouse entra en un municipio
    const onEachFeature = useCallback(
        (feature: Feature, layer: L.Layer) => {
            layer.on({
                mouseover: (e) => {
                    const layer = e.target
                    if (feature !== refSelectedFeature.current) {
                        layer.setStyle(highlightStyle)
                    }
                },
                mouseout: (e) => {
                    const layer = e.target
                    if (feature !== refSelectedFeature.current) {
                        layer.setStyle(defaultStyle)
                    }
                },
                click: (e) => {
                    const municipalityName = feature.properties?.municipality
                    const province = feature.properties?.province
                    setSelect(municipalityName)

                    // Establecer el nuevo municipio seleccionado
                    const layer = e.target
                    setTimeout(() => {
                        layer.setStyle(selectedStyle)
                    }, 1)
                    setSelectedFeature(feature)
                    setSelectedLayer(layer)

                    if (municipalityName && onChangeMunicipality) {
                        onChangeMunicipality({
                            province: province,
                            municipality: municipalityName,
                        })
                    }
                },
                dblclick: () => {
                    console.log("entro")
                    if (onDblClick) onDblClick(layer)
                },
            })
        },
        [onChangeMunicipality, selectedFeature, selectedLayer, onDblClick],
    )

    // Limpiar la selección cuando se cambia de mapa
    useEffect(() => {
        setSelectedFeature(null)
        setSelectedLayer(null)
    }, [mapSelect])

    // Memorizar las opciones del GeoJSON para evitar re-renders innecesarios
    const geoJsonOptions = useMemo(
        () => ({
            style: defaultStyle,
            onEachFeature: onEachFeature,
        }),
        [onEachFeature],
    )

    return (
        <Stack h={"100%"} w={"100%"}>
            {showConfig && (
                <>
                    <Flex gap={5}>
                        <Stack /* spacing={2} */ flex={1}>
                            {/* <Checkbox flex={1} size={"sm"} isChecked={loadReliefMap} onChange={(t) => setLoadReliefMap(t.target.checked)}>
                                Load relief map
                            </Checkbox>
                            <Checkbox flex={1} size={"sm"} isChecked={loadJSONMap} onChange={(t) => setLoadJSONMap(t.target.checked)}>
                                Load polygon map
                            </Checkbox> */}
                        </Stack>
                        {/* <Select
                            flex={1}
                            onChange={(t) => {
                                const newMap = maps[Number.parseInt(t.target.value)]
                                if (onChangeProvince) onChangeProvince(newMap.name)
                                setMapSelect(newMap)
                                setSelect("Select a municipality")
                            }}
                        >
                            {maps.map((e) => (
                                <option value={e.id} key={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </Select> */}
                        <Flex>{options && options}</Flex>
                    </Flex>
                    <Flex alignItems={"center"}>
                        <Text flex={1}>{select}</Text>
                        <Box h={"30px"} height={"fit-content"}>
                            {mapCenter && (
                                <Text fontSize="xs">
                                    Lat: {mapCenter.lat.toFixed(4)}, Lng: {mapCenter.lng.toFixed(4)}, Zoom: {mapZoom}
                                </Text>
                            )}
                        </Box>
                    </Flex>
                </>
            )}
            <Box h={"100%"} w={"100%"} zIndex={0}>
                <MapContainer
                    center={initialCoordinates as LatLngExpression}
                    zoom={initialZoom}
                    style={{ width: "100%", height: "100%", backgroundColor: "white", zIndex: 0 }}
                    maxZoom={20}
                    minZoom={8}
                    doubleClickZoom={false}
                >
                    {loadReliefMap && (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    )}
                    {loadReliefMap && (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="/tiles/{z}/{x}/{y}.png.tile"
                        />
                    )}
                    <MapEventHandler
                        onMapChange={handleMapChange}
                        onDblClick={(latlng) => {
                            if (onDblClick) onDblClick(latlng)
                        }}
                    />
                    <ChangeMapView coordinates={initialCoordinates} zoom={initialZoom} />
                    {loadJSONMap && <GeoJSON key={mapSelect.id} data={mapSelect.geoJson} {...geoJsonOptions} />}
                    {markets &&
                        markets.map((m, i) => (
                            <CustomMarker
                                key={i}
                                position={m.position}
                                popupText={m.popupText}
                                color={m.color}
                                onClick={() => {
                                    m.onClick()
                                }}
                                onDblClick={() => {
                                    if (m.onDblClick) m.onDblClick()
                                }}
                            />
                        ))}
                    {customMarkets && (
                        customMarkets.map(Market => (Market))
                    )}
                </MapContainer>
            </Box>
        </Stack>
    )
}


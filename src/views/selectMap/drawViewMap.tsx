import InteractiveMap from "@/components/InteractiveMap"
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"

export const DrawViewMap = ({
    latitude,
    longitude,
    isOpen,
    onClose
}: {
    latitude: number
    longitude: number
    isOpen: boolean
    onClose: () => void
}) => {
    return (
        <Drawer.Root open={isOpen} >
            <Portal >
                <Drawer.Backdrop />
                <Drawer.Positioner /* padding="4" */ >
                    <Drawer.Content rounded="md">
                        <Drawer.Header>
                            <Drawer.Title>Ubicación</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* TODO: Esto hay que arreglarlo */}
                            {/* <InteractiveMap
                                initLoadReliefMap={true}
                                showConfig={false}
                                markets={[{
                                    position: [
                                        latitude,
                                        longitude
                                    ],
                                    popupText: 'Ubication',
                                    color: 'blue',
                                    onClick: () => { },
                                    onDblClick: () => { },
                                    showAtention: true
                                }]}
                            /> */}
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button>Viajar acá</Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}
import { ContentView } from "@/components/ContentView"
import { MiniMap } from "@/components/MiniMap";
import useConectWS from "@/hooks/useConectWS";
import { Card, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { DrawViewMap } from "./drawViewMap";

export const ViewSelectMap = () => {
    const { data } = useConectWS()
    /* const [data] = useState([
        {
            "json": {
                "address": "avenida  rancho boyeros entre enlace a calle 100 y enlace a camaguey",
                "center_point": {
                    "lat": 23.078204,
                    "lng": -82.396165
                }
            },
            "pairedItem": {
                "item": 0
            }
        },
        {
            "json": {
                "address": "avenida rancho boyeros entre calle 180 (2da) y enlace a camaguey",
                "center_point": {
                    "lat": 23.050087,
                    "lng": -82.396596
                }
            },
            "pairedItem": {
                "item": 1
            }
        },
        {
            "json": {
                "address": "avenida rancho boyeros entre calle 1ra (379) y enlace a camaguey",
                "center_point": {
                    "lat": 23.0308,
                    "lng": -82.389553
                }
            },
            "pairedItem": {
                "item": 2
            }
        },
        {
            "json": {
                "address": "avenida rancho boyeros entre calle 2da (377) y enlace a camaguey",
                "center_point": {
                    "lat": 23.031117,
                    "lng": -82.389515
                }
            },
            "pairedItem": {
                "item": 3
            }
        },
        {
            "json": {
                "address": "avenida rancho boyeros entre calle 3ra (375) y enlace a camaguey",
                "center_point": {
                    "lat": 23.031432,
                    "lng": -82.38948
                }
            },
            "pairedItem": {
                "item": 4
            }
        }
    ]) */

    const { open, onOpen, onClose } = useDisclosure();
    const [select, setSelect] = useState([0,0])

    return (
        <ContentView
            chat={undefined}
            topGradientPercent={0}
            bottomGradientPercent={0}
        >
            {open && <DrawViewMap
                latitude={select[0]}
                longitude={select[1]}
                isOpen={open}
                onClose={onClose}
            />}

            <Stack py={10}>
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 100 * index }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 * index }}
                        style={{
                            height: '100%'
                        }}
                    >
                        <Card.Root width="100%" cursor={'pointer'} transition={'all 0.3s'} _hover={{
                            transition: 'all 0.3s',
                            transform: 'scale(0.95)'
                        }} onClick={()=>{
                            setSelect([item.json.center_point.lat, item.json.center_point.lng])
                            onOpen()
                        }}>
                            <Card.Body>
                                <Flex gap={2} alignItems={"center"}>
                                    <MiniMap
                                        center={[item.json.center_point.lat, item.json.center_point.lng]}
                                    />
                                    <Card.Description>
                                        {item.json.address}
                                    </Card.Description>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </motion.div>
                ))}
            </Stack>
        </ContentView>
    )
}
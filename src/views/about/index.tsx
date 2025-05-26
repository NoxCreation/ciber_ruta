import { ContentView } from "@/components/ContentView"
import { Heading, Link, Stack, Text } from "@chakra-ui/react";

export const ViewAbout = () => {

    return (
        <ContentView
            chat={undefined}
            topGradientPercent={10}
            bottomGradientPercent={10}
        >
            <Stack justifyContent={'center'} textAlign={'center'} h={'100%'}>
                <Heading>Sobre Este Proyecto</Heading>
                <Text>
                    Hola que tal, este es un prototipo del proyecto Ciber Ruta. Las reservaciones hechas desde este sistema no son reales.
                    Todo el material de interacción es usado para presentar las funcionalidades principales del sistema.
                </Text>
                <Text>
                    El objetivo del proyecto es crear un prototipo para la aplicación Ciber Ruta donde los clientes podrán alquilar el servicio
                    de taxis a diferentes choferes a través de una gente de Inteligencia Artificial. Para ello este protitopo simulará todo el
                    proceso y la estructura final de la aplicación móvil final.
                </Text>
                <Text>
                    Si está interesado en la adquisición del sistema real, puede contactarnos a <Link href="mailto:josuecb@yandex.com">josuecb@yandex.com</Link>
                </Text>
                <Text mt={4}>
                    <b>NOX Creation</b> <br /> © 2025 Creado por <a target="_blank" href="https://noxcreation.dev/"> NOX Creation</a>
                </Text>
            </Stack>
        </ContentView>
    )
}
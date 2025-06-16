
import { ContentView } from "@/components/ContentView"
import { Alert, Stack } from "@chakra-ui/react";
import { Fragment } from "react";

export const ViewDriverHome = () => {

    return (
        <ContentView
            topGradientPercent={100}
            bottomGradientPercent={40}
        >
            <Fragment>
                <Stack alignItems={'center'} justifyContent={'center'} h={'100%'} w={'100%'} position={'absolute'} zIndex={5}>
                    <Alert.Root status="warning" w={"fit-content"}>
                        <Alert.Indicator />
                        <Alert.Title>
                            Vista en construcción.
                        </Alert.Title>
                    </Alert.Root>
                </Stack>
            </Fragment>
        </ContentView>
    )
}
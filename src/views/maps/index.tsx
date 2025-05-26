import { ContentView } from "@/components/ContentView"
import { Fragment } from "react";

export const ViewMap = () => {

    return (
        <ContentView
            chat={undefined}
            topGradientPercent={100}
            bottomGradientPercent={40}
        >
            <Fragment>
                MAP
            </Fragment>
        </ContentView>
    )
}
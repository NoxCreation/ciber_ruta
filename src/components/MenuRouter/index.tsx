import { Stack, Tabs } from "@chakra-ui/react"
import useViewChange from "@/hooks/useViewChange";

export const MenuRouter = () => {
    return (
        <Stack alignItems={'center'}>
            <Tabs.Root defaultValue="members" variant={'enclosed'}>
                <Tabs.List>
                    <Tabs.Trigger value="members" onClick={() => useViewChange.getState().setView(0)}>
                        Principal
                    </Tabs.Trigger>
                    <Tabs.Trigger value="projects" onClick={() => useViewChange.getState().setView(1)}>
                        Sobre Este Proyecto
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </Stack>
    )
}
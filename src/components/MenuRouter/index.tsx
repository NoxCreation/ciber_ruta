import { Stack, Tabs } from "@chakra-ui/react"
import useViewChange from "@/hooks/useViewChange";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export const MenuRouter = () => {
    const route = useRouter()

    const onSignOut = async () => {
        await signOut({ callbackUrl: "/auth", redirect: false });
        route.push("/auth")
    };

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
                    <Tabs.Trigger value="login" onClick={() => useViewChange.getState().setView(3)}>
                        Profile
                    </Tabs.Trigger>
                    <Tabs.Trigger value="logout" onClick={onSignOut}>
                        Salir
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </Stack>
    )
}
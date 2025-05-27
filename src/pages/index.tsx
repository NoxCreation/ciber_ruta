import { LayoutApp } from "../components/LayoutApp";
import { Button, Stack } from "@chakra-ui/react";

import TransitionView from "../components/TransitionView";
import { MenuRouter } from "@/components/MenuRouter";
import { useAuth } from "@/components/Providers/AuthProvider";
import ProtectedRoute from "@/components/Providers/ProtectedRoute";

export default function ViewContainer() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <LayoutApp title="Ciber Ruta">
        <Stack
          alignItems={"center"}
          h={"100vh"}
          justifyContent={"center"}
          bg="gray.100"
        >
          <Stack
            py={4}
            w={["100%", "90%", "80%", "40%"]}
            minH={"100vh"}
            overflow="hidden"
            position="relative"
            gap={0}
          >
            {/* Menu Superior */}
            <MenuRouter />

            {/* Vistas */}
            <TransitionView />
          </Stack>
          <Stack>
            <Button
              style={{
                color: "#283c77",
                position: "absolute",
                top: "1rem",
                right: "1rem",
                padding: "8px 16px",
              }}
              variant="outline"
              onClick={() => logout()}
            >
              Log Out
            </Button>
          </Stack>
        </Stack>
      </LayoutApp>
    </ProtectedRoute>
  );
}

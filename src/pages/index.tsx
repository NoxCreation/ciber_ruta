import { LayoutApp } from "../components/LayoutApp";
import {
  Stack,
} from "@chakra-ui/react";

import TransitionView from "../components/TransitionView";
import { MenuRouter } from "@/components/MenuRouter";

export default function ViewContainer() {

  return (
    <LayoutApp title="Ciber Ruta">
      <Stack
        alignItems={'center'}
        h={'100vh'}
        justifyContent={'center'}
        bg="gray.100"
      >
        <Stack
          py={4}
          w={['100%', '90%', '80%', '40%']}
          minH={'100vh'}
          overflow="hidden"
          position="relative"
          gap={0}
        >

          {/* Menu Superior */}
          <MenuRouter />

          {/* Vistas */}
          <TransitionView />

        </Stack>
      </Stack>
    </LayoutApp>
  );
}

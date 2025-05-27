import { LayoutApp } from "@/components/LayoutApp";
import { ViewLogin } from "@/views/login";
import { Stack } from "@chakra-ui/react";

export default function ViewContainer() {
  return (
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
          <ViewLogin />
        </Stack>
      </Stack>
    </LayoutApp>
  );
}

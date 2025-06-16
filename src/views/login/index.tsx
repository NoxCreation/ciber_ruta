import { ContentView } from "@/components/ContentView";
import { Container, Heading, Stack, VStack, Text, HStack, Button, Separator } from "@chakra-ui/react";
import { Logo } from "./logo";
import { BsGoogle } from "react-icons/bs";
import Link from "next/link";
import { FormControl } from "@/components/Form";
import { useEffect, useState } from "react";
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from "next/router";
import flashy from "@pablotheblink/flashyjs";

export const ViewLogin = () => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const onLogin = async (data: any) => {
    setLoading(true)

    await signIn('credentials', {
      ...data,
      redirect: false,
    }).then((e: any) => {
      if (e.ok) {
        flashy.success("¡Autenticado con éxito!", {
          animation: 'bounce'
        });
        //router.push("/", undefined, { locale: router.locale })
      }
      else {
        flashy.error("Las credenciales escritas no son válidas", {
          animation: 'bounce'
        });
      }
      setLoading(false)
    })

    setLoading(false)
  }

  // Si ya esta autenticado lo lanza para la principal
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  return (
    <ContentView
      chat={undefined}
      topGradientPercent={0}
      bottomGradientPercent={0}
    >
      <Container maxW="md" mt={4}>
        <Stack gap="8">
          <VStack gap="4">
            <Logo />
            <VStack gap="2">
              <Heading size="2xl" style={{ color: "#283c77" }}>Acceda a su cuenta</Heading>
              <Text color="fg.muted">¡Bienvenido de nuevo! Inicia sesión para continuar.</Text>
            </VStack>
          </VStack>

          <Stack gap="6">
            <FormControl
              fields={[
                { fieldType: "input", name: "email", label: "Correo", inputType: 'email', isRequired: true },
                { fieldType: "password", name: "password", label: "Contraseña", isRequired: true },
              ]}
              buttonSubmitName="Autenticarme"
              onSubmit={onLogin}
              isLoading={loading}
            />

            <HStack>
              <Separator flex="1" />
              <Text color="fg.muted" textStyle="sm">
                or
              </Text>
              <Separator flex="1" />
            </HStack>

            <HStack gap="4" colorPalette="gray">
              <Button variant="outline" flex="1" onClick={() => {/*login()*/ }} style={{ color: "#283c77" }}>
                <BsGoogle />
                Google
              </Button>
            </HStack>

          </Stack>

          <Separator variant="dashed" />

          <Text textStyle="sm" color="fg.muted" textAlign="center">
            ¿No tiene cuenta? <Link href="/register">Regístrate</Link>
          </Text>
        </Stack>
      </Container>
    </ContentView>
  );
};

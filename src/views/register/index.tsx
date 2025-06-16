import { ContentView } from "@/components/ContentView";
import { Container, Heading, Stack, VStack, Text, HStack, Button, Separator } from "@chakra-ui/react";
import { Logo } from "./logo";
import { BsGoogle } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";
import { FormControl } from "@/components/Form";
import usePasswordStrength from "@/hooks/usePasswordStrength";
import flashy from '@pablotheblink/flashyjs';
import { useRouter } from "next/router";

export const ViewRegister = () => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { evaluatePassword } = usePasswordStrength();

  const onRegister = async (data: any) => {
    setLoading(true)
    const {
      password,
      confirm_password
    } = data

    // Comprobando cuan fuerte es la contraseña
    const { score, errors } = evaluatePassword(password)
    if (score != 100) {
      flashy.error(`Contraseña muy débil, debe tener: ${errors.join(", ")}`, {
        animation: 'bounce'
      });
      return
    }

    // Comprobando la confirmación
    if (password != confirm_password) {
      flashy.error(`La contraseña de confirmación no coincide con la contraseña`, {
        animation: 'bounce'
      });
      return
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "first_name": data.first_name,
      "last_name": data.last_name,
      "email": data.email,
      "role": data.role,
      "password": data.password,
      "confirm_password": data.confirm_password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    } as any

    const response = await fetch("/api/auth/register", requestOptions)
    if (response.status == 200) {
      flashy.success((await response.json()).detail, {
        animation: 'bounce'
      });
      router.push("/login")
    }
    else {
      flashy.error((await response.json()).detail, {
        animation: 'bounce'
      });
    }

    setLoading(false)
  }

  return (
    <ContentView
      chat={undefined}
      topGradientPercent={0}
      bottomGradientPercent={0}
    >
      <Container maxW="md" py={{ base: '12', md: '24' }}>
        <Stack gap="8">
          <VStack gap="12">
            <Logo />
            <VStack gap="2">
              <Heading size="2xl" style={{ color: "#283c77" }}>Regístro en CibeRuta</Heading>
              <Text color="fg.muted">Regístrese en CibeRuta</Text>
            </VStack>
          </VStack>

          <Stack gap="6">
            <FormControl
              fields={[
                { fieldType: "input", name: "first_name", label: "Nombre", inputType: 'text', isRequired: true },
                { fieldType: "input", name: "last_name", label: "Apellidos", inputType: 'text', isRequired: true },
                { fieldType: "input", name: "email", label: "Correo", inputType: 'email', isRequired: true },
                {
                  fieldType: "tabSelect", name: "role", label: "Rol", options: [
                    { label: "Cliente", value: 'client' },
                    { label: "Chofer", value: 'drive' }
                  ],
                  isRequired: true
                },
                { fieldType: "password", name: "password", label: "Contraseña", isRequired: true },
                { fieldType: "password", name: "confirm_password", label: "Confirme Contraseña", isRequired: true },
              ]}
              buttonSubmitName="Registrarme"
              onSubmit={onRegister}
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
            ¿Ya tengo cuenta? <Link href="/login">Autenticarme</Link>
          </Text>
        </Stack>
      </Container>
    </ContentView>
  );
};

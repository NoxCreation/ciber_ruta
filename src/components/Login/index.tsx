import { Logo } from "./logo";
/* import { PasswordInput } from "@/components/ui/password-input"; */
import {
  Button,
  Container,
  Field,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { BsArrowRight, BsGoogle } from "react-icons/bs";
import { useAuth } from "../../Providers/AuthProvider";

export const Login = () => {
  const { login, profile } = useAuth();

  return (
    <Container maxW="md" py={{ base: '12', md: '24' }}>
      <Stack gap="8">
        <VStack gap="12">
          <Logo />
          <VStack gap="2">
            <Heading size="2xl" style={{ color: "#283c77" }}>Sign in to your account</Heading>
            <Text color="fg.muted">Welcome back! Please sign in to continue.</Text>
          </VStack>
        </VStack>

        <Stack gap="6">
          <HStack gap="4" colorPalette="gray">
            {profile ? (
              <Button
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                  padding: "10px",
                  justifyContent: "center",
                }}
                variant="outline"
              >
                <Stack
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {profile?.picture ? (
                    <img
                      src={profile?.picture}
                      alt="user image"
                      style={{ borderRadius: "20px", width: "28px" }}
                    />
                  ) : (
                    <BsGoogle />
                  )}
                  <p>Name: {profile.name}</p>
                </Stack>
              </Button>
            ) : <Button variant="outline" flex="1" onClick={() => login()} style={{ color: "#283c77" }}>
              <BsGoogle />
              Google
            </Button>}
            {/* <Button variant="outline" flex="1">
              <BsGithub />
              Github
            </Button> */}
          </HStack>

          <HStack>
            <Separator flex="1" />
            <Text color="fg.muted" textStyle="sm">
              or
            </Text>
            <Separator flex="1" />
          </HStack>

          <Stack gap="6">
            <Field.Root>
              <Field.Label style={{ color: "#1f2d59" }}>Email address</Field.Label>
              <Input placeholder="me@example.com" />
            </Field.Root>
            <Button style={{ background: "#283c77" }}>
              Continue <BsArrowRight />
            </Button>
          </Stack>
        </Stack>

        <Separator variant="dashed" />

        <Text textStyle="sm" color="fg.muted" textAlign="center">
          Don&apos;t have an account? <Link href="#">Sign up</Link>
        </Text>
      </Stack>
    </Container>
  );
};

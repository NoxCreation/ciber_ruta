import { Logo } from "./logo";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Button,
  Container,
  Checkbox,
  Field,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsGoogle } from "react-icons/bs";
import { useAuth } from "../Providers/AuthProvider";

export const Login = () => {  
  const { login, profile } = useAuth();

  return (
    <Container maxW="md" py={{ base: "12", md: "24" }}>
      <Stack gap="8">
        <Stack display="flex" alignItems="center">
          <Logo />
        </Stack>

        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading
            size={{ base: "2xl", md: "3xl" }}
            style={{ color: "#283c77" }}
          >
            Welcome back
          </Heading>
          <Text color="fg.muted">Start using Chakra in your projects</Text>
        </Stack>

        <Stack gap="6">
          <Stack gap="5">
            <Field.Root>
              <Field.Label style={{ color: "#1f2d59" }}>Email</Field.Label>
              <Input type="email" />
            </Field.Root>
            <Field.Root>
              <Field.Label style={{ color: "#1f2d59" }}>Password</Field.Label>
              <PasswordInput />
            </Field.Root>
          </Stack>
          <HStack justify="space-between">
            <Checkbox.Root defaultChecked>
              <Checkbox.HiddenInput />
              <Checkbox.Control
                style={{ background: "#283c77", borderColor: "#283c77" }}
              />
              <Checkbox.Label style={{ color: "#1f2d59" }}>
                Remember me
              </Checkbox.Label>
            </Checkbox.Root>
            <Button variant="plain" size="sm" style={{ color: "#1f2d59" }}>
              Forgot password
            </Button>
          </HStack>
          <Stack gap="4">
            <Button style={{ background: "#283c77" }}>Sign in</Button>
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
            ) : (
              <Button
                style={{ color: "#283c77" }}
                variant="outline"
                onClick={() => login()}
              >
                <BsGoogle />
                Sign in with Google
              </Button>
            )}
          </Stack>
        </Stack>

        <Text textStyle="sm" color="fg.muted" textAlign="center">
          {"Don't have an account?"}{" "}
          <Link variant="underline" href="#">
            Sign up
          </Link>
        </Text>
      </Stack>
    </Container>
  );
};

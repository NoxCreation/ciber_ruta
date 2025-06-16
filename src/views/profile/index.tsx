import { Logo } from "@/views/login/logo";
import {
  Container,
  Field,
  Heading,
  Stack,
} from "@chakra-ui/react";

export const ViewProfile = () => {

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
            Profile
          </Heading>
        </Stack>

        <Stack gap="6">
          <Stack
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* {profile?.picture ? (
              <img
                src={profile?.picture}
                alt="user image"
                style={{ borderRadius: "50px", width: "96px" }}
              />
            ) : (
              <BsGoogle />
            )} */}
          </Stack>
          <Stack gap="5">
            <Field.Root>
              <Field.Label style={{ color: "#1f2d59" }}>Name</Field.Label>
              {/* <Input disabled type="text" value={profile?.name || ""} /> */}
            </Field.Root>
            <Field.Root>
              <Field.Label style={{ color: "#1f2d59" }}>Email</Field.Label>
              {/* <Input disabled type="email" value={profile?.email || ""} /> */}
            </Field.Root>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

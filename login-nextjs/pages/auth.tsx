import { useState } from "react";
import type { NextPage } from "next";
import { signIn, getProviders } from "next-auth/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Text,
  RadioGroup,
  Center,
  HStack,
  Radio,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import Router from "next/router";

const Background = ({ children }: any) => (
  <Box
    display="flex"
    flex="1 1 auto"
    justifyContent="center"
    alignItems="center"
    backgroundColor='white'
    width="100%"
    height="100vh"
    color="black"
  >
    {children}
  </Box>
);

interface IDivicerProps {
  word?: string;
}

const Divider = ({ word }: IDivicerProps) => {
  return (
    <>
      {word ? (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mb={4}
        >
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
          <Text>Or</Text>
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
        </Flex>
      ) : (
        <Box
          w="100%"
          border="solid"
          borderBottom={2}
          rounded="full"
          mb={6}
        ></Box>
      )}
    </>
  );
};

const Auth: NextPage = ({ providers }: any) => {
  const [authType, setAuthType] = useState("Login");
  const oppAuthType: { [key: string]: string } = {
    Login: "Register",
    Register: "Login",
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Student");

  const ProvidersButtons = ({ providers }: any) => (
    <Flex direction="column" w="100%">
      {Object.values(providers).map(
        (provider: any) =>
          provider.name !== "Credentials" && (
            <Button
              key={provider.name}
              mb={4}
              bg={"#24292E"}
              color={"white"}
              _hover={{ bg: "#24292E90" }}
              type="submit"
              onClick={() => {
                signIn(provider.id, {
                  callbackUrl: `${process.env.URL_DEV}/`,
                });
              }}
            >
              <Box>Sign in with {provider.name}</Box>
            </Button>
          )
      )}
    </Flex>
  );

  const redirectToHome = () => {
    const { pathname } = Router;
    if (pathname === "/auth") {
      // TODO: redirect to a form to fill
      Router.push("/");
    }
  };

  const registerUser = async () => {
    const res = await axios
      .post(
        "/api/register",
        { username, email, password, status },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(async () => {
        await loginUser();
        redirectToHome();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(res);
  };

  const loginUser = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl: `${window.location.origin}`,
    });

    res.error ? console.log(res.error) : redirectToHome();
  };

  const formSubmit = (actions: any) => {
    actions.setSubmitting(false);
    authType === "Login" ? loginUser() : registerUser();
  };

  return (
    <Background>
      <Box
        w="420px"
        rounded="md"
        bg="#f3f5f5"
        p={12}
      >
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Heading size="xl">{authType}</Heading>
          <Text fontSize="sm" mb={6}>
            {authType === "Login"
              ? "Not registered yet? "
              : "Already have an account? "}
            <button onClick={() => setAuthType(oppAuthType[authType])}>
              <Text as="u">{oppAuthType[authType]}</Text>
            </button>
          </Text>

          <Divider />

          <ProvidersButtons providers={providers} />

          <Divider word="Or" />

          <Formik
            initialValues={{}} // { email: "", password: "" }
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(_, actions) => {
              formSubmit(actions);
            }}
          >
            {(props) => (
              <Form style={{ width: "100%" }}>
                <Box display="flex" flexDirection="column" w="100%" mb={4}>
                  {authType === "Register" && (
                    <Field name="username">
                      {() => (
                        <FormControl isRequired mb={6}>
                          <FormLabel htmlFor="username">Username:</FormLabel>
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            background={"teal.600"}
                            color='white'
                            focusBorderColor='black'
                            _placeholder={{ opacity: 1, color: 'gray.400' }}
                          />
                        </FormControl>
                      )}
                    </Field>
                  )}
                  <Field name="email">
                    {() => (
                      <FormControl isRequired mb={6}>
                        <FormLabel htmlFor="email">Email:</FormLabel>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          background={"teal.600"}
                          color='white'
                          focusBorderColor='black'
                          _placeholder={{ opacity: 1, color: 'gray.400' }}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {() => (
                      <FormControl isRequired mb={6}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          background={"teal.600"}
                          color='white'
                          focusBorderColor='black'
                          _placeholder={{ opacity: 1, color: 'gray.400' }}
                        />
                      </FormControl>
                    )}
                  </Field>
                  {authType === "Register" && (
                    <Field name="status">
                      {() => (
                        <FormControl isRequired mb={3}>
                          <FormLabel htmlFor="text">Statut</FormLabel>
                          <RadioGroup onChange={setStatus} value={status}>
                            <Center>
                              <HStack spacing='24px'>
                                <Radio colorScheme='teal' value='Student'>Student</Radio>
                                <Radio colorScheme='teal' value='Teacher'>Teacher</Radio>
                              </HStack>
                            </Center>
                          </RadioGroup>
                        </FormControl>
                      )}
                    </Field>)}
                  <Button
                    mt={6}
                    bg="teal.400"
                    _hover={{ bg: "teal.200" }}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {authType}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Flex>
      </Box>
    </Background>
  );
};

export default Auth;

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),

    },
  };
}

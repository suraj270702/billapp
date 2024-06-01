import {
  Card,
  CardBody,
  Center,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Input,
  Button,
  Flex
} from "@chakra-ui/react";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { MyContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import Toggle from "./Toggle";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { auth, setAuth } = useContext(MyContext);
  const navigate = useNavigate();

  const handleAuth = (data) => {
    setTimeout(() => {
      setAuth(true);
      navigate("/");
    }, 2000);
  };

  return (
    
    <Flex height={"100vh"} alignItems={"center"} justifyContent={"center"}>
      <Card width={["90%", "600px"]}>
        <CardBody>
          <Heading color={"gray"} textAlign={"center"} mb={4}>Login        <Toggle /></Heading>
          <Box>
            <form onSubmit={handleSubmit(handleAuth)}>
              <FormControl mb={4} isInvalid={errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email ? (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>We'll never share your email.</FormHelperText>
                )}
              </FormControl>
              <FormControl mb={4} isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password ? (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>We'll never save your password.</FormHelperText>
                )}
              </FormControl>
              <Button type="submit" width={"100%"} mt={4} colorScheme="green" size={["md", "lg"]} fontSize={["medium", "larger"]}>
                Login
              </Button>
            </form>
          </Box>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Login;

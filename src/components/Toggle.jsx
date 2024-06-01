
import {
    VStack,
    IconButton,
    useColorMode,
    useColorModeValue,
    Heading,
  } from "@chakra-ui/react";
  import { BsSun, BsMoon } from "react-icons/bs";
  
  function Toggle() {
    
    const { toggleColorMode } = useColorMode();
    return (
      <VStack>
        {useColorModeValue(
          <Heading>Light Mode</Heading>,
          <Heading>Dark Mode</Heading>
        )}
        <IconButton
          aria-label="Mode Change"
          variant="outline"
          colorScheme="black"
          size="lg"
          icon={useColorModeValue(<BsMoon />, <BsSun />)}
          onClick={toggleColorMode}
        />
      </VStack>
    );
  }
  
  export default Toggle;
  
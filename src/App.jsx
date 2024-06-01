import { ChakraProvider,extendTheme } from "@chakra-ui/react"
import Login from "./components/Login"
import MainPage from "./components/MainPage"
import {  MultiSelectTheme } from 'chakra-multiselect'




function App() {
  
  const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
  };
  
  
  const theme = extendTheme({ config });
  

  return (
    <>
   
   <ChakraProvider theme={theme} >
      <MainPage />
    </ChakraProvider>
   
     
    </>
  )
}

export default App

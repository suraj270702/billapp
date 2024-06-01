import { Box, Button, Flex } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import React from "react";
import SaleOrderModal from "./SaleOrderModal";
import ActiveSalesOrder from "./ActiveSalesOrder";
import { Outlet,useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <Flex alignItems={"center"} justifyContent={"center"} mt={10}>
      <Box width={["90%"]}>
        <Flex alignItems={"center"} justifyContent={"space-between"} wrap={"wrap"} gap={[5,0]}>
        <Flex alignItems={"center"} gap={5}>
            <Button colorScheme="red" onClick={()=>navigate("/")}>Active Orders</Button>
            <Button colorScheme="green" onClick={()=>navigate("/complete-order")}>Completed Orders</Button>


        </Flex>
        <SaleOrderModal />
        </Flex>
        <Box mt={10}>
            <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default MainPage;

import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
} from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BsThreeDots } from "react-icons/bs";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import EditModal from "./EditModal";
const CompleteSalesOrder = () => {
  const [customersMapping, setCustomersMapping] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
    setIsModalOpen(false);
  };
  const fetchData = async () => {
    try {
      let response = await axios.get("http://localhost:3030/orders?status=complete");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomersData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customers");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchData,
  });

  const { data: customersData } = useQuery({ queryKey: ["customers"],queryFn:fetchCustomersData });

  useEffect(() => {
    console.log(customersData);
    let mappings = customersData?.reduce((acc, customer) => {
      acc[customer.id] = customer.name;
      return acc;
    }, {});
    setCustomersMapping(mappings);
  }, [customersData]);

  return (
    <>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div>
          <TableContainer border={"1px solid"} borderColor={"gray"}>
            <Table size={["sm", "md"]} variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>customer name</Th>
                  <Th>rate</Th>
                  <Th>Edit View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, i) => (
                  <Tr key={i}>
                    <Td>{item.id}</Td>
                    <Td>
                      {customersMapping && customersMapping[item?.customer_id]}
                    </Td>
                    <Td>
                      {item.items.reduce(
                        (acc, curr) => acc + curr.price * curr.quantity,
                        0
                      )}
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<BsThreeDots />}
                        ></MenuButton>
                       <MenuList>
                          <MenuItem onClick={()=>handleEditClick(item.id)}>{item.status==="complete" ? "view" : "edit"}</MenuItem>
                          
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {
            selectedOrderId && <EditModal orderId={selectedOrderId} isModalOpen={isModalOpen} customClose={handleCloseModal} />
          }
        </div>
      )}
    </>
  );
};

export default CompleteSalesOrder;

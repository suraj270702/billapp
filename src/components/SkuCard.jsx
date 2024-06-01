import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const SkuCard = ({name,price,quantityRemaining,id,setSkuItems,skuItems,displayQuantity,status}) => {
  const [sellingPrice,setSellingPrice] = useState(price)
  const [quantity,setQuantity] = useState(quantityRemaining)
  const [skuExists,setSkuExists] = useState(false)
  useEffect(()=>{
    let isSkuExits = skuItems.some((item)=>item.sku_id===id)
    setSkuExists(isSkuExits)
  },[skuItems])
  const addSkuItems=()=>{
      const item={price:parseInt(sellingPrice),quantity:parseInt(quantity),sku_id:id}
      setSkuItems((prev)=>[...prev,item])
  }
  const removeSkuItems=()=>{
    let filteredData=skuItems.filter((item,i)=>item.sku_id!==id)
    setSkuItems(filteredData)
  }
  
  return (
    <Card mb={10}>
      <CardHeader>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Heading size="md">SKU {name}</Heading>
          <Badge p={3}>Rate &#8377; {price}</Badge>
        </Flex>
      </CardHeader>

      <CardBody>
        <Flex
          alignItems={"center"}
          justifyContent={["space-between"]}
          flexDirection={["column", "row"]}
          gap={[5, 10]}
        >
          <FormControl>
            <FormLabel>Selling Rate</FormLabel>
            <Input type="number" disabled={status==="complete"} placeholder="Enter a selling rate" value={sellingPrice} onChange={(e)=>setSellingPrice(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Total Quantity</FormLabel>
            <Input type="number" disabled={status==="complete"} placeholder="Enter a quantity" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
          </FormControl>
        </Flex>
        <Box mt={10}>
        <Flex alignItems={"center"} justifyContent={"space-between"} flexDirection={["column","row"]}>
        <Badge variant="subtle" colorScheme="green" p={3} borderRadius={10}>
          Total Quantity Remaining {displayQuantity}
        </Badge>
        {
          !skuExists ? (
            <Button onClick={addSkuItems} colorScheme={"blue"} isDisabled={status==="complete"}>Add</Button>
          ):(
            <Button onClick={removeSkuItems} colorScheme={"blue"} isDisabled={status==="complete"}>Remove</Button>
          )
        }
        </Flex>
      </Box>
      </CardBody>
      
    </Card>
  );
};

export default SkuCard;

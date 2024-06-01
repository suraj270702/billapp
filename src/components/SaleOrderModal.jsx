import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Select } from "chakra-react-select";
import SkuCard from "./SkuCard";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import ShortUniqueId from "short-unique-id";
const SaleOrderModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productOptions, setProductOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState([]);
  const [prevSelectedOptions, setPrevSelectedOptions] = useState([]);
  const [customers,setCustomers] = useState([])
  const [customerId,setCustomerId]=useState()
  const [skuItems,setSkuItems] = useState([])
  const toast = useToast()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const uid = new ShortUniqueId({ length: 10 });

  const queryClient = useQueryClient()

  const submitOrder = async (orderData) => {
    const response = await axios.post("http://localhost:3030/orders", orderData);
    return response.data;
  };

  const onSubmit = async(data) => {
    console.log(data)
    
    const uploadData={id:uid.rnd(),customer_id:customerId.value,items:skuItems,paid:false,invoice_no:"Invoice"+" "+uid.rnd(),invoice_date:new Date().toISOString(),status:"active",products:data.products}
    console.log(uploadData)

    mutation.mutate(uploadData)

  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/products");
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const fetchCustomerData=async()=>{
    try{
      const response = await axios.get("http://localhost:3030/customers")
      return response.data

    }
    catch(error){
      throw new Error(error.message)
    }
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchData,
  });

  const { data:customerData, isError:isCustomerFetchingError, isLoading:isCustomerLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomerData,
  });

  useEffect(() => {
    if (data) {
      const filteredData = data.map((item, i) => ({
        label: item.name,
        value: item.id,
      }));
      setProductOptions(filteredData);
    }
  }, [data]);

  useEffect(()=>{
   if(customerData){
    let filteredData = customerData.map((item,i)=>({
      label:item.name,
      value:item.id
    }))
    setCustomers(filteredData)
   }
  },[customerData])

  useEffect(() => {
    // Get the ID of the last selected product
    let productId;
    if (selectedOptions.length > 0) {
      productId = selectedOptions[selectedOptions.length - 1].value;
    }

    if (selectedOptions.length < prevSelectedOptions.length) {
      const removedProductId = prevSelectedOptions.find(
        (option) => !selectedOptions.some((o) => o.value === option.value)
      ).value;
      const removedProduct = data.find((item) => item.id === removedProductId);
      if (removedProduct) {
        removedProduct.sku.forEach((sku) => {
          setSelectedSKU((prevSelectedSKU) =>
            prevSelectedSKU.filter((selectedSku) => selectedSku !== sku)
          );
        });
      }
    }

    if (data && selectedOptions.length > 0) {
      const singleProduct = data.find((item) => item.id === productId);
      if (singleProduct) {
        singleProduct.sku.forEach((sku) => {
          setSelectedSKU((prevSelectedSKU) => [...prevSelectedSKU, sku]);
        });
      }
    } else {
      setSelectedSKU([]);
    }

    setPrevSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  const mutation = useMutation({
    mutationFn:submitOrder,
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast({
        title:"Order Created Successfully",
        status:"success",
        duration:3000,
        isClosable:true
      })
    }
  })

  return (
    <>
      <Button leftIcon={<MdAdd />} onClick={onOpen} colorScheme={"green"}>
        Sale Order
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={"90%"}>
          <ModalHeader>Sale Order</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={5} isInvalid={errors.products}>
                <FormLabel>All Products</FormLabel>
                <Controller
                  name="products"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={productOptions}
                      placeholder="Select Products..."
                      variant="outline"
                      {...field}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions);
                        setSelectedOptions(selectedOptions);
                      }}
                    />
                  )}
                />
                {errors.products && (
                  <FormErrorMessage>This Field is Required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={5} isInvalid={errors.name}>
                <FormLabel>Select Customer</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      
                      options={customers}
                      placeholder="Select Customer..."
                      variant="outline"
                      {...field}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions);
                        setCustomerId(selectedOptions);
                      }}
                    />
                  )}
                />
                {errors.name && (
                  <FormErrorMessage>This Field is Required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl>
                <Button type="submit" colorScheme={"green"}>
                  Submit
                </Button>
              </FormControl>
            </form>

            <Box>
              {selectedSKU.length > 0 &&
                selectedSKU.map((item, i) => (
                  <SkuCard
                    key={i}
                    id={item.id}
                    name={item.product}
                    price={item.max_retail_price}
                    quantityRemaining={item.quantity_in_inventory}
                    setSkuItems={setSkuItems}
                    skuItems={skuItems}
                    displayQuantity={item.quantity_in_inventory}
                  />
                ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={"solid"}
              colorScheme={"red"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SaleOrderModal;

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Select } from "chakra-react-select";
import SkuCard from "./SkuCard";
const EditModal = ({ orderId, isModalOpen, customClose }) => {
  const [productOptions, setProductOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState([]);
  const [prevSelectedOptions, setPrevSelectedOptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState();
  const [skuItems, setSkuItems] = useState([]);
  const [orderStatus,setOrderStatus] = useState({})
  //const [skuItemsPrev, setSkuItemsPrev] = useState([]);
  const updateOrder = async (updatedData) => {
    const response = await axios.put(
      `http://localhost:3030/orders/${orderId}`,
      updatedData
    );
    return response.data;
    
  };

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/orders/${orderId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  };
  const mutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      console.log("from on success")
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: orderDetails } = useQuery({
    queryKey: ["order"],
    queryFn: getData,
  });
  const onSubmit = async(data) => {
    console.log(data);
    const uploadData = {
      id: orderDetails?.id,
      customer_id: customerId.value,
      items: skuItems,
      paid: false,
      invoice_no: orderDetails?.invoice_no,
      invoice_date: orderDetails?.invoice_date,
      status: orderStatus.value,
      products: data.products,
    };
    mutation.mutate(uploadData);
    console.log("from on submit")
  };
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/products");
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customers");
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchData,
  });

  const {
    data: customerData,
    isError: isCustomerFetchingError,
    isLoading: isCustomerLoading,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomerData,
  });

  useEffect(() => {
    if (data) {
      const filteredData = data?.map((item, i) => ({
        label: item.name,
        value: item.id,
      }));
      setProductOptions(filteredData);
    }
  }, [data]);

  useEffect(() => {
    if (customerData) {
      let filteredData = customerData.map((item, i) => ({
        label: item.name,
        value: item.id,
      }));
      setCustomers(filteredData);
    }
  }, [customerData]);

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
  useEffect(() => {
    if (orderDetails) {
      setSelectedOptions(orderDetails?.products);
      setValue("products", orderDetails?.products);
      let customerDetails = customerData.find(
        (item, i) => item.id === orderDetails?.customer_id
      );
      console.log(customerDetails);
      setCustomerId({ label: customerDetails.name, value: customerDetails.id });
      setValue("name", {
        label: customerDetails.name,
        value: customerDetails.id,
      });
      setSkuItems(orderDetails?.items);
      setValue("status",{label:"Active",value:"active"})
    }
  }, [orderDetails]);

 

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={customClose}>
        <ModalOverlay />
        <ModalContent maxW={"90%"}>
          <ModalHeader>{orderDetails?.status==="complete" ? "Order Details" : "Edit Order"}</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} >
              <FormControl mb={5} isInvalid={errors.products} isDisabled={orderDetails?.status==="complete"}>
                <FormLabel>All Products</FormLabel>
                <Controller
                  name="products"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={productOptions}
                      value={selectedOptions}
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
              <FormControl mb={5} isInvalid={errors.name} isDisabled={orderDetails?.status==="complete"}>
                <FormLabel>Select Customer</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      options={customers}
                      placeholder="Select Customer..."
                      value={customerId}
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
              <FormControl mb={5} isInvalid={errors.name} isDisabled={orderDetails?.status==="complete"}>
                <FormLabel>Order Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      options={[{label:"Active",value:"active"},{label:"Completed",value:"complete"}]}
                      placeholder="Change Order Status..."
                      
                      variant="outline"
                      {...field}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions);
                        setOrderStatus(selectedOptions);
                      }}
                    />
                  )}
                />
                {errors.name && (
                  <FormErrorMessage>This Field is Required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isDisabled={orderDetails?.status==="complete"}>
                <Button type="submit" colorScheme={"green"} isDisabled={orderDetails?.status==="complete"}>
                  Submit
                </Button>
              </FormControl>
            </form>
            <Box mt={10}>
              {selectedSKU.length > 0 &&
                selectedSKU.map((item, i) => {
                  let singleItem = skuItems.find(
                    (single, i) => single.sku_id === item.id
                  );
                  console.log("from sku map", singleItem);
                  if (singleItem) {
                    return (
                      <SkuCard
                        status={orderDetails?.status}
                        key={i}
                        id={item.id}
                        name={item.product}
                        price={singleItem.price}
                        quantityRemaining={singleItem.quantity}
                        displayQuantity={item.quantity_in_inventory}
                        setSkuItems={setSkuItems}
                        skuItems={skuItems}
                      />
                    );
                  } else {
                    return (
                      <SkuCard
                        key={i}
                        id={item.id}
                        name={item.product}
                        price={item.max_retail_price}
                        quantityRemaining={item.quantity_in_inventory}
                        displayQuantity={item.quantity_in_inventory}
                        setSkuItems={setSkuItems}
                        skuItems={skuItems}
                      />
                    );
                  }
                })}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;

import React, { useCallback, useState } from "react";
import {View, Text, FlatList} from 'react-native'
import axios from 'axios'
import baseURL from "../../assets/common/baseurl";
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import OrderCard from "../../Shared/OrderCard";
const Orders = (props) => {
    const [orderList, setOrderList] = useState()

    useFocusEffect(
        useCallback(
            () => {
                    getOrders();
                return () => {
                    setOrderList()
                }
            },[],
        )
    )
    console.log(`${baseURL}orders`)
    const getOrders = () => {
        axios.get(`${baseURL}orders`)
        .then((x) => {
            setOrderList(x.data)
        })
        .catch((error) => console.log(error))
    }

    //  delete Order
    const deleteOrder = (id) => {
        AsyncStorage.getItem("jwt").then((token) => {
            axios
                .delete(`${baseURL}orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    
                    setOrderList(currentList => currentList.filter(item => item.id !== id));
                })
                .catch((error) => console.log(error));
        });
    }

    console.log(orderList)
    return (
        
        <View>
            <FlatList 
                data={orderList}
                renderItem={({item}) => ( 
                   
                    // <Text>{item.shippingAddress1}</Text>
                    <OrderCard item={item}  deleteOrder={() => deleteOrder(item.id)}/>
                    )
                }
                keyExtractor={(item) => item.id}    
            />
            
        </View>
    )
} 

export default Orders;  
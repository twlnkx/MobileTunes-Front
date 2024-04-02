import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Image } from 'react-native';
import { Container } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios'
import baseURL from "../../assets/common/baseurl"

import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"
import OrderCard from '../../Shared/OrderCard';

const UserProfile = (props) => {
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState('')
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false ||
                context.stateUser.isAuthenticated === null
            ) {
                navigation.navigate("Login")
            }
            console.log("context", context.stateUser.user)
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))
            axios
                .get(`${baseURL}orders`)
                .then((x) => {
                    const data = x.data;
                    console.log(data)
                    const userOrders = data.filter(
                        (order) =>
                            // console.log(order)
                            order.user ? (order.user._id === context.stateUser.user.userId) : false

                    );
                    setOrders(userOrders);
                })
                .catch((error) => console.log(error))
            return () => {
                setUserProfile();
                setOrders()
            }

        }, [context.stateUser.isAuthenticated]))

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                {userProfile && userProfile.image ? (
                    <Image
                        source={{ uri: userProfile.image }}
                        style={styles.profileImage}
                    />
                ) : null}
                <Text style={{ fontSize: 30 }}>
                    {userProfile ? userProfile.name : ""}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ margin: 10 }}>
                        Email: {userProfile ? userProfile.email : ""}
                    </Text>
                    <Text style={{ margin: 10 }}>
                        Phone: {userProfile ? userProfile.phone : ""}
                    </Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    <Button title={"Sign Out"} onPress={() => [
                        AsyncStorage.removeItem("jwt"),
                        logoutUser(context.dispatch)
                    ]} />
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={styles.buttonContainer}>
                        <Button title={"Edit Profile"} onPress={() => navigation.navigate("UpdateProfile")} />
                    </View>
                </View>

                <View style={styles.order}>
                    <Text style={{ fontSize: 20 }}>My Orders</Text>
                    <View>
                        {orders ? (
                            orders.map((order) => {
                                return <OrderCard key={order.id} item={order} select="false" />;
                            })
                        ) : (
                            <View style={styles.order}>
                                <Text>You have no orders</Text>
                            </View>
                        )}
                    </View>
                </View>

            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    subContainer: {
        alignItems: "center",
        marginTop: 60,
        marginLeft: 50

    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    order: {
        marginTop: 50,
        alignItems: "center",
        marginBottom: 60
    },
    buttonContainer: {
        marginBottom: 20
    }
})

export default UserProfile

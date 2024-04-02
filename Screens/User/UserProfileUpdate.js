import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Image, TextInput } from 'react-native';
import { Container } from "native-base"
import { useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios'
import baseURL from "../../assets/common/baseurl"

import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"

const UpdateProfile = () => {
    const context = useContext(AuthGlobal)
    const [updatedProfile, setUpdatedProfile] = useState({})
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        // Pre-fill the form fields with the current user profile information
        setUpdatedProfile(context.stateUser.user)
    }, [])

    const handleUpdateProfile = () => {
        setLoading(true)
        AsyncStorage.getItem("jwt")
            .then((res) => {
                axios.put(`${baseURL}users/${context.stateUser.user.userId}`, updatedProfile, {
                    headers: { Authorization: `Bearer ${res}` },
                })
                .then((response) => {
                    // Handle success, maybe show a success message or navigate back to profile screen
                    console.log("Profile updated successfully")
                    navigation.goBack()
                })
                .catch((error) => {
                    // Handle error
                    console.log("Error updating profile:", error)
                })
                .finally(() => setLoading(false))
            })
            .catch((error) => {
                console.log("Error retrieving JWT token:", error)
                setLoading(false)
            })
    }

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <Text style={{ fontSize: 30 }}>Update Profile</Text>
                <TextInput
                    style={styles.input}
                    value={updatedProfile.name}
                    onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, name: text })}
                    placeholder="Name"
                />
                <TextInput
                    style={styles.input}
                    value={updatedProfile.email}
                    onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, email: text })}
                    placeholder="Email"
                />
                <TextInput
                    style={styles.input}
                    value={updatedProfile.phone}
                    onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, phone: text })}
                    placeholder="Phone"
                />
                <Button
                    title={loading ? "Updating..." : "Update Profile"}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                />
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
        paddingHorizontal: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
        padding: 10,
        marginBottom: 20
    }
})

export default UpdateProfile

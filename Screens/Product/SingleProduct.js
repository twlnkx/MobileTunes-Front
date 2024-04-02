import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Center, Heading } from 'native-base';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const SingleProduct = ({ route }) => {
    const [item, setItem] = useState(route.params.item);
    const [availability, setAvailability] = useState('');
    const [availabilityText, setAvailabilityText] = useState("");
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [loading, setLoading] = useState(true); // State for loading indicator

    useEffect(() => {
        if (item.countInStock === 0) {
            setAvailability(<TrafficLight unavailable />);
            setAvailabilityText("Unavailable");
        } else if (item.countInStock <= 5) {
            setAvailability(<TrafficLight limited />);
            setAvailabilityText("Limited Stock");
        } else {
            setAvailability(<TrafficLight available />);
            setAvailabilityText("Available");
        }

        loadReviews();

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        };
    }, []);

    const loadReviews = async () => {
        try {
            const reviewsData = await AsyncStorage.getItem("reviews");
            if (reviewsData !== null) {
                setReviews(JSON.parse(reviewsData));
            }
        } catch (error) {
            console.error("Error loading reviews: ", error);
        } finally {
            setLoading(false); // Set loading to false after reviews are loaded
        }
    };

    const addReview = async () => {
        if (newReview.trim() !== "") {
            const updatedReviews = [...reviews, newReview];
            setReviews(updatedReviews);
            setNewReview("");
            await AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
        }
    };

    const editReview = (index, review) => {
        setEditingIndex(index);
        setNewReview(review);
    };

    const updateReview = async (index) => {
        if (newReview.trim() !== "") {
            const updatedReviews = [...reviews];
            updatedReviews[index] = newReview.trim();
            setReviews(updatedReviews);
            setNewReview("");
            setEditingIndex(null);
            await AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
        }
    };

    const cancelEdit = () => {
        setNewReview("");
        setEditingIndex(null);
    };

    const deleteReview = async (index) => {
        const updatedReviews = [...reviews];
        updatedReviews.splice(index, 1);
        setReviews(updatedReviews);
        await AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
    };

    return (
        <Center flexGrow={1}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View>
                    <Image
                        source={{
                            uri: item.image ? item.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader} size='xl'>{item.name}</Heading>
                    <Text style={styles.contentText}>{item.brand}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <View style={styles.availability}>
                        <Text style={{ marginRight: 10 }}>
                            Availability: {availabilityText}
                        </Text>
                        {availability}
                    </View>
                    <Text>{item.description}</Text>
                </View>
                <EasyButton
                    primary
                    medium
                >
                    <Text style={{ color: "white" }}> Add</Text>
                </EasyButton>

                <View style={styles.reviewsContainer}>
                    <Text style={styles.reviewsHeader}>Reviews</Text>
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <>
                            {reviews.map((review, index) => (
                                <View key={index} style={styles.reviewContainer}>
                                    {index === editingIndex ? (
                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                style={styles.input}
                                                value={newReview}
                                                onChangeText={(text) => setNewReview(text)}
                                            />
                                            <View style={{ flexDirection: 'row' }}>
                                                <Button title="Update" onPress={() => updateReview(index)} />
                                                <Button title="Cancel" onPress={cancelEdit} />
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <Text style={styles.review}>{review}</Text>
                                            <View style={styles.reviewActions}>
                                                <TouchableOpacity onPress={() => editReview(index, review)}>
                                                    <FontAwesome5 name="edit" size={20} color="blue" style={styles.actionIcon} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => deleteReview(index)}>
                                                    <FontAwesome5 name="trash-alt" size={20} color="red" style={styles.actionIcon} />
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </View>
                            ))}
                            <TextInput
                                style={styles.input}
                                placeholder="Add a review"
                                value={newReview}
                                onChangeText={(text) => setNewReview(text)}
                            />
                            <Button title="Add Review" onPress={addReview} />
                        </>
                    )}
                </View>
            </ScrollView>
        </Center>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    reviewsContainer: {
        marginBottom: 20,
    },
    reviewsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    review: {
        flex: 1,
        marginBottom: 5,
    },
    reviewActions: {
        flexDirection: 'row',
    },
    actionIcon: {
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});

export default SingleProduct;

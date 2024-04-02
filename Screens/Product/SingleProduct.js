import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button, TextInput, TouchableOpacity } from "react-native";
import { Center, Heading } from 'native-base';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const SingleProduct = ({ route }) => {
    const [item, setItem] = useState(route.params.item);
    const [availability, setAvailability] = useState('');
    const [availabilityText, setAvailabilityText] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        // Determine availability
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

        // Load comments and ratings from AsyncStorage on component mount
        loadComments();

        // Cleanup function
        return () => {
            setAvailability(null);
            setAvailabilityText("");
        };
    }, []);

    // Function to load comments and ratings from AsyncStorage
    const loadComments = async () => {
        try {
            const commentsData = await AsyncStorage.getItem("comments");
            if (commentsData !== null) {
                setComments(JSON.parse(commentsData));
                // Initialize ratings with default values if not present
                const defaultRatings = Array(JSON.parse(commentsData).length).fill(0);
                setRatings(defaultRatings);
            }
        } catch (error) {
            console.error("Error loading comments: ", error);
        }
    };

    // Function to handle adding a new comment along with rating
    const handleCommentAction = async () => {
        if (newComment.trim() !== "") {
            const currentTime = new Date().toLocaleString(); // Get current time in a readable format
            const commentWithTime = `${newComment} - ${currentTime}`; // Combine comment with time
    
            if (editingIndex !== null) {
                // Remove original timestamp and add current time when editing existing comment
                const updatedComment = `${newComment} - ${currentTime}`;
                
                // Update existing comment and rating
                const updatedComments = [...comments];
                updatedComments[editingIndex] = updatedComment;
                setComments(updatedComments);
                setEditingIndex(null);
                setNewComment(""); // Clear the input field
                await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
            } else {
                // Add new comment and rating with current time
                const updatedComments = [...comments, commentWithTime];
                setComments(updatedComments);
                setNewComment(""); // Clear the input field
                const updatedRatings = [...ratings, 0]; // Assuming default rating is 0
                setRatings(updatedRatings);
                await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
            }
        }
    };
    
    


    // Function to handle editing a comment
    const editComment = (index) => {
        setNewComment(comments[index]);
        setEditingIndex(index);
    };

    // Function to handle deleting a comment
    const deleteComment = async (index) => {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        setComments(updatedComments);
        const updatedRatings = [...ratings];
        updatedRatings.splice(index, 1);
        setRatings(updatedRatings);
        await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
    };

    // Function to handle updating a star rating
    const updateRating = (index, rating) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = rating;
        setRatings(updatedRatings);
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
    
                {/* Render Comments */}
                <View style={styles.commentsContainer}>
                    <Text style={styles.commentsHeader}>Comments</Text>
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.commentWrapper}>
                            <View style={styles.commentContainer}>
                                <Text style={styles.comment}>{comment}</Text>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity onPress={() => editComment(index)}>
                                        <FontAwesome name="edit" size={20} color="blue" style={styles.actionIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteComment(index)}>
                                        <FontAwesome name="trash" size={20} color="red" style={styles.actionIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Star Rating */}
                            <View style={styles.starRatingContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => updateRating(index, star)}
                                    >
                                        <FontAwesome
                                            name={star <= ratings[index] ? 'star' : 'star-o'}
                                            size={24}
                                            color={star <= ratings[index] ? 'gold' : '#ccc'}
                                            style={styles.starIcon}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
    
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment"
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                />
                <EasyButton
                    primary
                    medium
                    onPress={handleCommentAction}
                >
                    <Text style={{ color: "white" }}>{editingIndex !== null ? 'Update' : 'Add'}</Text>
                </EasyButton>
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
        marginTop: 0,
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
    commentsContainer: {
        marginBottom: 20,
    },
    commentsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    comment: {
        flex: 1,
        marginRight: 10,
    },
    commentActions: {
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
    starRatingContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    starIcon: {
        marginRight: 5,
    },
});

export default SingleProduct;

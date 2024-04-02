import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, RefreshControl, Image } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { Searchbar } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import EditCategory from "./EditCategory";



const Item = (props) => {
    return (
        <View style={styles.item}>
            <Text>{props.item.name}</Text>
            <EasyButton
                danger
                medium
                onPress={() => props.delete(props.item._id)}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
            </EasyButton>
        </View>
    )
}

const CategoriesList = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState();

    const fetchCategories = useCallback(() => {
        axios.get(`${baseURL}categories`)
            .then((response) => {
                setCategoryList(response.data);
                setCategoryFilter(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching categories: ", error));
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategories();
        setRefreshing(false);
    }, [fetchCategories]);

    const searchCategory = (text) => {
        if (text === "") {
            setCategoryFilter(categoryList);
        } else {
            setCategoryFilter(
                categoryList.filter((category) =>
                    category.name.toLowerCase().includes(text.toLowerCase())
                )
            );
        }
    }

    const editCategory = (item) => {
        navigation.navigate("EditCategory", { category: item });
    }

    const deleteCategory = (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };

        axios
            .delete(`${baseURL}categories/${id}`, config)
            .then((res) => {
                const newCategories = categories.filter((item) => item.id !== id);
                setCategories(newCategories);
            })
            .catch((error) => alert("Error delete categories"));
    }

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={searchCategory}
            />
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (
                <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={categoryFilter}
                    renderItem={({ item }) => (
                        <View style={styles.categoryItem}>
                            <Text>{item.name}</Text>
                            {item.image && <Image source={{ uri: item.image }} style={styles.categoryImage} />}
                            <View style={styles.buttonsContainer}>
                                <IconButton
                                    icon="pencil"
                                    color="blue"
                                    size={20}
                                    onPress={() => editCategory(item)}
                                />
                                <IconButton
                                    icon="delete"
                                    color="red"
                                    size={20}
                                    onPress={() => deleteCategory(item.id)}
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    categoryImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CategoriesList;

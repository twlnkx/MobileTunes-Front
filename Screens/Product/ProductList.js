import React from "react";
import { TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProductCard from "./ProductCard";

var { width } = Dimensions.get("window")

const ProductList = (props) => {
    const { item } = props;
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <TouchableOpacity
                style={{ width: '50%' }}
                onPress={() => navigation.navigate("Product Detail", { item: item })
                }>
                <View style={{ width: width / 2, backgroundColor: 'gainsboro' }}>
                    <ProductCard {...item} />
                </View>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ProductList;

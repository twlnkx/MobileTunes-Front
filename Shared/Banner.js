import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper";

var { width } = Dimensions.get("window");

const Banner = () => {
    const [bannerData, setBannerData] = useState([]);

    useEffect(() => {
        setBannerData([
            "https://t3.ftcdn.net/jpg/06/51/05/60/360_F_651056046_kPpWQYlaXSolgMALM88AYbt01izA2emc.jpg",
            "https://png.pngtree.com/thumb_back/fh260/background/20230718/pngtree-musical-notes-and-headphones-concept-with-white-space-rendered-in-3d-image_3898902.jpg",
            "https://png.pngtree.com/thumb_back/fh260/background/20230705/pngtree-d-illustration-of-abstract-blue-background-with-modern-headphones-ideal-for-image_3807815.jpg",
        ]);

        return () => {
            setBannerData([]);
        };
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.swiper}>
                    <Swiper
                        style={{ height: width / 2 }}
                        showButtons={false}
                        autoplay={true}
                        autoplayTimeout={2}
                    >
                        {bannerData.map((item) => {
                            return (
                                <Image
                                    key={item}
                                    style={styles.imageBanner}
                                    resizeMode="contain"
                                    source={{ uri: item }}
                                />
                            );
                        })}
                    </Swiper>
                    <View style={{ height: 20 }}></View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "gainsboro",
    },
    swiper: {
        width: width,
        alignItems: "center",
        marginTop: 10,
    },
    imageBanner: {
        height: width / 2,
        width: width - 40,
        borderRadius: 10,
        marginHorizontal: 20,
    },
});

export default Banner;
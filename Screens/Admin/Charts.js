import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

const screenWidth = Dimensions.get("window").width;

const Charts = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseURL}products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    axios
      .get(`${baseURL}orders`)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 1)`;
  };

  const dataPie1 = products.reduce((acc, product) => {
    const categoryIndex = acc.findIndex(
      (item) => item.name === product.category?.name
    );
    if (categoryIndex === -1) {
      acc.push({
        name: product.category?.name,
        count: 1,
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      });
    } else {
      acc[categoryIndex].count++;
    }
    return acc;
  }, []);

  const dataPie2 = products.reduce((acc, product) => {
    const productName = product.name;
    const stockIndex = acc.findIndex((item) => item.name === productName);
    if (stockIndex === -1) {
      acc.push({
        name: productName,
        total: product.countInStock,
        withStocks: product.countInStock > 0 ? 1 : 0,
        withoutStocks: product.countInStock === 0 ? 1 : 0,
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      });
    } else {
      acc[stockIndex].total++;
      if (product.countInStock > 0) {
        acc[stockIndex].withStocks++;
      } else {
        acc[stockIndex].withoutStocks++;
      }
    }
    return acc;
  }, []);

  const orderedProducts = products.map((product) => {
    const filteredOrders = orders.filter(
      (order) =>
        order.status === "pending" ||
        order.status === "shipped" ||
        order.status === "delivered"
    );

    const orderedCount = filteredOrders.reduce((acc, order) => {
      const orderedProduct = order.orderItems.find(
        (item) => item.product && item.product._id === product._id
      );
      if (orderedProduct) {
        acc += orderedProduct.quantity;
      }
      return acc;
    }, 0);

    return {
      name: product.name,
      orderedCount,
    };
  });

  const mostOrderedProducts = orderedProducts
    .reduce((acc, product) => {
      const existingProductIndex = acc.findIndex(
        (p) => p.name === product.name
      );
      if (existingProductIndex === -1) {
        acc.push(product);
      } else {
        acc[existingProductIndex].orderedCount += product.orderedCount;
      }
      return acc;
    }, [])
    .sort((a, b) => b.orderedCount - a.orderedCount)
    .slice(0, 5);

  const dataLine = {
    labels: mostOrderedProducts.map((product) => product.name),
    datasets: [
      {
        data: mostOrderedProducts.map((product) => product.orderedCount),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [`Number of Orders`],
  };

  return (
    <FlatList
      data={[
        {
          key: "Products Stocks",
          chart: (
            <View style={styles.card}>
              <Text style={styles.title}>Products Stocks</Text>
              <PieChart
                data={dataPie2}
                width={screenWidth}
                height={180} // Adjusted height
                chartConfig={chartConfig}
                accessor="total"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 50]}
                absolute
                tooltipTextRenderer={({ value, name }) =>
                  `${name}: ${value} (${
                    dataPie2.find((item) => item.name === name).withStocks
                  } with stocks, ${
                    dataPie2.find((item) => item.name === name).withoutStocks
                  } without stocks)`
                }
              />
            </View>
          ),
        },
        {
          key: "Products Categories",
          chart: (
            <View style={styles.card}>
              <Text style={styles.title}>Products Categories</Text>
              <PieChart
                data={dataPie1}
                width={screenWidth}
                height={180} // Adjusted height
                chartConfig={chartConfig}
                accessor={"count"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 50]}
                absolute
              />
            </View>
          ),
        },
        {
          key: "Most Ordered Products",
          chart: (
            <View style={styles.card}>
              <Text style={styles.title}>Most Ordered Products</Text>
              <LineChart
                data={dataLine}
                width={screenWidth}
                height={180} // Adjusted height
                chartConfig={chartConfig}
              />
            </View>
          ),
        },
        {
          key: "Top 5 Products from Line Charts",
          chart: (
            <View style={styles.card}>
              <Text style={styles.title}>
                Top 5 Products from Line Charts
              </Text>
              <FlatList
                data={mostOrderedProducts}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                  <Text style={styles.item}>{`${index + 1}. ${item.name} - ${
                    item.orderedCount
                  } orders`}</Text>
                )}
              />
            </View>
          ),
        },
      ]}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => item.chart}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    marginBottom: 10,
  },
  item: {
    marginBottom: 5,
  },
  contentContainer: {
    paddingBottom: 20, // Adjusted margin
  },
});

export default Charts;

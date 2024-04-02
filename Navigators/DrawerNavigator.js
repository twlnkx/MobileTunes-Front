import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Box,
  VStack,
  Text,
  Pressable,
  Icon,
  HStack,
  Divider,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import AuthGlobal from "../Context/Store/AuthGlobal";

// Import your screen components here
import Main from "./Main";
import Products from "../Screens/Admin/Products";
import Cart from "../Screens/Cart/Cart";
import Login from "../Screens/User/Login";
import ProductContainer from "../Screens/Product/ProductContainer";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Products":
      return "archive";
    case "Cart":
      return "cart";
    case "Login":
      return "login";
    default:
      return undefined;
  }
};

function CustomDrawerContent({ navigation, state }) {
  const context = useContext(AuthGlobal);
  const { stateUser } = useContext(AuthGlobal);
  return (
    <DrawerContentScrollView>
      <VStack space="6" my="2" mx="1">
        {state.routeNames.map((name, index) => (
          <Pressable
            key={name}
            px="5"
            py="3"
            rounded="md"
            bg={
              index === state.index
                ? "rgba(6, 182, 212, 0.1)"
                : "transparent"
            }
            onPress={() => navigation.navigate(name)}
          >
            <HStack space="7" alignItems="center">
              <Icon
                color={index === state.index ? "primary.500" : "gray.500"}
                size="5"
                as={<MaterialCommunityIcons name={getIcon(name)} />}
              />
              <Text
                fontWeight="500"
                color={index === state.index ? "primary.500" : "gray.700"}
              >
                {name === "Login" ? (
                  context.stateUser.isAuthenticated ? "Logout" : "Login"
                ) : (
                  name
                )}
              </Text>
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  

  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={Main} />
        {/* <Drawer.Screen name="Products" component={Products} /> */}
        <Drawer.Screen name="Cart" component={Cart} />
        <Drawer.Screen name="Login" component={Login} />
      </Drawer.Navigator>
    </Box>
  );
};

export default DrawerNavigator;

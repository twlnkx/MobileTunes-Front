import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
// import UpdateProfile from "../Screens/User/UserProfileUpdate";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />

            {/* <Stack.Screen
                name="UpdateProfile"
                component={UpdateProfile} // Add UpdateProfile screen to the navigator
                options={{
                    headerShown: false
                }}
            /> */}
        </Stack.Navigator>
    )

}

export default UserNavigator;
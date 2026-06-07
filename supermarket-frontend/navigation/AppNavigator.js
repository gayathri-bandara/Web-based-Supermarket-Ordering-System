import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ShopScreen from "../screens/ShopScreen";
import ProductScreen from "../screens/ProductScreen";
import CartScreen from "../screens/CartScreen";
import OrderScreen from "../screens/OrderScreen";
import TrackingScreen from "../screens/TrackingScreen";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ProductManagementScreen from "../screens/admin/ProductManagementScreen";
import OrderManagementScreen from "../screens/admin/OrderManagementScreen";
import CategorySupplierScreen from "../screens/admin/CategorySupplierScreen";
import PaymentInvoiceScreen from "../screens/admin/PaymentInvoiceScreen";
import ReviewFeedbackScreen from "../screens/admin/ReviewFeedbackScreen";
import DeliveryTrackingScreen from "../screens/admin/DeliveryTrackingScreen";

import { AuthContext } from "../context/AuthContext";
import { setAuthToken } from "../services/api";
import { COLORS } from "../constants/theme";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: COLORS.backgroundLight },
};

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Orders" component={OrderScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Management" component={AdminDashboardScreen} />
        <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
        <Stack.Screen name="OrderManagement" component={OrderManagementScreen} />
        <Stack.Screen name="CategorySupplier" component={CategorySupplierScreen} />
        <Stack.Screen name="PaymentInvoice" component={PaymentInvoiceScreen} />
        <Stack.Screen name="ReviewFeedback" component={ReviewFeedbackScreen} />
        <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

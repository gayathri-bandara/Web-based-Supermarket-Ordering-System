import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Layout from "../components/Layout";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder, createPayment, createDelivery } from "../services/api";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { getProductImage } from "../constants/images";

export default function CartScreen({ navigation, route }) {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!token) {
      Alert.alert("Sign In Required", "Please sign in to place an order.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Add some products before checkout.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Address Required", "Please enter a delivery address.");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await createOrder({
        userId: user?._id || "guest",
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        total: cartTotal,
        address: address.trim(),
        status: "Pending",
      });
      const orderId = orderRes.data._id;

      await createPayment({
        orderId,
        userId: user?._id,
        amount: cartTotal,
        method: "Card",
        status: "Paid",
      });

      await createDelivery({
        orderId,
        driverName: "Assigned Driver",
        driverPhone: "(012) 345-6789",
        vehicle: "SuperMart Delivery Van",
        status: "Preparing",
        eta: "45 mins",
        currentLocation: "SuperMart Warehouse",
      });

      clearCart();
      Alert.alert(
        "Supermarket Order Placed!",
        `Order #${String(orderId).slice(-6).toUpperCase()} confirmed. Payment processed and delivery assigned.`,
        [
          { text: "Track Delivery", onPress: () => navigation.navigate("Tracking") },
          { text: "View Orders", onPress: () => navigation.navigate("Orders") },
        ]
      );
    } catch {
      Alert.alert("Error", "Could not place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Supermarket Cart</Text>
        <Text style={styles.subtitle}>{items.length} item(s) ready for checkout</Text>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate("Shop")}>
              <Text style={styles.shopBtnText}>START SHOPPING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.product._id} style={styles.item}>
                <Image
                  source={{ uri: getProductImage(item.product) }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>${Number(item.product.price).toFixed(2)}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemTotal}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                  <TouchableOpacity onPress={() => removeFromCart(item.product._id)}>
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Delivery Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your delivery address"
                placeholderTextColor={COLORS.textLight}
                value={address}
                onChangeText={setAddress}
                multiline
              />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={[styles.checkoutBtn, loading && styles.btnDisabled]}
                onPress={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, maxWidth: 800, alignSelf: "center", width: "100%" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.lg },
  empty: { alignItems: "center", padding: SPACING.xl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.lg },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  shopBtnText: { color: COLORS.white, fontWeight: "700" },
  item: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    gap: SPACING.md,
  },
  itemImage: { width: 80, height: 80, borderRadius: RADIUS.sm },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  itemPrice: { fontSize: 14, color: COLORS.primary, fontWeight: "700" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: COLORS.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  qty: { fontSize: 14, fontWeight: "700", minWidth: 24, textAlign: "center" },
  itemRight: { alignItems: "flex-end" },
  itemTotal: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  remove: { color: COLORS.error, fontSize: 12, marginTop: 8 },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
  },
  summaryLabel: { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  addressInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    minHeight: 60,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  totalValue: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.7 },
  checkoutText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
});

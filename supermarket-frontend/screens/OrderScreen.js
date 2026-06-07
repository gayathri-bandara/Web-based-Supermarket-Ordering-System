import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { getOrders } from "../services/api";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

const STATUS_COLORS = {
  Pending: "#ff9800",
  Processing: "#2196f3",
  Delivered: "#4caf50",
  Cancelled: "#e53935",
};

export default function OrderScreen({ navigation, route }) {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadOrders();
    else setLoading(false);
  }, [token]);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Layout navigation={navigation} route={route}>
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>My Supermarket Orders</Text>
        <Text style={styles.subtitle}>{orders.length} online order(s)</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : orders.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Shop")}>
              <Text style={styles.btnText}>START SHOPPING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{order._id?.slice(-6).toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || COLORS.primary }]}>
                  <Text style={styles.statusText}>{order.status || "Pending"}</Text>
                </View>
              </View>
              <Text style={styles.detail}>Items: {order.items?.length || 0}</Text>
              <Text style={styles.detail}>{`Total: $${Number(order.total || 0).toFixed(2)}`}</Text>
              {order.address && <Text style={styles.detail}>Delivery: {order.address}</Text>}
              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate("Tracking")}
              >
                <Text style={styles.trackText}>Track Delivery →</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.lg },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.lg },
  center: { alignItems: "center", padding: SPACING.xl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.lg },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  btnText: { color: COLORS.white, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
  orderId: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { color: COLORS.white, fontSize: 12, fontWeight: "600" },
  detail: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  trackBtn: { marginTop: SPACING.md, alignSelf: "flex-start" },
  trackText: { color: COLORS.accent, fontWeight: "700", fontSize: 14 },
});

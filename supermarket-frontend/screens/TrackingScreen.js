import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Layout from "../components/Layout";
import { getDeliveries } from "../services/api";
import { BRAND } from "../constants/branding";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

const STEPS = ["Preparing", "Packed", "Out for Delivery", "Near Destination", "Delivered"];

export default function TrackingScreen({ navigation, route }) {
  const [orderId, setOrderId] = useState("");
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const track = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await getDeliveries(orderId.trim());
      setDelivery(res.data?.[0] || null);
    } catch {
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = delivery ? STEPS.indexOf(delivery.status) : -1;

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Track Your Supermarket Order</Text>
        <Text style={styles.subtitle}>
          Enter your order ID to see real-time delivery status from {BRAND.name}.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter Order ID"
            value={orderId}
            onChangeText={setOrderId}
          />
          <TouchableOpacity style={styles.btn} onPress={track}>
            <Text style={styles.btnText}>TRACK</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}

        {searched && !loading && !delivery && (
          <Text style={styles.notFound}>No delivery found for this order ID. Check your order confirmation email.</Text>
        )}

        {delivery && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Status</Text>
            <Text style={styles.driver}>Driver: {delivery.driverName}</Text>
            <Text style={styles.meta}>Vehicle: {delivery.vehicle || "Delivery Van"}</Text>
            <Text style={styles.meta}>Phone: {delivery.driverPhone || "—"}</Text>
            <Text style={styles.meta}>Location: {delivery.currentLocation || "Processing at warehouse"}</Text>
            <Text style={styles.meta}>ETA: {delivery.eta || "Calculating..."}</Text>

            <View style={styles.timeline}>
              {STEPS.map((step, i) => (
                <View key={step} style={styles.step}>
                  <View style={[styles.dot, i <= stepIndex && styles.dotActive]} />
                  <Text style={[styles.stepText, i <= stepIndex && styles.stepTextActive]}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, maxWidth: 600, alignSelf: "center", width: "100%" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.lg },
  searchRow: { flexDirection: "row", gap: SPACING.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: 14,
  },
  btn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, justifyContent: "center" },
  btnText: { color: COLORS.white, fontWeight: "700" },
  notFound: { textAlign: "center", color: COLORS.textMuted, marginTop: SPACING.xl },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: SPACING.md },
  driver: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  meta: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  timeline: { marginTop: SPACING.lg },
  step: { flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.md },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.secondary },
  stepText: { fontSize: 14, color: COLORS.textLight },
  stepTextActive: { color: COLORS.primary, fontWeight: "600" },
});

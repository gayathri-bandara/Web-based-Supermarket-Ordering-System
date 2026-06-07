import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Layout from "../../components/Layout";
import { AuthContext } from "../../context/AuthContext";
import { BRAND, ADMIN_MODULES } from "../../constants/branding";
import { COLORS, SPACING, RADIUS } from "../../constants/theme";

export default function AdminDashboardScreen({ navigation, route }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return (
      <Layout navigation={navigation} route={route}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>Supermarket Management Portal</Text>
          <Text style={styles.lockDesc}>
            Sign in to access product, order, payment, delivery, and supplier management tools.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Supermarket Management System</Text>
        <Text style={styles.heroDesc}>
          Manage all {BRAND.name} operations from one dashboard — products, orders, suppliers, payments, reviews, and deliveries.
        </Text>
      </View>

      <View style={styles.grid}>
        {ADMIN_MODULES.map((mod) => (
          <TouchableOpacity
            key={mod.id}
            style={styles.moduleCard}
            onPress={() => navigation.navigate(mod.screen)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, { backgroundColor: mod.color + "18" }]}>
              <Text style={styles.icon}>{mod.icon}</Text>
            </View>
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            <Text style={styles.moduleDesc}>{mod.desc}</Text>
            <Text style={styles.openLink}>Open Module →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  heroTitle: { fontSize: 26, fontWeight: "800", color: COLORS.white, marginBottom: SPACING.sm },
  heroDesc: { fontSize: 14, color: "#c8e6c9", lineHeight: 22 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  moduleCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  icon: { fontSize: 26 },
  moduleTitle: { fontSize: 16, fontWeight: "700", color: COLORS.primary, marginBottom: 6 },
  moduleDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 20, marginBottom: SPACING.md },
  openLink: { fontSize: 13, color: COLORS.accent, fontWeight: "700" },
  center: { alignItems: "center", padding: SPACING.xl * 2 },
  lockIcon: { fontSize: 48, marginBottom: SPACING.md },
  lockTitle: { fontSize: 20, fontWeight: "700", color: COLORS.primary, textAlign: "center" },
  lockDesc: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginVertical: SPACING.md, maxWidth: 400 },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  btnText: { color: COLORS.white, fontWeight: "700" },
});

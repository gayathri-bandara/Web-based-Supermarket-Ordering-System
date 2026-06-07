import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { BRAND } from "../constants/branding";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const NAV_LINKS = ["Home", "Shop", "Orders", "Tracking", "Management"];

export default function Header({ navigation, currentRoute }) {
  const { token, user, logout } = useContext(AuthContext);
  const { cartCount, cartTotal } = useContext(CartContext);
  const [search, setSearch] = useState("");

  const navigate = (screen) => {
    if (navigation?.navigate) navigation.navigate(screen);
  };

  const routeMap = {
    Home: "Home",
    Shop: "Shop",
    Orders: token ? "Orders" : "Login",
    Tracking: "Tracking",
    Management: token ? "Management" : "Login",
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <TouchableOpacity onPress={() => navigate("Management")}>
            <Text style={styles.topLink}>Store Management</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("Tracking")}>
            <Text style={styles.topLink}>Order Tracking</Text>
          </TouchableOpacity>
          <Text style={styles.topLink}>Return Policy</Text>
        </View>
        <Text style={styles.promo}>{BRAND.promo}</Text>
        <View style={styles.topRight}>
          <Text style={styles.topLink}>Mobile App</Text>
          {token ? (
            <TouchableOpacity onPress={logout}>
              <Text style={styles.topLinkGreen}>Hi, {user?.name || "Customer"} · Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigate("Login")}>
              <Text style={styles.topLinkGreen}>Sign in / Register</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mainHeader}>
        <TouchableOpacity style={styles.logo} onPress={() => navigate("Home")}>
          <View style={styles.logoIcon}>
            <Text style={styles.leaf}>🛒</Text>
          </View>
          <View>
            <Text style={styles.logoText}>{BRAND.name}</Text>
            <Text style={styles.tagline}>{BRAND.tagline}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <View style={styles.categoryDrop}>
            <Text style={styles.categoryText}>All Aisles ▾</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={BRAND.searchPlaceholder}
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => navigate("Shop")}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => navigate("Shop")}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigate("Cart")}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionLabel}>My Cart</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
            <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.browseBtn} onPress={() => navigate("Shop")}>
          <Text style={styles.browseIcon}>☰</Text>
          <Text style={styles.browseText}>Browse Aisles</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <TouchableOpacity
              key={link}
              onPress={() => navigate(routeMap[link])}
              style={[styles.navLink, currentRoute === routeMap[link] && styles.navLinkActive]}
            >
              <Text style={styles.navLinkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.hotline}>{BRAND.hotline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  topBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  topLeft: { flexDirection: "row", gap: SPACING.md, flexWrap: "wrap" },
  topRight: { flexDirection: "row", gap: SPACING.md, flexWrap: "wrap" },
  topLink: { fontSize: 12, color: COLORS.textMuted },
  topLinkGreen: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  promo: { fontSize: 12, color: COLORS.secondary, fontWeight: "600" },
  mainHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  logo: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  leaf: { fontSize: 22 },
  logoText: { fontSize: 22, fontWeight: "800", color: COLORS.primary, lineHeight: 26 },
  tagline: { fontSize: 11, color: COLORS.textMuted, fontWeight: "600" },
  searchBar: {
    flex: 1,
    minWidth: 280,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    alignItems: "center",
  },
  categoryDrop: {
    paddingHorizontal: SPACING.md,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingVertical: 12,
  },
  categoryText: { fontSize: 13, color: COLORS.text },
  searchInput: { flex: 1, paddingHorizontal: SPACING.md, fontSize: 14, color: COLORS.text },
  searchBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    justifyContent: "center",
  },
  searchIcon: { fontSize: 18 },
  actions: { flexDirection: "row", gap: SPACING.lg },
  actionItem: { alignItems: "center", position: "relative", minWidth: 56 },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  badge: {
    position: "absolute",
    top: -4,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: "700" },
  cartTotal: { fontSize: 11, color: COLORS.primary, fontWeight: "700", marginTop: 2 },
  navBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.sm,
  },
  browseIcon: { color: COLORS.white, fontSize: 16 },
  browseText: { color: COLORS.white, fontWeight: "600", fontSize: 13 },
  navLinks: { flex: 1 },
  navLink: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  navLinkActive: { borderBottomWidth: 2, borderBottomColor: COLORS.secondary },
  navLinkText: { color: COLORS.white, fontSize: 14, fontWeight: "500" },
  hotline: { color: COLORS.white, fontSize: 13, fontWeight: "600" },
});

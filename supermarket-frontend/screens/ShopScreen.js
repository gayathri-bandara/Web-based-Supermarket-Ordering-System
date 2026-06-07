import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getProducts } from "../services/api";
import { CartContext } from "../context/CartContext";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { FALLBACK_PRODUCTS } from "../constants/fallbackData";

const TABS = ["All", "Fruit", "Vegetable", "Dairy", "Pantry", "Frozen"];

export default function ShopScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const { addToCart } = useContext(CartContext);
  const categoryId = route?.params?.categoryId;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data?.length ? res.data : FALLBACK_PRODUCTS);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  const filtered = products.filter((p) => {
    if (categoryId && p.category?._id !== categoryId && p.category !== categoryId) return false;
    if (activeTab === "All") return true;
    const catName = (p.category?.name || "").toLowerCase();
    return catName.includes(activeTab.toLowerCase());
  });

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.header}>
        <Text style={styles.title}>Online Supermarket Catalog</Text>
        <Text style={styles.count}>{filtered.length} supermarket items available</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onPress={(p) => navigation.navigate("Product", { product: p })}
            onAddToCart={(p) => addToCart(p)}
          />
        ))}
      </View>

      {filtered.length === 0 && (
        <Text style={styles.empty}>No products found in this category.</Text>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: { padding: SPACING.md },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
  count: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "600" },
  tabTextActive: { color: COLORS.white },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.sm,
  },
  empty: { textAlign: "center", color: COLORS.textMuted, padding: SPACING.xl },
});

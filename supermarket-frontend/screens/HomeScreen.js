import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getProducts, getCategories } from "../services/api";
import { CartContext } from "../context/CartContext";
import Layout from "../components/Layout";
import HeroBanner from "../components/HeroBanner";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import CountdownTimer from "../components/CountdownTimer";
import { COLORS, SPACING } from "../constants/theme";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "../constants/fallbackData";

export default function HomeScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodRes.data?.length ? prodRes.data : FALLBACK_PRODUCTS);
      setCategories(catRes.data?.length ? catRes.data : FALLBACK_CATEGORIES);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  const countByCategory = (catId, catName) =>
    products.filter(
      (p) =>
        p.category?._id === catId ||
        p.category === catId ||
        (catName && p.category?.name === catName)
    ).length;

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);
  const displayFlash = flashSaleProducts.length >= 4 ? flashSaleProducts : products.slice(0, 4).map((p) => ({ ...p, isFlashSale: true }));

  return (
    <Layout navigation={navigation} route={route}>
      <HeroBanner onShopNow={() => navigation.navigate("Shop")} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              productCount={countByCategory(cat._id, cat.name)}
              onPress={() => navigation.navigate("Shop", { categoryId: cat._id, categoryName: cat.name })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.flashHeader}>
          <View>
            <Text style={styles.sectionTitle}>Weekly Supermarket Deals</Text>
            <View style={styles.timerRow}>
              <Text style={styles.timerLabel}>Deal ends in</Text>
              <CountdownTimer />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productRow}>
          {displayFlash.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onPress={(p) => navigation.navigate("Product", { product: p })}
              onAddToCart={(p) => addToCart(p)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Supermarket Items</Text>
        <View style={styles.productRow}>
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onPress={(p) => navigation.navigate("Product", { product: p })}
              onAddToCart={(p) => addToCart(p)}
            />
          ))}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  flashHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  timerRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: 4 },
  timerLabel: { fontSize: 13, color: COLORS.textMuted },
  viewAll: { color: COLORS.primary, fontWeight: "600", fontSize: 14 },
  productRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SPACING.sm,
  },
});

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { getProductImage } from "../constants/images";
import StarRating from "./StarRating";

export default function ProductCard({ product, onPress, onAddToCart, compact }) {
  const originalPrice = product.originalPrice || product.price * 1.2;
  const rating = product.rating || 5;
  const [imageError, setImageError] = React.useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compact]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        <Image 
          source={{ uri: imageError ? "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80" : getProductImage(product) }} 
          style={styles.image} 
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        {product.isFlashSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <StarRating rating={rating} size={12} />
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{`$${Number(product.price).toFixed(2)}`}</Text>
          <Text style={styles.original}>{`$${Number(originalPrice).toFixed(2)}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onAddToCart?.(product)}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 180,
    maxWidth: 260,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    margin: SPACING.sm,
  },
  compact: { minWidth: 150, maxWidth: 200 },
  imageWrap: { position: "relative", height: 160, backgroundColor: COLORS.backgroundLight },
  image: { width: "100%", height: "100%" },
  saleBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleText: { color: COLORS.white, fontSize: 10, fontWeight: "700" },
  body: { padding: SPACING.md },
  name: { fontSize: 13, fontWeight: "600", color: COLORS.text, marginTop: 6, minHeight: 36 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6, marginBottom: SPACING.sm },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  original: { fontSize: 13, color: COLORS.textLight, textDecorationLine: "line-through" },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    alignItems: "center",
  },
  addBtnText: { color: COLORS.white, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
});

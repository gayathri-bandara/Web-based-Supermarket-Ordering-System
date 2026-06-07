import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { CATEGORY_ICONS } from "../constants/images";

export default function CategoryCard({ category, productCount, onPress }) {
  const imageUri = CATEGORY_ICONS[category?.name] || CATEGORY_ICONS["Fresh Fruits"];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Image source={{ uri: imageUri }} style={styles.icon} />
      </View>
      <Text style={styles.name} numberOfLines={1}>{category?.name || "Category"}</Text>
      <Text style={styles.count}>{productCount || 0} Items</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 120,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.backgroundLight,
  },
  icon: { width: "100%", height: "100%" },
  name: { fontWeight: "600", fontSize: 13, color: COLORS.text, textAlign: "center" },
  count: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});

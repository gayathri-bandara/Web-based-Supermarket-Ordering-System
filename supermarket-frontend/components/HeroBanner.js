import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { BRAND } from "../constants/branding";
import { HERO_IMAGE } from "../constants/images";

export default function HeroBanner({ onShopNow }) {
  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Text style={styles.tag}>{BRAND.heroTag}</Text>
        <Text style={styles.title}>{BRAND.heroTitle}</Text>
        <Text style={styles.desc}>{BRAND.heroDesc}</Text>
        <TouchableOpacity style={styles.btn} onPress={onShopNow} activeOpacity={0.85}>
          <Text style={styles.btnText}>SHOP SUPERMARKET →</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: HERO_IMAGE }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.heroGradient,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    overflow: "hidden",
    minHeight: 280,
    alignItems: "center",
  },
  content: { flex: 1, minWidth: 280, padding: SPACING.xl },
  tag: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
    lineHeight: 38,
    marginBottom: SPACING.md,
  },
  desc: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 400,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
  },
  btnText: { color: COLORS.white, fontWeight: "700", fontSize: 14, letterSpacing: 0.5 },
  image: { width: 320, height: 260, flexShrink: 0 },
});

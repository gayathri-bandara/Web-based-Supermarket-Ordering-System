import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function AdminPageLayout({
  navigation,
  route,
  title,
  subtitle,
  children,
}) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return (
      <Layout navigation={navigation} route={route}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>Management Access Required</Text>
          <Text style={styles.lockDesc}>Sign in to access supermarket management tools.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Management")}>
          <Text style={styles.back}>← Back to Management</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  back: { color: COLORS.primary, fontWeight: "600", fontSize: 14, marginBottom: SPACING.sm },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  body: { padding: SPACING.lg, paddingTop: 0, paddingBottom: 40 },
  center: { alignItems: "center", padding: SPACING.xl * 2 },
  lockIcon: { fontSize: 48, marginBottom: SPACING.md },
  lockTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  lockDesc: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginVertical: SPACING.md },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  btnText: { color: COLORS.white, fontWeight: "700" },
});

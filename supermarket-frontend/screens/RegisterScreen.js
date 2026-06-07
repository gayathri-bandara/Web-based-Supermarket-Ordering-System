import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser, setAuthToken } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { BRAND } from "../constants/branding";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await registerUser({ name: name.trim(), email: email.trim(), password });
      const token = res.data.token;
      setAuthToken(token);
      setToken(token, res.data.user);
      navigation.navigate("Home");
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === "string" ? msg : "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.leaf}>🌿</Text>
          </View>
          <Text style={styles.brand}>{BRAND.name}</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join {BRAND.name} for online supermarket shopping</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Your name"
          placeholderTextColor={COLORS.textLight}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={COLORS.textLight}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="At least 6 characters"
          placeholderTextColor={COLORS.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.btnText}>CREATE ACCOUNT</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginBottom: SPACING.lg },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  leaf: { fontSize: 22 },
  brand: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  tagline: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.lg },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
  error: {
    color: COLORS.error,
    backgroundColor: "#ffebee",
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
    fontSize: 13,
  },
  link: { textAlign: "center", color: COLORS.textMuted, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: "700" },
});

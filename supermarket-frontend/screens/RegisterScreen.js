import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { registerUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      const res = await registerUser({ name, email, password });
      setToken(res.data._id);
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput placeholder="Name" onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    const res = await loginUser({ email, password });
    setToken(res.data.token);
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input}/>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  input: { borderWidth:1, marginBottom:10, padding:10, borderRadius:8 }
});
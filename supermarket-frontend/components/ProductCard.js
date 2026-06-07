import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
      <Button title="Add to Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding:15, margin:10, backgroundColor:"#fff", borderRadius:10 },
  image: { width:100, height:100 }
});
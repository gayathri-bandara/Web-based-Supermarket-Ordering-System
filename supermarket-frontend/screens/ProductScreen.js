import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";

export default function ProductScreen({ route }) {
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>No product selected</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  return (
    <View style={styles.container}>
      {product.image && <Image source={{ uri: product.image }} style={styles.image} />}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.stock}>Stock: {product.stock}</Text>
      
      <View style={styles.quantityContainer}>
        <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
        <Text style={styles.quantity}>{quantity}</Text>
        <Button title="+" onPress={() => setQuantity(quantity + 1)} />
      </View>
      
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: "100%", height: 250, borderRadius: 8, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  price: { fontSize: 20, color: "#4CAF50", fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 14, color: "#666", marginBottom: 10 },
  stock: { fontSize: 14, marginBottom: 20 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  quantity: { marginHorizontal: 15, fontSize: 18, fontWeight: "bold" },
});
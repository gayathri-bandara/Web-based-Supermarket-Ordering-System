import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getReviews, createReview } from "../services/api";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { getProductImage } from "../constants/images";

export default function ProductScreen({ route, navigation }) {
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const { addToCart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (product?._id) loadReviews();
  }, [product?._id]);

  const loadReviews = async () => {
    try {
      const res = await getReviews(product._id);
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    }
  };

  if (!product) {
    return (
      <Layout navigation={navigation} route={route}>
        <Text style={styles.empty}>No supermarket product selected</Text>
      </Layout>
    );
  }

  const originalPrice = product.originalPrice || product.price * 1.2;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert("Added to Cart", `${quantity}x ${product.name} added to your supermarket cart.`);
  };

  const submitReview = async () => {
    if (!token) {
      Alert.alert("Sign In Required", "Please sign in to leave a review.", [
        { text: "Sign In", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }
    if (!comment.trim()) return Alert.alert("Review", "Please write your feedback.");
    try {
      await createReview({
        userId: user?._id,
        userName: user?.name || "Customer",
        productId: product._id,
        productName: product.name,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      loadReviews();
      Alert.alert("Thank You", "Your supermarket product review has been submitted.");
    } catch {
      Alert.alert("Error", "Could not submit review.");
    }
  };

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.imageSection}>
          <Image source={{ uri: getProductImage(product) }} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.details}>
          <StarRating rating={product.rating || 5} size={18} />
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
            <Text style={styles.original}>${Number(originalPrice).toFixed(2)}</Text>
          </View>
          <Text style={styles.description}>
            {product.description || "Quality supermarket product available for online ordering and home delivery."}
          </Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? `${product.stock} available in store` : "Currently out of stock"}
          </Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity:</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartLink} onPress={() => navigation.navigate("Cart")}>
            <Text style={styles.cartLinkText}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Customer Reviews & Feedback</Text>
        <View style={styles.reviewForm}>
          <Text style={styles.reviewLabel}>Your Rating</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: SPACING.sm }}>
            {[1, 2, 3, 4, 5].map((r) => (
              <TouchableOpacity key={r} onPress={() => setRating(r)}>
                <Text style={{ fontSize: 24, color: r <= rating ? COLORS.star : COLORS.border }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this supermarket product..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={styles.reviewBtn} onPress={submitReview}>
            <Text style={styles.reviewBtnText}>SUBMIT REVIEW</Text>
          </TouchableOpacity>
        </View>

        {reviews.map((r) => (
          <View key={r._id} style={styles.reviewCard}>
            <Text style={styles.reviewUser}>{r.userName || "Customer"}</Text>
            <StarRating rating={r.rating} size={12} />
            <Text style={styles.reviewComment}>{r.comment}</Text>
          </View>
        ))}
        {reviews.length === 0 && (
          <Text style={styles.noReviews}>No reviews yet. Be the first to review this product!</Text>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", padding: SPACING.lg, gap: SPACING.xl },
  imageSection: { flex: 1, minWidth: 300 },
  image: { width: "100%", height: 400, borderRadius: RADIUS.lg, backgroundColor: COLORS.backgroundLight },
  details: { flex: 1, minWidth: 300 },
  name: { fontSize: 26, fontWeight: "800", color: COLORS.primary, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: SPACING.md },
  price: { fontSize: 28, fontWeight: "800", color: COLORS.primary },
  original: { fontSize: 18, color: COLORS.textLight, textDecorationLine: "line-through" },
  description: { fontSize: 15, color: COLORS.textMuted, lineHeight: 24, marginBottom: SPACING.md },
  stock: { fontSize: 14, color: COLORS.secondary, fontWeight: "600", marginBottom: SPACING.lg },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.lg },
  qtyLabel: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  qtyBtn: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: COLORS.backgroundLight, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border },
  qtyBtnText: { fontSize: 20, fontWeight: "700", color: COLORS.primary },
  qtyValue: { fontSize: 18, fontWeight: "700", minWidth: 30, textAlign: "center" },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingVertical: 16, alignItems: "center", marginBottom: SPACING.md },
  addBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },
  cartLink: { alignItems: "center" },
  cartLinkText: { color: COLORS.secondary, fontWeight: "600", fontSize: 14 },
  reviewSection: { padding: SPACING.lg, paddingTop: 0 },
  reviewTitle: { fontSize: 20, fontWeight: "800", color: COLORS.primary, marginBottom: SPACING.md },
  reviewForm: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  reviewLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  reviewInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: SPACING.md, minHeight: 80, fontSize: 14, marginBottom: SPACING.md },
  reviewBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingVertical: 12, alignItems: "center" },
  reviewBtnText: { color: COLORS.white, fontWeight: "700" },
  reviewCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  reviewUser: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  reviewComment: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  noReviews: { textAlign: "center", color: COLORS.textMuted, padding: SPACING.lg },
  empty: { textAlign: "center", padding: SPACING.xl, color: COLORS.textMuted },
});

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../services/api";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { PRODUCT_IMAGES } from "../constants/images";
import { FALLBACK_PRODUCTS } from "../constants/fallbackData";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  stock: "",
  image: PRODUCT_IMAGES.default,
  rating: "5",
  isFlashSale: false,
};

export default function AdminProductsScreen({ navigation, route }) {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) loadData();
    else setLoading(false);
  }, [token]);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodRes.data?.length ? prodRes.data : FALLBACK_PRODUCTS);
      setCategories(catRes.data || []);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      Alert.alert("Validation", "Name and price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price) * 1.2,
      stock: parseInt(form.stock, 10) || 0,
      image: form.image,
      rating: parseFloat(form.rating) || 5,
      isFlashSale: form.isFlashSale,
      category: categories[0]?._id,
    };
    try {
      if (editingId && !editingId.startsWith("fb")) {
        await updateProduct(editingId, payload);
      } else if (!editingId) {
        await createProduct(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadData();
      Alert.alert("Success", editingId ? "Product updated." : "Product created.");
    } catch {
      Alert.alert("Error", "Could not save product. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      originalPrice: String(product.originalPrice || ""),
      stock: String(product.stock || ""),
      image: product.image || PRODUCT_IMAGES.default,
      rating: String(product.rating || 5),
      isFlashSale: !!product.isFlashSale,
    });
  };

  const handleDelete = (id) => {
    if (id.startsWith("fb")) {
      Alert.alert("Demo Product", "This is demo data. Connect the backend to manage real products.");
      return;
    }
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            await loadData();
          } catch {
            Alert.alert("Error", "Could not delete product.");
          }
        },
      },
    ]);
  };

  if (!token) {
    return (
      <Layout navigation={navigation} route={route}>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Sign in to manage products</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Products</Text>
        <Text style={styles.subtitle}>Create, update, and delete products</Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? "Edit Product" : "Add New Product"}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePicker}>
            {Object.entries(PRODUCT_IMAGES).map(([key, uri]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setForm({ ...form, image: uri })}
                style={[styles.imageOption, form.image === uri && styles.imageOptionActive]}
              >
                <Text style={styles.imageKey}>{key}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {["name", "description", "price", "originalPrice", "stock", "image", "rating"].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholderTextColor={COLORS.textLight}
              value={form[field]}
              onChangeText={(v) => setForm({ ...form, [field]: v })}
            />
          ))}

          <TouchableOpacity
            style={styles.flashToggle}
            onPress={() => setForm({ ...form, isFlashSale: !form.isFlashSale })}
          >
            <Text style={styles.flashText}>
              {form.isFlashSale ? "✓ Flash Sale" : "○ Flash Sale"}
            </Text>
          </TouchableOpacity>

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveBtnText}>{editingId ? "UPDATE" : "CREATE"}</Text>
              )}
            </TouchableOpacity>
            {editingId && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setEditingId(null); setForm(EMPTY_FORM); }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          products.map((p) => (
            <View key={p._id} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productMeta}>
                  {`$${p.price} · Stock: ${p.stock}${p.isFlashSale ? " · FLASH" : ""}`}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <TouchableOpacity onPress={() => handleEdit(p)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(p._id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.lg },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.lg },
  center: { alignItems: "center", padding: SPACING.xl * 2 },
  emptyTitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.lg },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  btnText: { color: COLORS.white, fontWeight: "700" },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  formTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: SPACING.md },
  imagePicker: { marginBottom: SPACING.md },
  imageOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  imageOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.backgroundLight },
  imageKey: { fontSize: 12, color: COLORS.text },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
  },
  flashToggle: { marginBottom: SPACING.md },
  flashText: { color: COLORS.accent, fontWeight: "600" },
  formActions: { flexDirection: "row", gap: SPACING.md },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: { color: COLORS.white, fontWeight: "700" },
  cancelBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: { color: COLORS.textMuted, fontWeight: "600" },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  productMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  rowActions: { flexDirection: "row", gap: SPACING.md },
  editText: { color: COLORS.primary, fontWeight: "600" },
  deleteText: { color: COLORS.error, fontWeight: "600" },
});

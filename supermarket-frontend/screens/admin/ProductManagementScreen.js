import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../../services/api";
import { PRODUCT_IMAGES } from "../../constants/images";
import { FALLBACK_PRODUCTS } from "../../constants/fallbackData";

const EMPTY = { name: "", description: "", price: "", originalPrice: "", stock: "", image: PRODUCT_IMAGES.default, rating: "5", isFlashSale: false };

export default function ProductManagementScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p.data?.length ? p.data : FALLBACK_PRODUCTS);
      setCategories(c.data || []);
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.price) return Alert.alert("Validation", "Name and price required.");
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price) * 1.15,
      stock: parseInt(form.stock, 10) || 0,
      image: form.image,
      rating: parseFloat(form.rating) || 5,
      isFlashSale: form.isFlashSale,
      category: categories[0]?._id,
    };
    try {
      if (editingId && !String(editingId).startsWith("fb")) {
        await updateProduct(editingId, payload);
      } else if (!editingId) {
        await createProduct(payload);
      }
      setForm(EMPTY); setEditingId(null); await load();
      Alert.alert("Success", editingId ? "Product updated." : "Product added to supermarket catalog.");
    } catch {
      Alert.alert("Error", "Could not save. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description || "", price: String(p.price), originalPrice: String(p.originalPrice || ""), stock: String(p.stock || ""), image: p.image || PRODUCT_IMAGES.default, rating: String(p.rating || 5), isFlashSale: !!p.isFlashSale });
  };

  const remove = (id) => {
    if (String(id).startsWith("fb")) return Alert.alert("Demo", "Connect backend to manage live products.");
    Alert.alert("Delete", "Remove this product?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteProduct(id); load(); } },
    ]);
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Product Management" subtitle="Manage supermarket product catalog, pricing, and inventory">
      <View style={s.card}>
        <Text style={s.cardTitle}>{editingId ? "Edit Product" : "Add New Supermarket Product"}</Text>
        {["name", "description", "price", "originalPrice", "stock", "image", "rating"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f} value={form[f]} onChangeText={(v) => setForm({ ...form, [f]: v })} />
        ))}
        <TouchableOpacity onPress={() => setForm({ ...form, isFlashSale: !form.isFlashSale })}>
          <Text style={{ color: "#ff6b00", fontWeight: "600" }}>{form.isFlashSale ? "✓ Weekly Special" : "○ Mark as Weekly Special"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.saveBtnText}>{editingId ? "UPDATE PRODUCT" : "ADD PRODUCT"}</Text>}
        </TouchableOpacity>
        {editingId && <TouchableOpacity style={s.cancelBtn} onPress={() => { setEditingId(null); setForm(EMPTY); }}><Text style={s.cancelText}>Cancel Edit</Text></TouchableOpacity>}
      </View>
      {loading ? <ActivityIndicator /> : products.map((p) => (
        <View key={p._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{p.name}</Text>
            <Text style={s.rowMeta}>${p.price} · Stock: {p.stock}{p.isFlashSale ? " · SPECIAL" : ""}</Text>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => edit(p)}><Text style={s.editText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => remove(p._id)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

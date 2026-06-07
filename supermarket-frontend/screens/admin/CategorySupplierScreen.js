import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getSuppliers, createSupplier, updateSupplier, deleteSupplier,
} from "../../services/api";
import { COLORS } from "../../constants/theme";

export default function CategorySupplierScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [catForm, setCatForm] = useState({ name: "", description: "", aisle: "" });
  const [supForm, setSupForm] = useState({ name: "", contact: "", email: "", address: "", items: "" });
  const [editCatId, setEditCatId] = useState(null);
  const [editSupId, setEditSupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [c, sup] = await Promise.all([getCategories(), getSuppliers()]);
      setCategories(c.data || []);
      setSuppliers(sup.data || []);
    } catch {
      setCategories([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!catForm.name) return Alert.alert("Validation", "Category name required.");
    try {
      if (editCatId) await updateCategory(editCatId, catForm);
      else await createCategory(catForm);
      setCatForm({ name: "", description: "", aisle: "" });
      setEditCatId(null);
      load();
    } catch { Alert.alert("Error", "Could not save category."); }
  };

  const saveSupplier = async () => {
    if (!supForm.name) return Alert.alert("Validation", "Supplier name required.");
    const payload = { ...supForm, items: supForm.items ? supForm.items.split(",").map((i) => i.trim()) : [] };
    try {
      if (editSupId) await updateSupplier(editSupId, payload);
      else await createSupplier(payload);
      setSupForm({ name: "", contact: "", email: "", address: "", items: "" });
      setEditSupId(null);
      load();
    } catch { Alert.alert("Error", "Could not save supplier."); }
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Category & Supplier Management" subtitle="Organize supermarket aisles and manage supplier contacts">
      <View style={s.card}>
        <Text style={s.cardTitle}>{editCatId ? "Edit Category / Aisle" : "Add Supermarket Category"}</Text>
        {["name", "description", "aisle"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f === "aisle" ? "Aisle Number (e.g. A3)" : f} value={catForm[f]} onChangeText={(v) => setCatForm({ ...catForm, [f]: v })} />
        ))}
        <TouchableOpacity style={s.saveBtn} onPress={saveCategory}><Text style={s.saveBtnText}>{editCatId ? "UPDATE CATEGORY" : "ADD CATEGORY"}</Text></TouchableOpacity>
      </View>

      {categories.map((c) => (
        <View key={c._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{c.name}</Text>
            <Text style={s.rowMeta}>Aisle: {c.aisle || "—"} · {c.description || "No description"}</Text>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditCatId(c._id); setCatForm({ name: c.name, description: c.description || "", aisle: c.aisle || "" }); }}><Text style={s.editText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(c._id).then(load)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={[s.card, { marginTop: 20 }]}>
        <Text style={s.cardTitle}>{editSupId ? "Edit Supplier" : "Add Supplier"}</Text>
        {["name", "contact", "email", "address", "items"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f === "items" ? "Products supplied (comma-separated)" : f} value={supForm[f]} onChangeText={(v) => setSupForm({ ...supForm, [f]: v })} />
        ))}
        <TouchableOpacity style={s.saveBtn} onPress={saveSupplier}><Text style={s.saveBtnText}>{editSupId ? "UPDATE SUPPLIER" : "ADD SUPPLIER"}</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator /> : suppliers.map((sup) => (
        <View key={sup._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{sup.name}</Text>
            <Text style={s.rowMeta}>{sup.contact} · {sup.email || ""}</Text>
            <Text style={s.rowMeta}>Supplies: {(sup.items || []).join(", ") || "—"}</Text>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditSupId(sup._id); setSupForm({ name: sup.name, contact: sup.contact || "", email: sup.email || "", address: sup.address || "", items: (sup.items || []).join(", ") }); }}><Text style={s.editText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSupplier(sup._id).then(load)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

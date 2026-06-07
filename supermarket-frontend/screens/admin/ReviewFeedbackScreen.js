import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import { getReviews, createReview, updateReview, deleteReview } from "../../services/api";
import StarRating from "../../components/StarRating";
import { COLORS } from "../../constants/theme";

export default function ReviewFeedbackScreen({ navigation, route }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ userName: "", productId: "", productName: "", rating: "5", comment: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.productName || !form.comment) return Alert.alert("Validation", "Product name and comment required.");
    const payload = { ...form, rating: parseInt(form.rating, 10) || 5, userId: "admin" };
    try {
      if (editId) await updateReview(editId, payload);
      else await createReview(payload);
      setForm({ userName: "", productId: "", productName: "", rating: "5", comment: "" });
      setEditId(null);
      load();
    } catch { Alert.alert("Error", "Could not save review."); }
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Customer Review & Feedback" subtitle="Monitor ratings, comments, and customer satisfaction">
      <View style={s.card}>
        <Text style={s.cardTitle}>{editId ? "Edit Review" : "Add Review / Response"}</Text>
        {["userName", "productId", "productName", "rating", "comment"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f} value={form[f]} onChangeText={(v) => setForm({ ...form, [f]: v })} multiline={f === "comment"} />
        ))}
        <TouchableOpacity style={s.saveBtn} onPress={save}><Text style={s.saveBtnText}>{editId ? "UPDATE REVIEW" : "ADD REVIEW"}</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator /> : reviews.length === 0 ? (
        <Text style={{ textAlign: "center", color: COLORS.textMuted, padding: 20 }}>No reviews yet. Customers can leave feedback on product pages.</Text>
      ) : reviews.map((r) => (
        <View key={r._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{r.productName || "Product"}</Text>
            <Text style={s.rowMeta}>By: {r.userName || "Customer"}</Text>
            <StarRating rating={r.rating} size={12} />
            <Text style={[s.rowMeta, { marginTop: 4 }]}>{r.comment}</Text>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditId(r._id); setForm({ userName: r.userName || "", productId: r.productId || "", productName: r.productName || "", rating: String(r.rating), comment: r.comment || "" }); }}>
              <Text style={s.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteReview(r._id).then(load)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

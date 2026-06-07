import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import { getPayments, createPayment, updatePayment, deletePayment } from "../../services/api";
import { COLORS } from "../../constants/theme";

const METHODS = ["Card", "Cash on Delivery", "Bank Transfer", "Digital Wallet"];
const STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

export default function PaymentInvoiceScreen({ navigation, route }) {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ orderId: "", userId: "", amount: "", method: "Card", status: "Pending", invoiceNo: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.orderId || !form.amount) return Alert.alert("Validation", "Order ID and amount required.");
    const payload = { ...form, amount: parseFloat(form.amount) };
    try {
      if (editId) await updatePayment(editId, payload);
      else await createPayment(payload);
      setForm({ orderId: "", userId: "", amount: "", method: "Card", status: "Pending", invoiceNo: "" });
      setEditId(null);
      load();
      Alert.alert("Success", editId ? "Payment updated." : "Payment & invoice recorded.");
    } catch { Alert.alert("Error", "Could not save payment."); }
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Payment & Invoice Management" subtitle="Record payments, issue invoices, and track transaction status">
      <View style={s.card}>
        <Text style={s.cardTitle}>{editId ? "Edit Payment / Invoice" : "Record New Payment"}</Text>
        {["orderId", "userId", "amount", "invoiceNo"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f} value={form[f]} onChangeText={(v) => setForm({ ...form, [f]: v })} />
        ))}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Payment Method</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {METHODS.map((m) => (
            <TouchableOpacity key={m} onPress={() => setForm({ ...form, method: m })} style={{ padding: 8, borderRadius: 6, backgroundColor: form.method === m ? COLORS.primary : "#f0f0f0" }}>
              <Text style={{ color: form.method === m ? "#fff" : COLORS.text, fontSize: 12 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Status</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {STATUSES.map((st) => (
            <TouchableOpacity key={st} onPress={() => setForm({ ...form, status: st })} style={{ padding: 8, borderRadius: 6, backgroundColor: form.status === st ? COLORS.accent : "#f0f0f0" }}>
              <Text style={{ color: form.status === st ? "#fff" : COLORS.text, fontSize: 12 }}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.saveBtn} onPress={save}><Text style={s.saveBtnText}>{editId ? "UPDATE PAYMENT" : "CREATE INVOICE"}</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator /> : payments.map((p) => (
        <View key={p._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>Invoice: {p.invoiceNo || "—"}</Text>
            <Text style={s.rowMeta}>Order: {String(p.orderId).slice(-6)} · ${Number(p.amount).toFixed(2)} · {p.method}</Text>
            <View style={[s.statusBadge, { backgroundColor: p.status === "Paid" ? "#4caf50" : p.status === "Failed" ? "#e53935" : "#ff9800" }]}>
              <Text style={s.statusText}>{p.status}</Text>
            </View>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditId(p._id); setForm({ orderId: p.orderId || "", userId: p.userId || "", amount: String(p.amount), method: p.method, status: p.status, invoiceNo: p.invoiceNo || "" }); }}>
              <Text style={s.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePayment(p._id).then(load)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

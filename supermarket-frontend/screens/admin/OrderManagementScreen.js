import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import { getOrders, updateOrder, deleteOrder } from "../../services/api";
import { COLORS } from "../../constants/theme";

const STATUSES = ["Pending", "Confirmed", "Packing", "Out for Delivery", "Delivered", "Cancelled"];
const STATUS_COLORS = { Pending: "#ff9800", Confirmed: "#2196f3", Packing: "#9c27b0", "Out for Delivery": "#ff6b00", Delivered: "#4caf50", Cancelled: "#e53935" };

export default function OrderManagementScreen({ navigation, route }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [address, setAddress] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await updateOrder(editingId, { status, address });
      setEditingId(null);
      await load();
      Alert.alert("Updated", "Order status updated.");
    } catch {
      Alert.alert("Error", "Could not update order.");
    }
  };

  const remove = (id) => {
    Alert.alert("Delete Order", "Remove this order record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteOrder(id); load(); } },
    ]);
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Order Management" subtitle="Track and update customer supermarket orders">
      {editingId && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Update Order #{String(editingId).slice(-6)}</Text>
          <Text style={{ marginBottom: 8, fontWeight: "600" }}>Status</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {STATUSES.map((st) => (
              <TouchableOpacity key={st} onPress={() => setStatus(st)} style={{ padding: 8, borderRadius: 6, backgroundColor: status === st ? COLORS.primary : "#f0f0f0" }}>
                <Text style={{ color: status === st ? "#fff" : COLORS.text, fontSize: 12 }}>{st}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={s.input} placeholder="Delivery Address" value={address} onChangeText={setAddress} />
          <TouchableOpacity style={s.saveBtn} onPress={save}><Text style={s.saveBtnText}>SAVE CHANGES</Text></TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={() => setEditingId(null)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
        </View>
      )}
      {loading ? <ActivityIndicator /> : orders.length === 0 ? (
        <Text style={{ textAlign: "center", color: COLORS.textMuted, padding: 20 }}>No orders yet. Orders appear when customers checkout.</Text>
      ) : orders.map((o) => (
        <View key={o._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>Order #{String(o._id).slice(-6).toUpperCase()}</Text>
            <Text style={s.rowMeta}>{o.items?.length || 0} items · ${Number(o.total || 0).toFixed(2)}</Text>
            {o.address && <Text style={s.rowMeta}>{o.address}</Text>}
            <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[o.status] || COLORS.primary }]}>
              <Text style={s.statusText}>{o.status || "Pending"}</Text>
            </View>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditingId(o._id); setStatus(o.status || "Pending"); setAddress(o.address || ""); }}>
              <Text style={s.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => remove(o._id)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

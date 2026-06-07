import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AdminPageLayout from "../../components/AdminPageLayout";
import { adminStyles as s } from "../../components/adminStyles";
import { getDeliveries, createDelivery, updateDelivery, deleteDelivery } from "../../services/api";
import { COLORS } from "../../constants/theme";

const STATUSES = ["Preparing", "Packed", "Out for Delivery", "Near Destination", "Delivered"];

export default function DeliveryTrackingScreen({ navigation, route }) {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({ orderId: "", driverName: "", driverPhone: "", vehicle: "", status: "Preparing", eta: "", currentLocation: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getDeliveries();
      setDeliveries(res.data || []);
    } catch {
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.orderId || !form.driverName) return Alert.alert("Validation", "Order ID and driver name required.");
    try {
      if (editId) await updateDelivery(editId, form);
      else await createDelivery(form);
      setForm({ orderId: "", driverName: "", driverPhone: "", vehicle: "", status: "Preparing", eta: "", currentLocation: "" });
      setEditId(null);
      load();
      Alert.alert("Success", editId ? "Delivery updated." : "Delivery assigned to driver.");
    } catch { Alert.alert("Error", "Could not save delivery."); }
  };

  const statusColor = (st) => {
    if (st === "Delivered") return "#4caf50";
    if (st === "Out for Delivery") return "#ff6b00";
    if (st === "Near Destination") return "#2196f3";
    return "#ff9800";
  };

  return (
    <AdminPageLayout navigation={navigation} route={route} title="Delivery & Driver Tracking" subtitle="Assign drivers, update delivery status, and track shipments">
      <View style={s.card}>
        <Text style={s.cardTitle}>{editId ? "Update Delivery" : "Assign New Delivery"}</Text>
        {["orderId", "driverName", "driverPhone", "vehicle", "eta", "currentLocation"].map((f) => (
          <TextInput key={f} style={s.input} placeholder={f === "currentLocation" ? "Current Location (e.g. Main St & 5th Ave)" : f} value={form[f]} onChangeText={(v) => setForm({ ...form, [f]: v })} />
        ))}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Delivery Status</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {STATUSES.map((st) => (
            <TouchableOpacity key={st} onPress={() => setForm({ ...form, status: st })} style={{ padding: 8, borderRadius: 6, backgroundColor: form.status === st ? COLORS.primary : "#f0f0f0" }}>
              <Text style={{ color: form.status === st ? "#fff" : COLORS.text, fontSize: 11 }}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.saveBtn} onPress={save}><Text style={s.saveBtnText}>{editId ? "UPDATE DELIVERY" : "ASSIGN DRIVER"}</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator /> : deliveries.map((d) => (
        <View key={d._id} style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>Order #{String(d.orderId).slice(-6)} — {d.driverName}</Text>
            <Text style={s.rowMeta}>🚗 {d.vehicle || "Van"} · 📞 {d.driverPhone || "—"}</Text>
            <Text style={s.rowMeta}>📍 {d.currentLocation || "Warehouse"} · ETA: {d.eta || "—"}</Text>
            <View style={[s.statusBadge, { backgroundColor: statusColor(d.status) }]}>
              <Text style={s.statusText}>{d.status}</Text>
            </View>
          </View>
          <View style={s.rowActions}>
            <TouchableOpacity onPress={() => { setEditId(d._id); setForm({ orderId: d.orderId || "", driverName: d.driverName || "", driverPhone: d.driverPhone || "", vehicle: d.vehicle || "", status: d.status || "Preparing", eta: d.eta || "", currentLocation: d.currentLocation || "" }); }}>
              <Text style={s.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteDelivery(d._id).then(load)}><Text style={s.deleteText}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </AdminPageLayout>
  );
}

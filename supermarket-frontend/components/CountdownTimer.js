import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function CountdownTimer({ endDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = endDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const tick = () => {
      const diff = Math.max(0, new Date(target) - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.mins },
    { label: "Secs", value: time.secs },
  ];

  return (
    <View style={styles.row}>
      {blocks.map((b) => (
        <View key={b.label} style={styles.block}>
          <Text style={styles.value}>{String(b.value).padStart(2, "0")}</Text>
          <Text style={styles.label}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  block: {
    backgroundColor: COLORS.countdown,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 44,
  },
  value: { color: COLORS.white, fontWeight: "700", fontSize: 14 },
  label: { color: COLORS.white, fontSize: 9 },
});

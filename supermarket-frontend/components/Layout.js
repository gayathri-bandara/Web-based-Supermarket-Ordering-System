import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
import Header from "./Header";

export default function Layout({ navigation, route, children, scrollable = true }) {
  const content = scrollable ? (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} currentRoute={route?.name} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundLight },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
});

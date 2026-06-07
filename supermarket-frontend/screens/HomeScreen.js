import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    fetchProducts();
  },[]);

  const fetchProducts = async ()=>{
    const res = await getProducts();
    setProducts(res.data);
  };

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item)=>item._id}
      />
    </View>
  );
}
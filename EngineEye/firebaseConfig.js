import React from "react";
import { Button, View } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Yukarıdaki dosyanın yolu

export default function App() {
  const addCarData = async () => {
    try {
      await addDoc(collection(db, "cars"), {
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
      });
      console.log("Araba bilgisi başarıyla eklendi!");
    } catch (e) {
      console.error("Hata:", e);
    }
  };

  return (
    <View>
      <Button title="Araba Ekle" onPress={addCarData} />
    </View>
  );
}

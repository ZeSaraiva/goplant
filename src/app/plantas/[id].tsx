import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import { useLocalSearchParams } from "expo-router";

export default function PlantaDetalhe() {
  const { id } = useLocalSearchParams();
  const [planta, setPlanta] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanta = async () => {
      if (!id) return;
      const docRef = doc(db, "plantas", id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlanta(docSnap.data());
      }
      setLoading(false);
    };
    fetchPlanta();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (!planta) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Planta não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{ uri: planta.imagem_url }}
        style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16 }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{planta.nome_comum}</Text>
      <Text style={{ fontStyle: "italic", color: "#555", marginBottom: 12 }}>
        {planta.nome_cientifico}
      </Text>

      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Descrição:</Text> {planta.descricao}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Tipo:</Text> {planta.tipo}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Família:</Text> {planta.familia}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Luminosidade:</Text> {planta.luminosidade}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Temperatura:</Text> {planta.temperatura}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Frequência de Água:</Text> {planta.frequencia_agua}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Quantidade de Água:</Text> {planta.quantidade_agua}</Text>
    </ScrollView>
  );
}

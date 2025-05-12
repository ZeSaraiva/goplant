import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput,FlatList, TouchableOpacity , } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig"; // ajusta o caminho conforme o teu projeto
import { useRouter } from "expo-router";


export default function ListaPlantas() {
  const [plantas, setPlantas] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtradas, setFiltradas] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchPlantas = async () => {
      const plantasRef = collection(db, "plantas");
      const snapshot = await getDocs(plantasRef);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlantas(lista);
      setFiltradas(lista);
    };
    fetchPlantas();
  }, []);

  useEffect(() => {
    const termo = pesquisa.toLowerCase();
    const resultados = plantas.filter((planta) =>
      planta.nome_comum.toLowerCase().includes(termo) ||
      planta.nome_cientifico.toLowerCase().includes(termo)
    );
    setFiltradas(resultados);
  }, [pesquisa, plantas]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Pesquisar planta..."
        value={pesquisa}
        onChangeText={setPesquisa}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/plantas/${item.id}`)} // redireciona para o detalhe
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Image
              source={{ uri: item.imagem_url }}
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
            />
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.nome_comum}</Text>
              <Text style={{ fontStyle: "italic", color: "#555" }}>{item.nome_cientifico}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


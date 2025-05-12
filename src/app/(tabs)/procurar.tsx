// Importação de bibliotecas e módulos necessários
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput,FlatList, TouchableOpacity , } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig"; // ajusta o caminho conforme o teu projeto
import { useRouter } from "expo-router";

// Componente principal que exibe a lista de plantas
export default function ListaPlantas() {
  // Estados para armazenar as plantas, termo de pesquisa e plantas filtradas
  const [plantas, setPlantas] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtradas, setFiltradas] = useState<any[]>([]);

  const router = useRouter(); // Hook para navegação

  // useEffect para buscar as plantas do Firestore ao montar o componente
  useEffect(() => {
    const fetchPlantas = async () => {
      const plantasRef = collection(db, "plantas"); // Referência à coleção "plantas"
      const snapshot = await getDocs(plantasRef); // Obtém os documentos da coleção
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Mapeia os dados para um array
      setPlantas(lista); // Atualiza o estado com a lista de plantas
      setFiltradas(lista); // Inicialmente, todas as plantas são exibidas
    };
    fetchPlantas();
  }, []);

  // useEffect para filtrar as plantas com base no termo de pesquisa
  useEffect(() => {
    const termo = pesquisa.toLowerCase(); // Converte o termo de pesquisa para minúsculas
    const resultados = plantas.filter((planta) =>
      planta.nome_comum.toLowerCase().includes(termo) || // Verifica se o nome comum contém o termo
      planta.nome_cientifico.toLowerCase().includes(termo) // Verifica se o nome científico contém o termo
    );
    setFiltradas(resultados); // Atualiza o estado com as plantas filtradas
  }, [pesquisa, plantas]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Campo de entrada para pesquisa */}
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

      {/* Lista de plantas filtradas */}
      <FlatList
        data={filtradas} // Dados a serem exibidos
        keyExtractor={(item) => item.id} // Chave única para cada item
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/plantas/${item.id}`)} // Redireciona para a página de detalhes da planta
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
              padding: 10,
            }}
          >
            {/* Imagem da planta */}
            <Image
              source={{ uri: item.imagem_url }}
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
            />
            <View>
              {/* Nome comum da planta */}
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.nome_comum}</Text>
              {/* Nome científico da planta */}
              <Text style={{ fontStyle: "italic", color: "#555" }}>{item.nome_cientifico}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


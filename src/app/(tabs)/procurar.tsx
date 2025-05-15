// Importação de bibliotecas e módulos necessários
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig"; // ajusta o caminho conforme o teu projeto
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantaGuardada } from '../../PlantaGuardada';

// Componente principal que exibe a lista de plantas
export default function ListaPlantas() {
  // Estados para armazenar as plantas, termo de pesquisa e plantas filtradas
  const [plantas, setPlantas] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtradas, setFiltradas] = useState<any[]>([]);
  const [plantasGuardadas, setPlantasGuardadas] = useState<PlantaGuardada[]>([]);

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

  // useEffect para buscar plantas guardadas localmente
  useEffect(() => {
    const fetchPlantasGuardadas = async () => {
      const stored = await AsyncStorage.getItem('plantasGuardadas');
      if (stored) setPlantasGuardadas(JSON.parse(stored));
      else setPlantasGuardadas([]);
    };
    fetchPlantasGuardadas();
  }, []);

  // Atualiza plantas guardadas ao focar a tab
  useFocusEffect(
    React.useCallback(() => {
      const fetchPlantasGuardadas = async () => {
        const stored = await AsyncStorage.getItem('plantasGuardadas');
        if (stored) setPlantasGuardadas(JSON.parse(stored));
        else setPlantasGuardadas([]);
      };
      fetchPlantasGuardadas();
    }, [])
  );

  // useEffect para filtrar as plantas com base no termo de pesquisa
  useEffect(() => {
    const termo = pesquisa.toLowerCase(); // Converte o termo de pesquisa para minúsculas
    const resultados = plantas.filter((planta) =>
      planta.nome_comum.toLowerCase().includes(termo) || // Verifica se o nome comum contém o termo
      planta.nome_cientifico.toLowerCase().includes(termo) // Verifica se o nome científico contém o termo
    );
    setFiltradas(resultados); // Atualiza o estado com as plantas filtradas
  }, [pesquisa, plantas]);

  // Função para adicionar planta
  const adicionarPlanta = async (planta: any) => {
    const dataUmMesAntes = new Date();
    dataUmMesAntes.setMonth(dataUmMesAntes.getMonth() - 1);
    const nova: PlantaGuardada = {
      ...planta,
      ultima_rega: dataUmMesAntes.toISOString(),
      notificacoes_ativas: true,
    };
    const atualizadas = [...plantasGuardadas, nova];
    setPlantasGuardadas(atualizadas);
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
  };

  // Função para remover planta
  const removerPlanta = async (id: string) => {
    const atualizadas = plantasGuardadas.filter((p) => p.id !== id);
    setPlantasGuardadas(atualizadas);
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
  };

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
        renderItem={({ item }) => {
          const jaGuardada = plantasGuardadas.some((p) => p.id === item.id);
          return (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 8,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push(`/plantas/${item.id}`)}
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.imagem_url }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    marginRight: 10,
                    backgroundColor: "#eee",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 15, color: "#222" }}>
                    {item.nome_comum}
                  </Text>
                  <Text style={{ fontStyle: "italic", color: "#888", fontSize: 12 }}>
                    {item.nome_cientifico}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  jaGuardada ? removerPlanta(item.id) : adicionarPlanta(item)
                }
                style={{ marginLeft: 8, padding: 4 }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: jaGuardada ? "#ef4444" : "#22c55e",
                  }}
                >
                  {jaGuardada ? "❌" : "➕"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


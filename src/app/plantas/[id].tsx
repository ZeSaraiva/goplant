import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, Modal, Pressable, Alert, Dimensions } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import QRCodeSVG from "react-native-qrcode-svg";

export default function PlantaDetalhe() {
  const { id } = useLocalSearchParams();
  const [planta, setPlanta] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;

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

  const gerarQr = () => {
    setQrVisible(true);
  };

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
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Frequência de Água (Dias):</Text> {planta.frequencia_agua}</Text>
      <Text style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Quantidade de Água:</Text> {planta.quantidade_agua}</Text>

      <Pressable
        onPress={gerarQr}
        style={{
          backgroundColor: "#4caf50",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Exportar QR</Text>
      </Pressable>

      <Modal visible={qrVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", padding: 24, borderRadius: 16, alignItems: "center", width: screenWidth * 0.95 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 28,
                color: "#4caf50",
                marginBottom: 24,
                marginTop: 8,
                textAlign: 'center',
                textShadowColor: 'rgba(76, 175, 80, 0.3)',
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 8,
                letterSpacing: 1.2,
              }}
            >
              {planta?.nome_comum}
            </Text>
            {id && (
              <QRCodeSVG
                value={id.toString()}
                size={200}
              />
            )}
            <Pressable onPress={() => setQrVisible(false)} style={{ marginTop: 24 }}>
              <Text style={{ color: "#4caf50", fontWeight: "bold" }}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

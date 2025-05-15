import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { PlantaGuardada } from '../../PlantaGuardada';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';

export default function Dashboard() {
  const [plantasGuardadas, setPlantasGuardadas] = useState<PlantaGuardada[]>([]);
  const [proximasAcoes, setProximasAcoes] = useState<any[]>([]);
  const [dica, setDica] = useState<string | null>(null);
  const router = useRouter();

  // Atualiza ao focar o tab
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

  useEffect(() => {
    // Calcular próximas ações (rega atrasada, fertilização, etc)
    const acoes: any[] = [];
    plantasGuardadas.forEach((planta) => {
      const dias = Math.floor((new Date().getTime() - new Date(planta.ultima_rega).getTime()) / (1000 * 60 * 60 * 24));
      if (dias >= planta.frequencia_agua) {
        acoes.push({
          tipo: 'rega',
          planta,
          mensagem: `${planta.nome_comum} precisa de rega`,
        });
      }
    });
    setProximasAcoes(acoes);
  }, [plantasGuardadas]);

  useEffect(() => {
    const fetchDica = async () => {
      try {
        const dicasRef = collection(db, 'dicas');
        const snapshot = await getDocs(dicasRef);
        const dicas = snapshot.docs.map(doc => doc.data().mensagem);
        if (dicas.length > 0) {
          // Troca a dica do dia a cada dia (baseado na data)
          const idx = new Date().getDate() % dicas.length;
          setDica(dicas[idx]);
        }
      } catch (e) {
        setDica(null);
      }
    };
    fetchDica();
  }, []);

  // Última planta regada (exemplo: a mais recente)
  const plantaRecente = plantasGuardadas.length > 0
    ? plantasGuardadas.reduce((a, b) => (a.ultima_rega > b.ultima_rega ? a : b))
    : null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#222' }}>Go Plant</Text>
      {/* Dica do dia */}
      {dica && (
        <View style={{ backgroundColor: '#eaf6ea', borderRadius: 14, padding: 16, marginBottom: 18, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>💡</Text>
          <Text style={{ color: '#22543d', flex: 1 }}>{dica}</Text>
        </View>
      )}
      {/* Cards principais */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={styles.card}>
          <View style={{ backgroundColor: '#eaf6ea', borderRadius: 999, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, color: '#22543d' }}>🌡️</Text>
          </View>
          <Text style={styles.cardNumber}>{plantasGuardadas.filter(p => {
            const dias = Math.floor((new Date().getTime() - new Date(p.ultima_rega).getTime()) / (1000 * 60 * 60 * 24));
            return dias >= p.frequencia_agua;
          }).length}</Text>
          <Text style={styles.cardLabel}>Plantas com cuidados pendentes hoje</Text>
        </View>
        <View style={styles.card}>
          <View style={{ backgroundColor: '#eaf6ea', borderRadius: 999, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, color: '#22543d' }}>💧</Text>
          </View>
          <Text style={styles.cardNumber}>{plantaRecente ? plantaRecente.nome_comum : '-'}</Text>
          <Text style={styles.cardLabel}>{plantaRecente ? `há ${Math.floor((new Date().getTime() - new Date(plantaRecente.ultima_rega).getTime()) / (1000 * 60 * 60 * 24))} dias` : 'Sem regas recentes'}</Text>
        </View>
        <View style={styles.card}>
          <View style={{ backgroundColor: '#eaf6ea', borderRadius: 999, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, color: '#22543d' }}>🌱</Text>
          </View>
          <Text style={styles.cardNumber}>{plantasGuardadas.length}</Text>
          <Text style={styles.cardLabel}>Total de plantas registradas</Text>
        </View>
      </View>
      {/* Próximas ações */}
      <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Próximas ações</Text>
        {proximasAcoes.length === 0 ? (
          <Text style={{ color: '#22c55e' }}>Nenhuma ação pendente 🎉</Text>
        ) : (
          proximasAcoes.slice(0, 2).map((acao, idx) => (
            <View key={acao.planta.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontSize: 18, marginRight: 6 }}>{acao.tipo === 'rega' ? '⚠️' : 'ℹ️'}</Text>
              <Text style={{ flex: 1 }}>{acao.mensagem}</Text>
              <TouchableOpacity onPress={() => router.push('/cuidados')} style={{ backgroundColor: '#e5f7eb', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 }}>
                <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>Regar agora</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {proximasAcoes.length > 2 && (
          <TouchableOpacity onPress={() => router.push('/cuidados')} style={{ alignSelf: 'flex-end', marginTop: 4 }}>
            <Text style={{ color: '#888' }}>Ver mais</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Plantas recentes */}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Plantas recentes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        {plantasGuardadas.slice(-4).reverse().map((planta) => (
          <TouchableOpacity key={planta.id} onPress={() => router.push(`/plantas/${planta.id}`)} style={{ backgroundColor: '#fff', borderRadius: 14, marginRight: 12, width: 140, padding: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <Image source={{ uri: planta.imagem_url }} style={{ width: '100%', height: 70, borderRadius: 10, marginBottom: 8, backgroundColor: '#eee' }} />
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#222' }}>{planta.nome_comum}</Text>
            <Text style={{ color: '#888', fontSize: 12 }}>Ver detalhes</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f6faf7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: 110,
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardNumber: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#22c55e',
    marginBottom: 2,
  },
  cardLabel: {
    color: '#222',
    fontSize: 12,
    textAlign: 'center',
  },
});

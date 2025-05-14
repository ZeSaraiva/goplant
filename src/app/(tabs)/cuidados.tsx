import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantaGuardada } from '../../PlantaGuardada';
import { View, Text, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function Cuidados() {
  const [plantasGuardadas, setPlantasGuardadas] = useState<PlantaGuardada[]>([]);

  const atualizarPlantasGuardadas = async () => {
    const stored = await AsyncStorage.getItem('plantasGuardadas');
    if (stored) setPlantasGuardadas(JSON.parse(stored));
    else setPlantasGuardadas([]);
  };

  useEffect(() => {
    atualizarPlantasGuardadas();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      atualizarPlantasGuardadas();
    }, [])
  );

  useEffect(() => {
    // Pedir permissão para notificações ao abrir a app
    Notifications.requestPermissionsAsync();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('rega', {
        name: 'Rega das Plantas',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  const diasDesdeUltimaRega = (ultima: string) => {
    const ultimaData = new Date(ultima);
    const hoje = new Date();
    return Math.floor((hoje.getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24));
  };

  const regarHoje = async (id: string) => {
    const atualizadas = plantasGuardadas.map(planta =>
      planta.id === id ? { ...planta, ultima_rega: new Date().toISOString() } : planta
    );
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
    atualizarPlantasGuardadas();
  };

  const toggleNotificacao = async (id: string) => {
    const atualizadas = plantasGuardadas.map(planta =>
      planta.id === id ? { ...planta, notificacoes_ativas: !planta.notificacoes_ativas } : planta
    );
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
    atualizarPlantasGuardadas();
  };

  const adicionarPlanta = async (planta: any) => {
    const dataUmMesAntes = new Date();
    dataUmMesAntes.setMonth(dataUmMesAntes.getMonth() - 1);
    const nova: PlantaGuardada = {
      ...planta,
      ultima_rega: dataUmMesAntes.toISOString(),
      notificacoes_ativas: true,
    };
    const atualizadas = [...plantasGuardadas, nova];
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
    atualizarPlantasGuardadas();
  };

  const removerPlanta = async (id: string) => {
    const atualizadas = plantasGuardadas.filter((p) => p.id !== id);
    await AsyncStorage.setItem('plantasGuardadas', JSON.stringify(atualizadas));
    atualizarPlantasGuardadas();
  };

  // Função para disparar notificação local simples
  const notificarPlanta = async (planta: PlantaGuardada) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hora de regar: ${planta.nome_comum}`,
        body: `A tua planta precisa de água hoje! 💧`,
        sound: Platform.OS === 'android' ? undefined : 'default',
      },
      trigger: null, // dispara imediatamente
    });
  };

  // Verifica e dispara notificação para plantas que precisam de rega
  useEffect(() => {
    plantasGuardadas.forEach(planta => {
      if (planta.notificacoes_ativas) {
        const dias = Math.floor((new Date().getTime() - new Date(planta.ultima_rega).getTime()) / (1000 * 60 * 60 * 24));
        if (dias >= planta.frequencia_agua) {
          notificarPlanta(planta);
        }
      }
    });
  }, [plantasGuardadas]);

  return (
    <ScrollView style={{ backgroundColor: '#f3f4f6', padding: 16 }}>
      {plantasGuardadas.map(planta => {
        const dias = diasDesdeUltimaRega(planta.ultima_rega);
        const faltam = planta.frequencia_agua - dias;
        let estado = '✅ OK';
        let estadoCor = '#22c55e';
        if (faltam < 0) {
          estado = '💧 Precisa de água';
          estadoCor = '#ef4444';
        } else if (faltam === 0) {
          estado = '☀️ Hoje';
          estadoCor = '#eab308';
        } else if (faltam > 0) {
          estado = `☀️ Faltam ${faltam} dias`;
          estadoCor = '#eab308';
        }
        return (
          <View key={planta.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Image source={{ uri: planta.imagem_url }} style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: 8, backgroundColor: '#eee' }} />
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222', marginBottom: 2 }}>{planta.nome_comum}</Text>
            <Text style={{ fontStyle: 'italic', color: '#888', fontSize: 13, marginBottom: 6 }}>{planta.nome_cientifico}</Text>
            <Text style={{ fontWeight: 'bold', color: estadoCor, marginBottom: 6 }}>{estado}</Text>
            <Text style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>💧 {planta.quantidade_agua}</Text>
            <Text style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>☀️ {planta.luminosidade}</Text>
            <Text style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>🌡️ {planta.temperatura}</Text>
            <Text style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>🌱 {planta.tipo}</Text>
            <TouchableOpacity onPress={() => regarHoje(planta.id)} style={{ backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start', marginTop: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reguei hoje</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ marginRight: 8, color: '#444' }}>Notificações</Text>
              <Switch value={planta.notificacoes_ativas} onValueChange={() => toggleNotificacao(planta.id)} />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import jsQR from 'jsqr';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
      setPhotoUri(photo.uri);
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 400 } }],
        { base64: true }
      );
      if (!manipResult.base64 || !manipResult.width || !manipResult.height) throw new Error('Falha ao processar imagem');
      const raw = atob(manipResult.base64);
      const buffer = new Uint8ClampedArray(raw.length);
      for (let i = 0; i < raw.length; ++i) buffer[i] = raw.charCodeAt(i);
      const code = jsQR(buffer, manipResult.width, manipResult.height);
      if (code && code.data) {
        Alert.alert('QR code encontrado!', `Abrindo planta: ${code.data}`);
        setTimeout(() => router.push(`/plantas/${code.data}`), 500);
      } else {
        Alert.alert('Nenhum QR code detectado', 'Tente novamente, aproxime mais o QR code.');
      }
    } catch (e) {
      Alert.alert('Erro ao processar imagem', String(e));
    }
    setIsLoading(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.text}>Solicitando permissão para a câmera...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem permissão para usar a câmera.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      />
      <View style={styles.overlay}>
        <Text style={styles.textOverlay}>
          Aponte para um QR code e toque em "Ler QR code". O app abrirá a planta correspondente.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePicture}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Processando...' : 'Ler QR code'}</Text>
        </TouchableOpacity>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.preview} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    padding: 24,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 16,
  },
  textOverlay: {
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  preview: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
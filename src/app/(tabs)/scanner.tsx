import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Scanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        O recurso de scanner foi descontinuado e removido do app.
      </Text>
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
});

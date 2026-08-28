import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const HOTLINE_NUMBER = '1388';

export default function CounselingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>청소년 상담 전화</Text>
      <Text style={styles.description}>1388로 언제든지 무료 상담을 받을 수 있습니다.</Text>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => Linking.openURL(`tel:${HOTLINE_NUMBER}`)}
        testID="counseling-call-button"
      >
        <Text style={styles.callButtonText}>1388 전화하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  callButton: { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  callButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

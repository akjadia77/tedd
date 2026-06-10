import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setLanguage } from '../store/slices/languageSlice';
import { switchLanguageApi } from '../api/apiService';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import Toast from 'react-native-toast-message';

type Props = {
  route: RouteProp<RootStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ route }: Props) {
  const { mobile } = route.params;
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.current);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    try {
      setLoading(true);
      await switchLanguageApi(newLang);
      dispatch(setLanguage(newLang));
      Toast.show({ type: 'success', text1: `Language changed to ${newLang}` });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message || 'Failed to update language' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome! 👋</Text>
      <Text style={styles.mobile}>+91 {mobile}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Language</Text>
        <Text style={styles.langValue}>
          {language === 'english' ? '🇬🇧 English' : '🇮🇳 Hindi'}
        </Text>
      </View>

      <TouchableOpacity style={styles.toggleBtn} onPress={handleToggle} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.toggleText}>
              Switch to {language === 'english' ? 'Hindi' : 'English'}
            </Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc', justifyContent: 'center' },
  welcome: { fontSize: 32, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  mobile: { fontSize: 18, color: '#64748b', marginBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 24, elevation: 2 },
  label: { fontSize: 14, color: '#94a3b8', marginBottom: 6 },
  langValue: { fontSize: 20, fontWeight: '600', color: '#1e293b' },
  toggleBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center' },
  toggleText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
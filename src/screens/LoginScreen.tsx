import React, { useState } from 'react';
import {
    Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginApi } from '../api/apiService';
import Toast from 'react-native-toast-message';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validate = () => /^\d{10}$/.test(mobile);

    const handleLogin = async () => {
        setError('');
        if (!validate()) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        try {
            setLoading(true);
            const response = await loginApi(mobile);
            if (response.data?.status_code === "200" || response.status === 200) {
                Toast.show({ type: 'success', text1: 'OTP Sent Successfully!' });
                navigation.navigate('OTP', { mobile });
            } else {
                setError(response.data?.message || 'Login failed. Try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
            Toast.show({ type: 'error', text1: err.message || 'Network Error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Driver Login</Text>
            <Text style={styles.subtitle}>Enter your mobile number</Text>

            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={text => { setMobile(text); setError(''); }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Send OTP</Text>}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 8 },
    inputError: { borderColor: '#e74c3c' },
    errorText: { color: '#e74c3c', fontSize: 13, marginBottom: 12 },
    button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
import React, { useState } from 'react';
import {
    Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { verifyOtpApi } from '../api/apiService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'OTP'>;
    route: RouteProp<RootStackParamList, 'OTP'>;
};

export default function OTPScreen({ navigation, route }: Props) {
    const { mobile } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async () => {
        setError('');
        if (otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP.');
            return;
        }
        try {
            setLoading(true);
            const response = await verifyOtpApi(mobile, otp);
            if (response.data?.status_code === "200" || response.status === 200) {
                Toast.show({ type: 'success', text1: 'Login Successful!' });
                await AsyncStorage.setItem('auth_token', response.data.token);
                navigation.navigate('Dashboard', { mobile });
            } else {
                setError(response.data?.message || 'Invalid OTP. Try again.');
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>OTP sent to +91 {mobile}</Text>

            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Enter 4-digit OTP"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={text => { setOtp(text); setError(''); }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
                style={styles.button}
                onPress={handleVerify}
                disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Verify OTP</Text>}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    back: { color: '#2563eb', fontSize: 16, marginBottom: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 8, letterSpacing: 8, textAlign: 'center' },
    inputError: { borderColor: '#e74c3c' },
    errorText: { color: '#e74c3c', fontSize: 13, marginBottom: 12 },
    button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
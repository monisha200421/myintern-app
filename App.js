import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          Alert.alert('Success', 'Account created! Now you can sign in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email first to reset password');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else Alert.alert('Sent!', 'Password reset link sent to your email');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail('');
    setPassword('');
  };

  // ===== DASHBOARD - AFTER LOGIN =====
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.logo}>🚀 MyIntern</Text>
          <View style={styles.emailBadge}>
            <Text style={styles.emailBadgeText}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.dashboardContent}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.welcomeSub}>Welcome back! Auth working ✅</Text>

          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardIcon}>👤</Text>
              <Text style={styles.cardTitle}>My Profile</Text>
              <Text style={styles.cardText}>{user.email}</Text>
              <Text style={styles.verified}>● Verified User</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardIcon}>✅</Text>
              <Text style={styles.cardTitle}>Tasks</Text>
              <Text style={styles.cardText}>3 Completed</Text>
              <Text style={styles.cardSmall}>Auth - Done</Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 15 }]}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Internship Status</Text>
            <Text style={styles.cardText}>Authentication Module - 100% Complete</Text>
            <Text style={styles.cardSmall}>Ready for review by mentor</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ===== LOGIN / SIGNUP SCREEN =====
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
      <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>}
        </TouchableOpacity>

        {isLogin && (
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(''); }} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB', paddingTop: 60 },
  topBar: { backgroundColor: 'white', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5' },
  emailBadge: { backgroundColor: '#E0E7FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emailBadgeText: { fontSize: 12, color: '#4F46E5' },
  dashboardContent: { padding: 20 },
  dashboardTitle: { fontSize: 28, fontWeight: 'bold' },
  welcomeSub: { color: '#666', marginTop: 5, marginBottom: 20 },
  cardRow: { flexDirection: 'row', gap: 15 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, flex: 1, elevation: 2 },
  cardIcon: { fontSize: 24 },
  cardTitle: { fontWeight: 'bold', marginTop: 8 },
  cardText: { fontSize: 13, color: '#666', marginTop: 4 },
  cardSmall: { fontSize: 11, color: '#999', marginTop: 4 },
  verified: { fontSize: 11, color: 'green', marginTop: 6 },
  logoutBtn: { backgroundColor: '#EF4444', padding: 16, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  logoutBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  subtitle: { textAlign: 'center', color: '#666', marginTop: 8 },
  form: { padding: 25, marginTop: 20 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  primaryBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  primaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#EF4444', backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 10, textAlign: 'center' },
  linkText: { color: '#4F46E5', textAlign: 'center', marginTop: 15 },
  switchBtn: { marginTop: 25 },
  switchText: { textAlign: 'center', color: '#666' },
});
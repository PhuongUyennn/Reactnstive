import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignIn = ({ onSignIn, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onSignIn(user);  // Call the function to update user status
      navigation.navigate('Home');  // Navigate to Home screen
    } catch (error) {
      Alert.alert("Lỗi đăng nhập", error.message); // Alert message - ensure no string is outside <Text>
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} // Path to your logo
          style={styles.logo} 
        />
      </View>
      
      {/* Ensure all text strings are inside <Text> */}
      <Text style={styles.punguinText}>PUNGUIN</Text>
      <Text style={styles.title}>Đăng Nhập</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Nhập email của bạn" // No need for <Text> here, since it's a placeholder
        placeholderTextColor="#aaa"
      />
      
      <Text style={styles.label}>Mật khẩu:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholder="Nhập mật khẩu của bạn" // No need for <Text> here, since it's a placeholder
        placeholderTextColor="#aaa"
      />

      {/* Ensure button text is wrapped in <Text> (for custom buttons, not default Button) */}
      <Button title="Đăng nhập" onPress={handleLogin} color="#FF69B4" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  punguinText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF69B4',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF69B4',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
});

export default SignIn;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const Login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        navigation.navigate('Custom');
      } else {
        Alert.alert('Falha no login, Token não encontrado.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data.message, '. StatusCode:', error.response.data.statusCode);
      } else {
        console.error('Erro desconhecido');
      }
    }
  };

  const goToSignUpPage = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Icon
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color="gray"
          style={styles.passwordIcon}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={Login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignUpPage}>
        <Text style={styles.signUpText}>Criar Conta</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>Faça login ou crie uma conta para ter acesso aos pokemons customizados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  passwordIcon: {
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: '#4c77d4',
    marginTop: 40,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  signUpText: {
    color: 'blue',
  },
  infoText: {
    padding: 40,
  }
});
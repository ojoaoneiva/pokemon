import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const SignUp = async () => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email: email,
        name: name,
        password: password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        Alert.alert('Cadastro realizado com sucesso!', 'Você será direcionado para a tela de pokemons customizados.');
        navigation.navigate('Custom');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data.message, '. StatusCode:', error.response.data.statusCode);
      } else {
        console.error('Erro desconhecido');
      }
    }
  };

  const goToLoginPage = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />
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
          placeholder="Senha"
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
      <TouchableOpacity style={styles.buttonContainer} onPress={SignUp}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={goToLoginPage}>
        <Text style={styles.signUpText}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>
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
  signUpButton: {
    marginTop: 30,
  },
  signUpText: {
    color: 'blue',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';

export default function Custom() {
  const [pokemonData, setPokemonData] = useState([]);
  const [newPokemon, setNewPokemon] = useState({ name: '', height: '', weight: '' });
  const [isCreatePokemonVisible, setCreatePokemonVisible] = useState(false);
  const [isEditPokemonVisible, setEditPokemonVisible] = useState(false);
  const [OptionsVisible, setOptionsVisible] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState({ id: '', name: '', height: '', weight: '' });
  const [editedPokemonId, setEditedPokemonId] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const navigation = useNavigation();

  const CreatePokemonVisibility = () => {
    setCreatePokemonVisible(!isCreatePokemonVisible);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  };

  const createPokemon = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const height = parseFloat(newPokemon.height);
      const weight = parseFloat(newPokemon.weight);

      const response = await axios.post(
        `${API_URL}/custompokemons`,
        {
          name: newPokemon.name,
          height: !isNaN(height) ? height : null,
          weight: !isNaN(weight) ? weight : null,
        },
        {
          headers: { Authorization: authToken },
        }
      );

      setPokemonData([...pokemonData, response.data]);
      setNewPokemon({ name: '', height: '', weight: '' });
      setCreatePokemonVisible(false);
      setOptionsVisible(false)
      Alert.alert('Novo Pokémon criado com sucesso!');
    } catch (error) {
      errorMessages(error);
    }
  };

  const editPokemon = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const height = parseFloat(editedPokemon.height);
      const weight = parseFloat(editedPokemon.weight);

      const response = await axios.put(
        `${API_URL}/custompokemons/${editedPokemonId}`,
        {
          name: editedPokemon.name,
          height: !isNaN(height) ? height : null,
          weight: !isNaN(weight) ? weight : null,
        },
        {
          headers: { Authorization: authToken },
        }
      );

      const updatedPokemonData = pokemonData.map((pokemon) =>
        pokemon.id === response.data.id ? response.data : pokemon
      );
      setPokemonData(updatedPokemonData);
      setEditedPokemon({ id: '', name: '', height: '', weight: '' });
      setEditPokemonVisible(false);
      setOptionsVisible(false)
      Alert.alert('Pokémon editado com sucesso!');
    } catch (error) {
      errorMessages(error);
    }
  };

  const deletePokemon = async (id) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      await axios.delete(`${API_URL}/custompokemons/${id}`, {
        headers: { Authorization: authToken },
      });

      const updatedPokemonData = pokemonData.filter((pokemon) => pokemon.id !== id);
      setPokemonData(updatedPokemonData);
      Alert.alert('Pokémon excluído com sucesso!');
    } catch (error) {
      errorMessages(error);
    }
  };

  const errorMessages = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(`${error.response.data.message}. StatusCode: ${error.response.data.statusCode}`);
    } else {
      console.error('Erro desconhecido');
    }
  };

  useEffect(() => {
    const getCustomPokemons = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.navigate('Login');
      } else {
        try {
          const response = await axios.get(`${API_URL}/custompokemons`, {
            headers: { Authorization: authToken },
          });
          setPokemonData(response.data);
        } catch (error) {
          errorMessages(error);
        }
      }
    };

    getCustomPokemons();
  }, []);

  const editButtonClick = (id) => {
    setEditedPokemonId(id);
    setEditedPokemon(pokemonData.find((pokemon) => pokemon.id === id));
  };

  const moreOptionsClick = (id) => {
    setSelectedPokemon(pokemonData.find((pokemon) => pokemon.id === id));
    setOptionsVisible(true);
    editButtonClick(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <View style={styles.user}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={CreatePokemonVisibility}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>

      {isCreatePokemonVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isCreatePokemonVisible}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Novo Pokémon:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newPokemon.name}
              onChangeText={(text) => setNewPokemon({ ...newPokemon, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Altura"
              value={newPokemon.height}
              onChangeText={(text) => setNewPokemon({ ...newPokemon, height: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso"
              value={newPokemon.weight}
              onChangeText={(text) => setNewPokemon({ ...newPokemon, weight: text })}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={createPokemon}>
              <Text style={styles.buttonText}>Criar Pokémon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpButton} onPress={() => setCreatePokemonVisible(false)}>
              <Text style={styles.signUpText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {selectedPokemon && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={OptionsVisible}
        >
          <View style={styles.modalContainer2}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.optionButton} onPress={() => setEditPokemonVisible(true)}>
                <Text style={styles.optionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => deletePokemon(selectedPokemon.id)}>
                <Text style={styles.optionText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setOptionsVisible(false)}>
                <Text style={styles.optionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {isEditPokemonVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isEditPokemonVisible}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Editar Pokémon:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={editedPokemon.name}
              onChangeText={(text) => setEditedPokemon({ ...editedPokemon, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Altura (Opcional)"
              value={editedPokemon.height}
              onChangeText={(text) => setEditedPokemon({ ...editedPokemon, height: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso (Opcional)"
              value={editedPokemon.weight}
              onChangeText={(text) => setEditedPokemon({ ...editedPokemon, weight: text })}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={editPokemon}>
              <Text style={styles.buttonText}>Editar Pokémon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpButton} onPress={() => setEditPokemonVisible(false)}>
              <Text style={styles.signUpText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <Text style={styles.title}>Lista de Pokémon Personalizados:</Text>
      <FlatList
        data={pokemonData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.pokemonItem}>
            <Text>ID: {item.id}</Text>
            <Text>Nome: {item.name}</Text>
            <Text>Altura: {item.height}</Text>
            <Text>Peso: {item.weight}</Text>
            <View style={styles.pokemonButtons}>
              <TouchableOpacity onPress={() => moreOptionsClick(item.id)} style={styles.optionButton}>
                <FontAwesomeIcon icon={faEllipsisV} size={20} color="#656565" style={styles.optionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    marginTop: 580,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  logoutText: {
    textDecorationLine: 'underline',
    color: 'blue',
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: '#656565',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: 'red',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: 250,
  },
  pokemonItem: {
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#d1d1d1',
    padding: 30,
    width: 300,
    borderRadius: 10,
  },
  pokemonButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    position: 'absolute',
    left: 180,
    right: 20,
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '50%',
    left: 150,
    margin: 20,
  },
  topButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    backgroundColor: '#4c77d4',
    borderRadius: 5,
    padding: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  signUpText: {
    marginTop: 30,
    color: 'blue',
  },
  flatListContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  optionIcon: {
    marginTop: 20,
    marginLeft: 80,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 200,
    textAlign: 'center',
    height: 40,
    paddingTop: 5,
  },
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';

export default function Originals() {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const totalPokemons = 90;
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 9;

  const getPokemons = (pageNumber) => {
    axios.get(`${API_URL}/pokemons/?page=${pageNumber}`)
      .then(response => {
        setPokemons(response.data);
      })
      .catch(error => {
        errorMessages(error)
        });
  };

  const nextPage = () => {
    const next = page + 10;
    if (next <= totalPokemons) {
      setPage(next);
      setPageNumber(pageNumber + 1)
    }
  };

  const prevPage = () => {
    const prev = page - 10;
    if (prev >= 0) {
      setPage(prev);
      setPageNumber(pageNumber - 1)
    }
  };

  const searchPokemonById = () => {
    if (searchId) {
      axios.get(`${API_URL}/pokemons/${searchId}`)
        .then(response => {
          setPokemonDetails(response.data.data);
        })
        .catch(error => {
          errorMessages(error)
        });
    }
  };

  const errorMessages = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message, '. StatusCode:', error.response.data.statusCode);
    } else {
      console.error('Erro desconhecido');
    }
  };

  const clearSearchField = () => {
    setPokemonDetails(null);
    setSearchId('');
  };

  useEffect(() => {
    getPokemons(page);
  }, [page]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonAll} onPress={clearSearchField}>
          <Text style={styles.buttonText}>Todos</Text>
        </TouchableOpacity>
        <View style={styles.search}>
          <TextInput
            style={[styles.searchInput]}
            placeholder="Digite o ID"
            value={searchId}
            onChangeText={text => setSearchId(text)}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={searchPokemonById}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {pokemonDetails ? (
        <View style={styles.pokemonDetails}>
          <View style={styles.pokemon}>
            <Text>Nome: {pokemonDetails.forms[0].name}</Text>
            <Text>Height: {pokemonDetails.height}</Text>
            <Text>weight: {pokemonDetails.weight}</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Lista de Pokémons:</Text>
          {pokemons.map((pokemon, index) => (
            <View key={index} style={styles.pokemon}>
              <Text>Id: {pokemon.url.split('/').slice(-2, -1)[0]}</Text>
              <Text>Nome: {pokemon.name}</Text>
              <Text>Url: {pokemon.url}</Text>
            </View>
          ))}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.buttonPage, page <= 0 ? styles.buttonDisabled : null]}
              onPress={prevPage}
              disabled={page <= 0}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text>Página {pageNumber} de {totalPages}</Text>

            <TouchableOpacity
              style={[styles.buttonPage, page + 10 >= totalPokemons ? styles.buttonDisabled : null]}
              onPress={nextPage}
              disabled={page + 10 >= totalPokemons}
            >
              <Text style={styles.buttonText}>Próxima</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20
  },
  searchInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '64%',
  },
  disabledInput: {
    backgroundColor: '#d3d3d3',
  },
  pokemonDetails: {
    marginTop: 20,
  },
  pokemon: {
    marginTop: 10,
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    padding: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  buttonPage: {
    backgroundColor: '#4c77d4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    margin: 10,
  },
  buttonContainer: {
    backgroundColor: '#4c77d4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonAll: {
    backgroundColor: '#281f83',
    borderRadius: 5,
    padding: 10,
    width: '90%',
    maxHeight: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
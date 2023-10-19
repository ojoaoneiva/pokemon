import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('Originals');

  const ButtonPress = (button) => {
    setSelectedButton(button);
    navigation.navigate(button);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemons</Text>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.button,
            selectedButton === 'Originals' && styles.selectedButton
          ]}
          onPress={() => ButtonPress('Originals')}
        >
          <Text style={styles.buttonText}>Originals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.button,
            selectedButton === 'Custom' && styles.selectedButton
          ]}
          onPress={() => ButtonPress('Custom')}
        >
          <Text style={styles.buttonText}>Custom</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    zIndex: 0
  },
  title: {
    fontSize: 50,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    padding: 50,
    paddingTop: 10,
    paddingBottom: 0
  },
  buttonText: {
    padding: 15,
    borderRadius: 4,
    fontSize: 18,
    fontWeight: 'bold'
  },
  selectedButton: {
    borderBottomWidth: 4,
    borderColor: '#10a0e9',
  }
});

import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {Entypo} from '@expo/vector-icons';
const Button = ({title, onPress, color, icon}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo name={icon} size={28} color={color ? color : 'white'} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
  },
});
export default Button;

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedLocations = ({navigation}) => {
  const [locationName, setLocationName] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        const savedLocationsJson = await AsyncStorage.getItem('savedLocations');
        if (savedLocationsJson) {
          const parsedLocations = JSON.parse(savedLocationsJson);
          setSavedLocations(parsedLocations);
        }
      } catch (error) {
        console.error('Error loading saved locations:', error);
      }
    };

    loadSavedLocations();
  }, []);

  useEffect(() => {
    const storageListener = async () => {
      try {
        const savedLocationsJson = await AsyncStorage.getItem('savedLocations');
        if (savedLocationsJson) {
          const parsedLocations = JSON.parse(savedLocationsJson);
          setSavedLocations(parsedLocations);
        }
      } catch (error) {
        console.error('Error updating saved locations:', error);
      }
    };

    const focusListener = navigation.addListener('focus', () => {
      storageListener();
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  const detectLocation = async () => {
    try {
      let {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const saveLocation = async () => {
    try {
      if (!locationName || !currentLocation) {
        alert('Please enter a name and auto detect your location');
        return;
      }

      const newLocation = {
        name: locationName,
        coordinates: currentLocation,
      };

      const updatedLocations = [...savedLocations, newLocation];
      setSavedLocations(updatedLocations);

      await AsyncStorage.setItem(
        'savedLocations',
        JSON.stringify(updatedLocations),
      );

      setLocationName('');
      setCurrentLocation(null);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const editLocation = index => {
    setEditIndex(index);
    setIsEditing(true);
    setLocationName(savedLocations[index].name);
  };

  const updateLocation = async () => {
    try {
      if (!locationName || !currentLocation) {
        alert('Please enter a name and auto detect your location');
        return;
      }

      const updatedLocations = [...savedLocations];
      updatedLocations[editIndex] = {
        name: locationName,
        coordinates: currentLocation,
      };

      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem(
        'savedLocations',
        JSON.stringify(updatedLocations),
      );

      setIsEditing(false);
      setEditIndex(null);
      setLocationName('');
      setCurrentLocation(null);

      alert('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const deleteLocation = async index => {
    try {
      const updatedLocations = [...savedLocations];
      updatedLocations.splice(index, 1);

      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem(
        'savedLocations',
        JSON.stringify(updatedLocations),
      );
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Locations</Text>
      {savedLocations.length > 0 && (
        <FlatList
          data={savedLocations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>{item.name}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => editLocation(index)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteLocation(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {currentLocation ? (
        <Text style={styles.currentLocation}>
          Current Location: {currentLocation.latitude},{' '}
          {currentLocation.longitude}
        </Text>
      ) : (
        <Text style={styles.currentLocation}>
          Current Location: Tap on Detect Location
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter location name"
        value={locationName}
        onChangeText={text => setLocationName(text)}
      />
      <View style={styles.buttonsContainer}>
        {isEditing ? (
          <>
            <Button
              title="Update Location"
              onPress={updateLocation}
              color="#3498db"
            />
            <Button
              title="Detect Location"
              onPress={detectLocation}
              color="#2ecc71"
            />
          </>
        ) : (
          <>
            <Button
              title="Save Location"
              onPress={saveLocation}
              color="#3498db"
            />
            <Button
              title="Detect Location"
              onPress={detectLocation}
              color="#2ecc71"
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    fontSize: 16,
    color: '#3498db',
    marginRight: 10,
  },
  deleteButton: {
    fontSize: 16,
    color: '#e74c3c',
  },
  currentLocation: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SavedLocations;

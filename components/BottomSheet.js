import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import {supabase} from '../src/lib/supabase';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_DATA_KEY = 'offlineData';

const BottomSheet = ({bottomSheetModalRef, setImage, image, navigation}) => {
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoDetectedLocation, setAutoDetectedLocation] = useState({});
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    autoDetectLocation();
  }, [navigation]);

  useEffect(() => {
    loadSavedLocations();
  }, [savedLocations]);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const {isConnected} = await Network.getNetworkStateAsync();
        setIsConnected(isConnected);
        if (isConnected) {
          await uploadData();
        }
      } catch (error) {
        handleNetworkError();
      }
    };
    checkConnectivity();
  }, []);

  const extractFilename = uri => {
    const parts = uri.split('/');
    return parts[parts.length - 1];
  };

  const autoDetectLocation = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setAutoDetectedLocation(location.coords);
      } else {
        handleLocationPermissionDenied();
      }
    } catch (error) {
      handleLocationError('Error getting current location:', error);
    }
  };

  const loadSavedLocations = async () => {
    try {
      const savedLocationsJson = await AsyncStorage.getItem('savedLocations');
      if (savedLocationsJson) {
        const parsedLocations = JSON.parse(savedLocationsJson);
        setSavedLocations(parsedLocations);
      }
    } catch (error) {
      handleLocationError('Error loading saved locations from storage:', error);
    }
  };

  const handleSubmit = async () => {
    if (!locationName || locationName.trim() === '') {
      Toast.show({
        type: 'info',
        text1: 'Location and Location name',
        text2: 'Please enter a valid location name before submitting',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
      return;
    }

    setLoading(true);
    try {
      const imageName = extractFilename(image);
      const photo = {
        uri: image,
        type: 'image/jpeg',
        name: imageName,
      };

      if (isConnected) {
        const url = await uploadToCloudinary(photo);
        await saveLocationToSupabase(url);
        Toast.show({
          type: 'success',
          text1: 'Location Submitted',
          text2: 'Location submitted successfully!',
          text1Style: styles.text1,
          text2Style: styles.text2,
        });
      } else {
        await saveDataOffline();
        Toast.show({
          type: 'success',
          text1: 'Location Saved Offline',
          text2: 'Location saved successfully!',
          text1Style: styles.text1,
          text2Style: styles.text2,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Something went wrong',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
    } finally {
      setLoading(false);
      setImage(null);
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const handleLocationSelect = value => {
    setSelectedLocation(value);
    const selectedLocation = savedLocations.find(
      location => location.name === value,
    );
    if (selectedLocation) {
      setLocationName(selectedLocation.name);
      setAutoDetectedLocation({
        latitude: selectedLocation.coordinates.latitude,
        longitude: selectedLocation.coordinates.longitude,
      });
      setIsLocationSelected(true);
    } else {
      setIsLocationSelected(false);
    }
  };

  const handleDeleteLocation = async () => {
    try {
      const updatedLocations = savedLocations.filter(
        location => location.name !== selectedLocation,
      );
      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem(
        'savedLocations',
        JSON.stringify(updatedLocations),
      );
      setSelectedLocation(null);
      setAutoDetectedLocation(null);
      setIsLocationSelected(false);
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Something went wrong');
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Something went wrong',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
    }
  };

  const uploadToCloudinary = async photo => {
    try {
      const data = new FormData();
      data.append('file', photo);
      data.append('upload_preset', 'ntyhh6x0');
      data.append('cloud_name', 'dmbixlxfk');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dmbixlxfk/image/upload',
        {
          method: 'post',
          body: data,
        },
      );

      const responseData = await response.json();
      return responseData.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Something went wrong',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
      throw error;
    }
  };

  const saveLocationToSupabase = async url => {
    try {
      await supabase
        .from('dirtinfo')
        .insert({
          location_name: locationName,
          latitude: autoDetectedLocation?.latitude,
          longitude: autoDetectedLocation?.longitude,
          image_url: url,
        })
        .select();
    } catch (error) {
      console.error('Error saving location to Supabase:', error);
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Error saving location',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
      throw error;
    }
  };

  const saveDataOffline = async () => {
    try {
      const existingData =
        JSON.parse(await AsyncStorage.getItem(OFFLINE_DATA_KEY)) || [];
      const imageData = image;
      if (!locationName && !autoDetectedLocation) {
        Toast.show({
          type: 'error',
          text1: 'Enter Valid location name',
          text2: 'Error saving location',
          text1Style: styles.text1,
          text2Style: styles.text2,
        });
      }
      existingData.push({
        location_name: locationName,
        latitude: autoDetectedLocation?.latitude,
        longitude: autoDetectedLocation?.longitude,
        image_url: imageData,
      });
      await AsyncStorage.setItem(
        OFFLINE_DATA_KEY,
        JSON.stringify(existingData),
      );

      Toast.show({
        type: 'success',
        text1: 'Data Saved Offline',
        text2: 'You can upload it later when online.',
        text1Style: styles.text1,
        text2Style: styles.text2,
      });
    } catch (error) {
      console.error('Error saving data offline:', error);
    }
  };

  const locationItems = savedLocations.map(location => ({
    key: location.name,
    label: location.name,
    value: location.name,
  }));

  const uploadToSupabase = async dataItem => {
    try {
      await supabase.from('dirtinfo').insert(dataItem);
    } catch (error) {
      console.error('Error uploading data to Supabase:', error);
      throw error;
    }
  };

  const uploadData = async () => {
    try {
      const offlineData = JSON.parse(
        await AsyncStorage.getItem(OFFLINE_DATA_KEY),
      );
      if (offlineData && offlineData.length > 0) {
        await Promise.all(
          offlineData.map(async dataItem => {
            const cloudinaryUrl = await uploadToCloudinary({
              uri: dataItem.image_url,
              type: 'image/jpeg',
              name: extractFilename(dataItem.image_url),
            });
            dataItem.image_url = cloudinaryUrl;
            await uploadToSupabase(dataItem);
          }),
        );
        await AsyncStorage.removeItem(OFFLINE_DATA_KEY);
        Toast.show({
          type: 'success',
          text1: 'Data Uploaded',
          text2: 'Your offline data has been successfully uploaded.',
        });
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Something went wrong during data upload.',
      });
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['48%', '60%']}>
      {!loading ? (
        <View style={styles.container}>
          <Text style={styles.heading}>Submission Page</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Location Name"
            value={locationName}
            onChangeText={text => setLocationName(text)}
          />
          {autoDetectedLocation && (
            <Text style={styles.autoDetectedLocation}>
              Location:{' '}
              {`Lat: ${autoDetectedLocation.latitude}, Long: ${autoDetectedLocation.longitude}`}
            </Text>
          )}
          {!isLocationSelected && (
            <TouchableOpacity
              style={styles.button}
              onPress={autoDetectLocation}>
              <Text style={styles.buttonText}>Auto-Detect Location</Text>
            </TouchableOpacity>
          )}
          {savedLocations.length > 0 && (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={itemValue => handleLocationSelect(itemValue)}
                selectedValue={selectedLocation}
                placeholder={{
                  label: !selectedLocation
                    ? 'Select an Item'
                    : selectedLocation,
                  value: null,
                }}
                items={locationItems}
                style={pickerSelectStyles}
              />
            </View>
          )}
          {savedLocations.length > 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleDeleteLocation}>
              <Text style={styles.buttonText}>Delete Selected Location</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={require('../assets/loading.json')}
            autoPlay
            loop
            style={{width: '100%', height: 200}}
            resizeMode="contain"
          />
        </View>
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#34a853',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  autoDetectedLocation: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    height: 40,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  text1: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 13,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    color: 'black',
    borderColor: '#ccc',
    paddingRight: 30,
    borderRadius: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    color: 'black',
    paddingRight: 30,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});

export default BottomSheet;

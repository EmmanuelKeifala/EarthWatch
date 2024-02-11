import React, {useState, useEffect} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import {supabase} from '../src/lib/supabase';
import Lottie from 'lottie-react-native';

const BottomSheet = ({bottomSheetModalRef, setImage, image}) => {
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoDetectedLocation, setAutoDetectedLocation] = useState(null);

  useEffect(() => {
    // Auto-detect location when the component mounts
    autoDetectLocation();
  }, []);

  const extractFilename = uri => {
    const parts = uri.split('/');
    return parts[parts.length - 1];
  };

  const autoDetectLocation = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setAutoDetectedLocation(location.coords);
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleSubmit = async () => {
    if (!locationName || locationName.trim() === '') {
      alert('Please enter a valid Location Name before submitting.');
      return;
    }

    setLoading(true);
    try {
      const imageName = extractFilename(image);
      const cloudinaryUpload = async photo => {
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
          const url = responseData.secure_url;
          await supabase
            .from('dirtinfo')
            .insert({
              location_name: locationName,
              latitude: autoDetectedLocation?.latitude,
              longitude: autoDetectedLocation?.longitude,
              image_url: url,
            })
            .select();

          alert('Location submitted successfully!');
        } catch (error) {
          setLoading(false);
          console.error('main error', error);
          alert('An Error Occurred While Uploading');
        } finally {
          setLoading(false);
        }
      };
      console.log(imageName);
      const source = {
        uri: image,
        type: 'image/jpeg',
        name: imageName,
      };

      await cloudinaryUpload(source);

      setImage(null);
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['48%', '60%']}>
      {!loading ? (
        <View style={styles.container}>
          <Text style={styles.heading}>Add Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Location Name"
            value={locationName}
            onChangeText={text => setLocationName(text)}
          />
          {autoDetectedLocation && (
            <Text style={styles.autoDetectedLocation}>
              Auto-Detected Location:{' '}
              {`Lat: ${autoDetectedLocation.latitude}, Long: ${autoDetectedLocation.longitude}`}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={autoDetectLocation}>
            <Text style={styles.buttonText}>Auto-Detect Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Lottie
          source={require('../assets/loading.json')}
          loop={true}
          style={{width: 50, height: 50}}
        />
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  autoDetectedLocation: {
    marginBottom: 20,
  },
});

export default BottomSheet;

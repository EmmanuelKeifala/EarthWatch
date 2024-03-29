import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet from '../../components/BottomSheet';

const GalleryUploads = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const bottomSheetModalRef = useRef(null);

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: true,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const renderDropZone = () => {
    return (
      <TouchableOpacity style={styles.dropZone} onPress={takePicture}>
        <Ionicons name="camera-outline" size={40} color="#3498db" />
        <Text style={styles.dropZoneText}>Tap to Take a Picture</Text>
        <Text style={styles.instructionText}>
          Capture an image using your camera to get started!
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSelectedImage = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{uri: selectedImage}}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {selectedImage ? renderSelectedImage() : renderDropZone()}
          {selectedImage && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => bottomSheetModalRef.current?.present()}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
          <BottomSheet
            bottomSheetModalRef={bottomSheetModalRef}
            setImage={setSelectedImage}
            image={selectedImage}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  dropZone: {
    width: windowWidth * 0.8,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  dropZoneText: {
    color: '#3498db',
    marginTop: 10,
    fontSize: 16,
  },
  instructionText: {
    color: '#777',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 30,
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginVertical: 30,
  },
  uploadButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GalleryUploads;

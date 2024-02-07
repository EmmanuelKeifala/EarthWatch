import React, {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import Button from './components/Button';
import BottomSheet from './components/BottomSheet';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
export default function App() {
  const [hasCamaraPermission, setHasCamaraPermission] = useState(false);
  const [image, setImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [cameraSettings, setCameraSettings] = useState({
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    focus: Camera.Constants.AutoFocus.on,
  });
  const cameraRef = useRef(null);
  const bottomSheetModalRef = useRef(null);

  const toggleCameraType = () => {
    const newCameraType =
      cameraSettings.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back;

    setCameraSettings({
      ...cameraSettings,
      type: newCameraType,
    });
  };

  const toggleFlash = () => {
    const newFlashType =
      cameraSettings.flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off;

    setCameraSettings({
      ...cameraSettings,
      flashMode: newFlashType,
    });
  };
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCamaraPermission(cameraStatus.granted);
    })();
  }, []);

  if (!hasCamaraPermission) {
    return <Text>No Access To Camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef) {
    }
    try {
      const data = await cameraRef.current.takePictureAsync();
      setImage(data);
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <View style={styles.droidSafeArea}>
          {!image ? (
            <Camera
              style={styles.camera}
              type={cameraSettings.type}
              flashMode={cameraSettings.flashMode}
              autoFocus={cameraSettings.focus}
              ref={cameraRef}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                }}>
                <Button icon={'retweet'} onPress={toggleCameraType} />
                <Button
                  icon={'flash'}
                  onPress={toggleFlash}
                  color={
                    cameraSettings.flashMode === Camera.Constants.FlashMode.off
                      ? 'gray'
                      : 'white'
                  }
                />
              </View>
            </Camera>
          ) : (
            <Image source={{uri: image.uri}} style={styles.camera} />
          )}

          {!image ? (
            <View>
              <Button
                title={'Take a picture'}
                icon={'camera'}
                onPress={takePicture}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 50,
              }}>
              <Button
                title={'Retake'}
                icon={'retweet'}
                onPress={() => setImage(null)}
              />
              <Button
                title={'save'}
                icon={'check'}
                onPress={() => bottomSheetModalRef.current?.present()}
              />
              <BottomSheet
                bottomSheetModalRef={bottomSheetModalRef}
                setImage={setImage}
                image={image}
              />
            </View>
          )}
          <StatusBar style="auto" />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#000',
    paddingBottom: 20,
  },
});

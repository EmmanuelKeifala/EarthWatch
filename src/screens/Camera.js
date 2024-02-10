import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import {Camera} from 'expo-camera';
import {
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import Button from '../../components/Button';
import BottomSheet from '../../components/BottomSheet';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

export default function CameraTab() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [image, setImage] = useState(null);
  const [cameraSettings, setCameraSettings] = useState({
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    focus: Camera.Constants.AutoFocus.on,
  });
  const cameraRef = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [isCameraReady, setIsCameraReady] = useState(false);

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

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.granted);
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.addListener('beforeRemove', () => {
      // Pause the camera when the component is being removed
      if (cameraRef.current) {
        cameraRef.current.pausePreview();
      }
    });

    return () => {
      // Cleanup: Stop the camera when the component is unmounted
      if (cameraRef.current) {
        cameraRef.current.pausePreview();
      }
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // Start the camera when the component gains focus
      if (cameraRef.current && isCameraReady) {
        cameraRef.current.resumePreview();
      }
      return () => {
        // Pause the camera when the component loses focus
        if (cameraRef.current) {
          cameraRef.current.pausePreview();
        }
      };
    }, [isCameraReady]),
  );

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data);
      } catch (error) {
        console.log(error);
        alert('Something went wrong');
      }
    }
  };

  if (!hasCameraPermission) {
    return <Text>No Access To Camera</Text>;
  }

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
              ref={ref => {
                cameraRef.current = ref;
              }}
              onCameraReady={onCameraReady}>
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
                title={'Save'}
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

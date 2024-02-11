import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import getData from '../lib/getData';
import {Image, Modal, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const MapScreen = () => {
  const [fetchData, setFetchData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      const initialData = await getData(setFetchData);
      setFetchData(initialData);
    };

    fetchDataAndSubscribe();
  }, []);
  const handleMarkerPress = marker => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };
  const {width, height} = Dimensions.get('window');
  const region = {
    latitude: 8.4606,
    longitude: -11.7799,
    latitudeDelta: 5,
    longitudeDelta: 0.0922 * (width / height),
  };
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsBuildings
        showsTraffic
        s
        showsCompass
        showsUserLocation
        sh
        showsMyLocationButton
        region={region}
        loadingEnabled>
        {fetchData.map((item, index) => {
          const markerLatLng = {
            latitude: item.latitude,
            longitude: item.longitude,
          };
          return (
            <Marker
              key={index}
              coordinate={markerLatLng}
              title={item.location_name}
              onPress={() => handleMarkerPress(item)}></Marker>
          );
        })}
      </MapView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 5,
            }}>
            {selectedMarker && (
              <View style={{display: 'flex'}}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{textTransform: 'capitalize', fontWeight: 'bold'}}>
                    {selectedMarker.location_name}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={30} color="black" />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{uri: selectedMarker.image_url}}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

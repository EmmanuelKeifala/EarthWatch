import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import getData from '../lib/getData';
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
        showsCompass
        showsUserLocation
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
              onPress={() => handleMarkerPress(item)}
              icon={
                item.group === 'Limkokwing'
                  ? require('../../assets/pin2.png')
                  : item.group === 'Lion Pride'
                  ? require('../../assets/pin1.png')
                  : item.group === 'Biossed'
                  ? require('../../assets/pin3.png')
                  : require('../../assets/pin4.png')
              }></Marker>
          );
        })}
      </MapView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMarker && (
              <View>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {selectedMarker.location_name}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={30} />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{uri: selectedMarker.image_url}}
                  style={styles.image}
                />
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: 10,
                  }}>
                  Uploaded by: {selectedMarker.group}
                </Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
});

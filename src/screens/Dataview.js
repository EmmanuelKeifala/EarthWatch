import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import getData from '../lib/getData';

const DataView = () => {
  const [fetchData, setFetchData] = useState([]);

  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      const initialData = await getData(setFetchData);
      setFetchData(initialData);
    };

    fetchDataAndSubscribe();
  }, []);

  const handleLinkPress = url => {
    Linking.openURL(url);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Data Page</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Location Name</Text>
          <Text style={styles.tableHeader}>Latitude</Text>
          <Text style={styles.tableHeader}>Longitude</Text>
          <Text style={styles.tableHeader}>Image Link</Text>
        </View>

        {fetchData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <TouchableOpacity style={styles.tableCell}>
              <Text>{item.location_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableCell}>
              <Text>{item.latitude}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableCell}>
              <Text>{item.longitude}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinkPress(item.image_url)}
              style={styles.linkTextContainer}>
              <Text
                style={styles.linkText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {truncateText(item.image_url, 25)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
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
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: '#3498db',
    color: '#ffffff',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  linkTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default DataView;

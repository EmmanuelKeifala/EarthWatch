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
      <Text style={styles.heading}>Data</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Location Name</Text>
        <Text style={styles.headerText}>Latitude</Text>
        <Text style={styles.headerText}>Longitude</Text>
        <Text style={styles.headerText}>Image Link</Text>
      </View>

      {fetchData.map((item, index) => (
        <TouchableOpacity key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.location_name}</Text>
          <Text style={styles.tableCell}>{item.latitude}</Text>
          <Text style={styles.tableCell}>{item.longitude}</Text>
          <TouchableOpacity
            onPress={() => handleLinkPress(item.image_url)}
            style={[styles.tableCell, styles.linkTextContainer]}>
            <Text
              style={styles.linkText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {truncateText(item.image_url, 25)}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  linkTextContainer: {
    flex: 1,
    justifyContent: 'center', // Center the text vertically
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default DataView;

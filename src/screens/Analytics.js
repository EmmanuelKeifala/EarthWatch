import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import Geocoding from 'react-native-geocoding';
import getData from '../lib/getData';
const {width} = Dimensions.get('window');

const Analytics = () => {
  const [fetchData, setFetchData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      const initialData = await getData(setFetchData);
      setFetchData(initialData);
    };

    fetchDataAndSubscribe();
  }, []);

  const groupLocationsByAddress = locationDataWithAddresses => {
    const groupedLocations = {};

    locationDataWithAddresses.forEach(({locationName, address}) => {
      if (!groupedLocations[address]) {
        groupedLocations[address] = [];
      }

      groupedLocations[address].push(locationName);
    });

    const groupedData = Object.entries(groupedLocations).map(
      ([address, locations]) => ({
        address,
        totalLocations: locations.length,
        uniqueLocations: locations.join(', '),
      }),
    );

    return groupedData;
  };

  useEffect(() => {
    const getLocationData = async () => {
      const uniqueLocations = Array.from(
        new Set(fetchData.map(entry => entry.location_name)),
      );

      const geocodePromises = uniqueLocations.map(async locationName => {
        const entry = fetchData.find(
          entry => entry.location_name === locationName,
        );
        console.log(entry);
        if (entry) {
          const {latitude, longitude} = entry;
          try {
            const response = await Geocoding.from({latitude, longitude});
            console.log(response);
            const address =
              response.results[0].address_components[2].short_name; // Assuming the first result is the most accurate
            return {locationName, address};
          } catch (error) {
            console.error('Error getting address:', error);
            return {locationName, address: 'Unknown'};
          }
        }
        return {locationName, address: 'Unknown'};
      });

      const locationDataWithAddresses = await Promise.all(geocodePromises);
      setLocationData(locationDataWithAddresses);

      // Group locations based on addresses
      const groupedData = groupLocationsByAddress(locationDataWithAddresses);

      // Update the BarChart data
      setBarChartData(
        groupedData.map(({address, totalLocations}) => ({
          label: `${address}`,
          value: totalLocations,
          frontColor: '#4ABFF4',
          sideColor: '#4ABFF4',
          topColor: '#4ABFF4',
        })),
      );
    };

    getLocationData();
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.dataCountText}>
          Total Data Entries: {fetchData.length}
        </Text>
      </View>

      <BarChart
        height={250}
        showFractionalValues
        showYAxisIndices
        hideRules
        noOfSections={4}
        data={barChartData}
        width={width / 1.5}
        isAnimated
        renderTooltip={({label, value}) => (
          <Text
            style={{
              paddingTop: 5,
              fontWeight: 'bold',
              flexWrap: 'wrap',
            }}
            numberOfLines={2}>
            {`${label}: ${value}`}
          </Text>
        )}
      />
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 40,
    marginHorizontal: 30,
  },
  dataCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
    padding: 5,
    alignItems: 'center',
  },
});

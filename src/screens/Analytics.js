import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
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
        if (entry) {
          const {latitude, longitude} = entry;
          try {
            const response = await Geocoding.from({latitude, longitude});
            const address =
              response.results[0].address_components[2].short_name;
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text style={styles.dataCountText}>Entries Per Section</Text>
        <BarChart
          style={{
            width: '100%',
            borderRadius: 10,
            alignItems: 'center',
          }}
          data={{
            labels: barChartData.map(item => item.label),
            datasets: [
              {
                data: barChartData.map(item => item.value),
              },
            ],
          }}
          width={width / 1.2}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: 'black',
            backgroundGradientFromOpacity: 0.8,
            backgroundGradientTo: '#4285f4',
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text color
            strokeWidth: 5,
            barPercentage: 1,
          }}
          fromZero={true}
          verticalLabelRotation={4.4}
        />
      </View>
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

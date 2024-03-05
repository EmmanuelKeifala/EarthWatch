import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GalleryUploads from '../screens/GalleryUpload';
import DataView from '../screens/Dataview';
import {StyleSheet, View} from 'react-native';
import {
  AntDesign,
  FontAwesome5,
  Feather,
  Entypo,
  Ionicons,
} from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import SavedLocations from '../screens/SavedLocations';
import * as Network from 'expo-network';
import {useState} from 'react';
import {useEffect} from 'react';
import Analytics from '../screens/Analytics';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnectivityChange = async () => {
      const currentNetworkStatus = await Network.getNetworkStateAsync();
      setIsConnected(currentNetworkStatus);
    };

    handleConnectivityChange();
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Tab.Screen
        name="Phone Uploads"
        component={GalleryUploads}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#3498db'} : {},
                ]}>
                <FontAwesome5
                  name="images"
                  size={30}
                  color={focused ? 'white' : 'black'}
                />
              </View>
            );
          },
        }}
      />
      {/* DataView Screen */}
      {isConnected.isConnected && (
        <Tab.Screen
          name="DataView"
          component={DataView}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused, color, size}) => {
              return (
                <View
                  style={[
                    styles.activeTabBackground,
                    focused ? {backgroundColor: '#3498db'} : {},
                  ]}>
                  <AntDesign
                    name="database"
                    size={30}
                    color={focused ? 'white' : 'black'}
                  />
                </View>
              );
            },
          }}
        />
      )}
      {isConnected.isConnected && (
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused, color, size}) => {
              return (
                <View
                  style={[
                    styles.activeTabBackground,
                    focused ? {backgroundColor: '#3498db'} : {},
                  ]}>
                  <Feather
                    name="map"
                    size={30}
                    color={focused ? 'white' : 'black'}
                  />
                </View>
              );
            },
          }}
        />
      )}
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#3498db'} : {},
                ]}>
                <Ionicons
                  name="analytics"
                  size={30}
                  color={focused ? 'white' : 'black'}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Locations"
        component={SavedLocations}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#3498db'} : {},
                ]}>
                <Entypo
                  name="location"
                  size={30}
                  color={focused ? 'white' : 'black'}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabBackground: {
    padding: 5,
    borderRadius: 0.8 * 10,
  },
});

export default BottomTabs;

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import GalleryUploads from '../screens/GalleryUpload';
import DataView from '../screens/Dataview';
import {StyleSheet, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
        },
      }}>
      {/* CameraTab Screen */}
      {/* <Tab.Screen
        name="Camera"
        component={CameraTab}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? { backgroundColor: '#3498db' } : {},
                ]}>
                <Feather name="camera" size={24} color={focused ? 'white' : 'green'} />
              </View>
            );
          },
        }}
      /> */}
      {/* GalleryUploads Screen */}
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
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeTabBackground: {
    padding: 5,
    borderRadius: 0.8 * 10,
  },
});

export default BottomTabs;

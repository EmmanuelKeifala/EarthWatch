import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './src/navigations/BottomTabNavigation';
import {StatusBar} from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Tab"
          component={BottomTabs}
          options={{animation: 'default'}}
        />
        {/* <Stack.Screen
          name="Camera"
          component={CameraTab}
          options={{animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name="Phone Uploads"
          component={GalleryUploads}
          options={{animation: 'slide_from_right'}}
        /> */}
      </Stack.Navigator>
      <StatusBar style="black" />
    </NavigationContainer>
  );
};

export default App;

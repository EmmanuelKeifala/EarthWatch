import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './src/navigations/BottomTabNavigation';
import {StatusBar} from 'expo-status-bar';
import Toast from 'react-native-toast-message';

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
      </Stack.Navigator>

      <StatusBar style="dark" />
      <Toast position="top" bottomOffset={30} swipeable={true} autoHide />
    </NavigationContainer>
  );
};

export default App;

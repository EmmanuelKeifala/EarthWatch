import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './src/navigations/BottomTabNavigation';
import {StatusBar} from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import {useEffect, useState} from 'react';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const App = () => {
  const [onboardingViewed, setOnboardingViewed] = useState(null); // Change the initial state to null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfOnboardingViewed();
  }, []);

  const checkIfOnboardingViewed = async () => {
    try {
      const onboardingView = JSON.parse(
        await AsyncStorage.getItem('onboardingViewed'),
      );

      setOnboardingViewed(onboardingView ?? false); // Default to false if the value is null
      setLoading(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Or a loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={onboardingViewed ? 'Tab' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{animation: 'default'}}
        />
        <Stack.Screen
          name="Tab"
          component={BottomTabs}
          options={{animation: 'default'}}
        />
      </Stack.Navigator>
      <StatusBar style="dark" />
      <Toast position="bottom" bottomOffset={30} swipeable={true} autoHide />
    </NavigationContainer>
  );
};

export default App;

import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {storeData} from '../lib/asyncStorage';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedEffect,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const imageOpacity = useSharedValue(0);

  const handleOnDone = () => {
    navigation.navigate('Tab');
    storeData('onboardingViewed', JSON.stringify(true));
  };

  const animateImages = () => {
    imageOpacity.value = withSpring(1, {damping: 10, stiffness: 100});
  };

  useEffect(() => {
    animateImages();
  }, []); // Run the animation once when the component mounts

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleOnDone}
        onSkip={handleOnDone}
        bottomBarHighlight={false}
        containerStyles={{paddingHorizontal: 15}}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require('../../assets/animations/welcome.json')}
                  autoPlay
                  loop
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>
            ),
            title: <Text style={styles.title}>Welcome</Text>,
            subtitle: '',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require('../../assets/animations/recycle.json')}
                  autoPlay
                  loop
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>
            ),
            title: <Text style={styles.title}>About the App</Text>,
            subtitle: (
              <Text style={styles.description}>
                Help us clean up Freetown! This app lets you snap pics of
                plastic and rubber waste you see around the city. By working
                together, we can track pollution and make Freetown even cleaner!
              </Text>
            ),
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.imageContainer}>
                <Animated.Image
                  source={require('../../assets/p1.jpg')}
                  style={[styles.image, animatedImageStyle]}
                  resizeMode="contain"
                />
                <Animated.Image
                  source={require('../../assets/p3.jpg')}
                  style={[styles.image, animatedImageStyle]}
                  resizeMode="contain"
                />
                <Animated.Image
                  source={require('../../assets/p2.jpg')}
                  style={[styles.image, animatedImageStyle]}
                  resizeMode="contain"
                />
              </View>
            ),

            title: <Text style={styles.title}>Sponsors (TACUGAMA)</Text>,
            subtitle: <Text style={styles.description}></Text>,
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: '#4285f4',
    textAlign: 'center',
  },
  description: {
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'left',
    paddingHorizontal: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  imageContainer: {
    flexDirection: 'col',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
  },
  image: {
    width: width * 0.9, // Adjust the width as needed
    height: 190, // Adjust the height as needed
    borderRadius: 10, // Add borderRadius for a rounded look
  },
});

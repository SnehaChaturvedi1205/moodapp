// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-splash-screen'; // renamed to avoid collision

const CustomSplashScreen = ({ navigation }) => {

  useEffect(() => {
    // Hide the native splash screen
    RNBootSplash.hide();

    // Navigate to Auth screen after a delay
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default CustomSplashScreen;

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeApp} from '@react-native-firebase/app';

try {
  // Initialize Firebase
  initializeApp();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

AppRegistry.registerComponent(appName, () => App);

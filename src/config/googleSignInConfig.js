import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '1004210266944-om00fk5j0520mt6fho5881jvd1k9vqcd.apps.googleusercontent.com', // Replace with your own webClientId
  });
};

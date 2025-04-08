// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#FFD700' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#6495ED' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: '#FF4500' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌', color: '#98FB98' },
  { id: 'focused', label: 'Focused', emoji: '🧠', color: '#9370DB' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️', color: '#FF69B4' },
];

const languages = [
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'french', label: 'French' },
  { id: 'korean', label: 'Korean' },
  { id: 'japanese', label: 'Japanese' },
];

const HomeScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [step, setStep] = useState(1);
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep(2);
  };
  
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    // Generate playlist based on mood and language
    navigation.navigate('Playlist', { mood: selectedMood, language });
  };
  
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {step === 1 ? "How are you feeling today?" : "What language do you prefer?"}
        </Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      {step === 1 ? (
        <ScrollView contentContainerStyle={styles.moodGrid}>
          {moods.map(mood => (
            <TouchableOpacity
              key={mood.id}
              style={[styles.moodCard, { backgroundColor: mood.color }]}
              onPress={() => handleMoodSelect(mood)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.languageList}>
          {languages.map(language => (
            <TouchableOpacity
              key={language.id}
              style={styles.languageCard}
              onPress={() => handleLanguageSelect(language)}
            >
              <Text style={styles.languageLabel}>{language.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <Text style={styles.backButtonText}>Back to Mood Selection</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  moodCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  languageList: {
    padding: 15,
  },
  languageCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#1DB954',
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
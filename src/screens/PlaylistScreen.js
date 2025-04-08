// screens/PlaylistScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import TrackPlayer from 'react-native-track-player';

const PlaylistScreen = ({ route, navigation }) => {
  const { mood, language } = route.params;  // Get mood and language passed from previous screen
  const [tracks, setTracks] = useState([]);  // State to store tracks
  const [loading, setLoading] = useState(true);  // State to handle loading indicator
  const [currentTrack, setCurrentTrack] = useState(null); // Track currently playing
  
  // Initialize the track player
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
          ],
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
          ],
        });
      } catch (error) {
        console.error('Error setting up track player:', error);
      }
    };
    
    setupPlayer();
    fetchTracks();  // Fetch tracks when the component loads
    
    // Clean up on unmount
    return () => {
      TrackPlayer.destroy();
    };
  }, [mood, language]);  // Re-run the effect when mood or language changes
  
  const fetchTracks = async () => {
    try {
      console.log(`Fetching tracks for mood: ${mood.label}, language: ${language.label}`);  // Debug log

      const response = await axios.get('http://192.168.29.38:5000/api/music', {
        params: {
          mood: mood.label,   // Pass mood to backend
          language: language.label,   // Pass language to backend
        },
      });

      console.log('API Response:', response.data);  // Log API response

      if (response.data && response.data.length > 0) {
        setTracks(response.data);  // Update tracks state
      } else {
        console.warn('No tracks found for this mood and language.');
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);  // Log error
      setTracks([]);  // Set to empty array if error occurs
    } finally {
      setLoading(false);  // Stop loading indicator
    }
  };

  // Function to play a track
  const playTrack = async (track) => {
    try {
      // Reset the player before adding new track
      await TrackPlayer.reset();
      
      // Add the track to the player queue
      await TrackPlayer.add({
        id: track.id,
        url: track.stream_url || 'https://example.com/placeholder.mp3', // Use actual stream URL from your backend
        title: track.title,
        artist: track.artist,
        artwork: track.artwork || 'https://via.placeholder.com/50',
      });
      
      // Start playback
      await TrackPlayer.play();
      setCurrentTrack(track.id);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  // Function to handle play/pause
  const togglePlayback = async (track) => {
    if (currentTrack === track.id) {
      // If this track is already playing, toggle play/pause
      const state = await TrackPlayer.getState();
      if (state === TrackPlayer.STATE_PLAYING) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } else {
      // If it's a different track, play it
      playTrack(track);
    }
  };

  const renderTrackItem = ({ item }) => (
    <TouchableOpacity style={styles.trackItem} onPress={() => togglePlayback(item)}>
      <Image source={{ uri: item.artwork || 'https://via.placeholder.com/50' }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => togglePlayback(item)}
      >
        <Text style={styles.playButtonText}>
          {currentTrack === item.id ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your {mood.label} Playlist</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <View style={styles.playlistInfo}>
        <View style={[styles.moodIndicator, { backgroundColor: mood.color }]}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        </View>
        <View style={styles.playlistDetails}>
          <Text style={styles.playlistTitle}>{mood.label} Vibes</Text>
          <Text style={styles.playlistSubtitle}>{language.label} music for your {mood.label.toLowerCase()} mood</Text>
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" style={styles.loader} />
      ) : tracks.length > 0 ? (
        <FlatList
          data={tracks}  // Use tracks fetched from backend
          keyExtractor={item => item.id}
          renderItem={renderTrackItem}
          contentContainerStyle={styles.tracksList}
        />
      ) : (
        <Text style={styles.noTracksText}>No tracks available for this selection.</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playlistInfo: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  moodIndicator: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  moodEmoji: {
    fontSize: 36,
  },
  playlistDetails: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  playlistSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTracksText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  tracksList: {
    padding: 15,
  },
  trackItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    marginBottom: 10,
    alignItems: 'center',
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  trackArtist: {
    fontSize: 14,
    color: '#888',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlaylistScreen;
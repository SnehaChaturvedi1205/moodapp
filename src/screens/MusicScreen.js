import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';

const MusicScreen = ({ route }) => {
  const { mood, language } = route.params;
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:5000/api/music?mood=${mood}&language=${language}`);
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error('Error fetching music:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [mood, language]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Songs for {mood} Mood</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.trackItem}>
              <Image source={{ uri: item.artwork }} style={styles.artwork} />
              <View>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  trackItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  artwork: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  trackTitle: { fontSize: 18, fontWeight: 'bold' },
  artist: { fontSize: 16, color: 'gray' },
});

export default MusicScreen;

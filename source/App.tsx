import { useEffect, useRef, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';

const notes = [
  { id: 1, name: 'C', color: '#e65050', width: '100%' as const },
  { id: 2, name: 'D', color: '#f28c38', width: '91%' as const },
  { id: 3, name: 'E', color: '#e5bd39', width: '84%' as const },
  { id: 4, name: 'F', color: '#75b94b', width: '91%' as const },
  { id: 5, name: 'G', color: '#39a987', width: '84%' as const },
  { id: 6, name: 'A', color: '#438cc8', width: '91%' as const },
  { id: 7, name: 'B', color: '#8c67bd', width: '84%' as const },
];

Sound.setCategory('Playback');

export default function App() {
  const players = useRef<Sound[]>([]);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState('');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loaded = 0;
    const sounds = notes.map(note => new Sound(`note${note.id}.wav`, Sound.MAIN_BUNDLE, error => {
      if (error) {
        if (isMounted) setLoadError(true);
        return;
      }
      loaded += 1;
      if (isMounted && loaded === notes.length) setReady(true);
    }));
    players.current = sounds;
    return () => {
      isMounted = false;
      sounds.forEach(sound => sound.release());
    };
  }, []);

  const playNote = (id: number, name: string) => {
    const sound = players.current[id - 1];
    if (!sound || !ready) return;
    sound.stop(() => {
      sound.setCurrentTime(0);
      setPlaying(name);
      sound.play();
      setTimeout(() => setPlaying(current => current === name ? '' : current), 1400);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>A COLORFUL LITTLE INSTRUMENT</Text>
          <Text style={styles.title}>Xylophone</Text>
          <Text style={styles.subtitle}>{loadError ? 'Could not load the notes' : ready ? (playing ? `Playing note ${playing}` : 'Tap a key to play') : 'Loading notes…'}</Text>
        </View>
        <View style={styles.keys}>
          {notes.map(note => (
            <Pressable
              key={note.id}
              accessibilityRole="button"
              accessibilityLabel={`Play note ${note.name}`}
              disabled={!ready}
              onPress={() => playNote(note.id, note.name)}
              style={({ pressed }) => [styles.key, { width: note.width, backgroundColor: note.color }, pressed && styles.pressed]}
            >
              <Text style={styles.keyLabel}>{note.name}</Text>
              <Text style={styles.keyNumber}>NOTE {note.id}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.footer}>Seven notes · one tune at a time</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6fa' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 },
  heading: { alignItems: 'center', marginBottom: 15 },
  eyebrow: { color: '#778096', fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#20283a', fontSize: 30, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#68738a', fontSize: 13, marginTop: 3 },
  keys: { width: '100%', flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
  key: { flex: 1, maxHeight: 92, minHeight: 64, borderRadius: 12, marginVertical: 4, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  keyLabel: { color: '#ffffff', fontSize: 23, fontWeight: '900' },
  keyNumber: { color: '#ffffff', opacity: 0.85, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  footer: { color: '#858da0', fontSize: 11, letterSpacing: 0.5, marginTop: 8 },
});

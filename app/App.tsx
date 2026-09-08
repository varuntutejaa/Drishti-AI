import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.brand}>Drishti AI</Text>
        <Text style={styles.subtitle}>Explainable Retinal Screening</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7f9',
    padding: 24,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    backgroundColor: '#ffffff',
    shadowColor: '#1e2d3a',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 6,
  },
  brand: {
    color: '#0f766e',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#60717e',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

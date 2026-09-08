import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function uploadImage() {
    setSubmitted(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function clickImage() {
    setSubmitted(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Please allow camera access to click a retinal image.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  function submitImage() {
    if (!imageUri) {
      Alert.alert('No image selected', 'Please upload or click an image before submitting.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.brand}>Drishti AI</Text>
        <Text style={styles.subtitle}>Explainable Retinal Screening</Text>

        <Pressable style={styles.primaryButton} onPress={() => setShowImageOptions(true)}>
          <Text style={styles.primaryButtonText}>Send Image</Text>
        </Pressable>

        {showImageOptions && (
          <View style={styles.uploadPanel}>
            <Text style={styles.panelTitle}>Choose image source</Text>
            <View style={styles.buttonRow}>
              <Pressable style={styles.secondaryButton} onPress={uploadImage}>
                <Text style={styles.secondaryButtonText}>Upload Image</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={clickImage}>
                <Text style={styles.secondaryButtonText}>Click Image</Text>
              </Pressable>
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

            <Pressable style={[styles.submitButton, !imageUri && styles.disabledButton]} onPress={submitImage}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>

            {submitted && (
              <Text style={styles.successText}>Image submitted for Drishti AI screening.</Text>
            )}
          </View>
        )}
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    backgroundColor: '#ffffff',
    padding: 24,
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
  primaryButton: {
    width: '100%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0f766e',
    marginTop: 28,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  uploadPanel: {
    width: '100%',
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    backgroundColor: '#f9fbfc',
    padding: 14,
  },
  panelTitle: {
    color: '#172026',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c8d4dc',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#21323d',
    fontSize: 14,
    fontWeight: '800',
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#e5edf2',
  },
  submitButton: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0f766e',
    marginTop: 14,
  },
  disabledButton: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
});

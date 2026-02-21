import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// NOTE: replace this URL with the address where your Python server is
// running. When developing on an emulator you can usually use
// 10.0.2.2:5000 (Android) or localhost:5000 for iOS simulators. On a real
// device, point to the machine's LAN IP.
const PREDICTION_URL = 'http://10.0.2.2:5000/predict';

export default function SegmentationScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [maskUri, setMaskUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    if (!permissionGranted) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      setMaskUri(null);
    }
  };

  const uploadAndPredict = async () => {
    if (!imageUri) return;
    setLoading(true);
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : 'image';

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: fileName,
      type,
    });

    try {
      const response = await fetch(PREDICTION_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const json = await response.json();
      if (json.mask) {
        setMaskUri('data:image/png;base64,' + json.mask);
      } else {
        console.warn('Prediction server returned unexpected response', json);
      }
    } catch (error) {
      console.error('Error contacting prediction server', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Semantic Segmentation</Text>
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      {imageUri && !loading && (
        <Button title="Run prediction" onPress={uploadAndPredict} />
      )}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {maskUri && (
        <>
          <Text style={styles.subtitle}>Predicted mask</Text>
          <Image source={{ uri: maskUri }} style={styles.preview} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
  },
  preview: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 16,
    backgroundColor: '#eee',
  },
  loader: {
    marginVertical: 20,
  },
});

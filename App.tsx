import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import Video, {DRMType, ReactVideoSourceProperties} from 'react-native-video';
import { Buffer } from 'buffer';

type SourceType = ReactVideoSourceProperties | null;

const DRMExample = () => {
  const [loading, setLoading] = React.useState(false);

  const [source, setSource] = React.useState<SourceType>(null);

  const [hls, setHls] = React.useState(
    '<Your m3u8 URL>',
  );
  const [fairplayLicense, setFairplayLicense] = React.useState(
    '<Fairplay license url wth expiry and token parameters>',
  );
  const [fairplayCertificate, setFairplayCertificate] = React.useState(
    '<Fairplay certificate url>',
  );


  const handlePlayStopVideo = () => {
    if (source !== null) {
      setSource(null);
      return;
    }

    setLoading(true);

    const newSource: ReactVideoSourceProperties = {};

    if (Platform.OS === 'ios') {
      if (fairplayLicense && fairplayCertificate) {
        newSource.uri = hls;
        newSource.drm = {
          type: DRMType.FAIRPLAY,
          licenseServer: fairplayLicense,
          certificateUrl: fairplayCertificate,
          getLicense: (spcString, contentId, licenseUrl, loadedLicenseUrl) => {
            const body = JSON.stringify({spc: spcString});
            
            return fetch(`${licenseUrl}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: body,
            })
              .then((response) => response.json())
              .then((response) => {
                return response.ckc;
              })
              .catch((error) => {
                console.error('Error', error);
              });
          },
        };
      } else {
        Alert.alert('Error', 'Please enter Fairplay License and Certificate');
        setLoading(false);
      }
    }

    setSource(newSource);
  };

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text>DRM is not supported on this platform</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>DRM Protected Stream Player</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {source && source.uri && (
        <Video
          key={source.uri}
          onLoad={() => {
            setLoading(false);
          }}
          onError={(e) => {
            console.log('error', e);
            Alert.alert('Error', e.error.localizedDescription);
            setLoading(false);
          }}
          source={source}
          resizeMode="contain"
          style={styles.video}
          controls
          muted={false}
        />
      )}

      {Platform.OS === 'ios' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="HLS URL"
            value={hls}
            onChangeText={(text) => setHls(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Fairplay License URL"
            value={fairplayLicense}
            onChangeText={(text) => setFairplayLicense(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Fairplay Certificate URL"
            value={fairplayCertificate}
            onChangeText={(text) => setFairplayCertificate(text)}
          />
        </>
      )}

      <Button
        title={`${source !== null ? 'Stop' : 'Play'} Video`}
        onPress={handlePlayStopVideo}
      />
    </ScrollView>
  );
};

export default DRMExample;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 80,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: 'white',
  },
});
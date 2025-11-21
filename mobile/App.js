import { StatusBar } from 'expo-status-bar';
import * as Brightness from 'expo-brightness';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';

const MESSAGE = 'PERSISTENCE OF VISION';

const FONT_5x7 = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '11110', '10001', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '11110', '10000', '10000', '10000', '11111'],
  F: ['11111', '10000', '11110', '10000', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  H: ['10001', '10001', '11111', '10001', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '11100', '10010', '10010', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10010', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '01010', '00100', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

const EMPTY_COLUMN = new Array(7).fill(false);

const encodeMessageToColumns = (message) => {
  const columns = [];
  const upper = message.toUpperCase();

  for (const char of upper) {
    const pattern = FONT_5x7[char] || FONT_5x7[' '];
    for (let col = 0; col < 5; col += 1) {
      const column = pattern.map((row) => row[col] === '1');
      columns.push(column);
    }
    columns.push([...EMPTY_COLUMN]);
  }

  return columns;
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [speedMs, setSpeedMs] = useState(15);

  const columns = useMemo(() => encodeMessageToColumns(MESSAGE), []);
  const currentColumn = columns[currentColumnIndex] || EMPTY_COLUMN;

  useEffect(() => {
    let intervalId;
    if (isPlaying && columns.length > 0) {
      intervalId = setInterval(() => {
        setCurrentColumnIndex((index) => (index + 1) % columns.length);
      }, speedMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, speedMs, columns.length]);

  useEffect(() => {
    let previousBrightness;
    const maximizeBrightness = async () => {
      try {
        const permission = await Brightness.getPermissionsAsync();
        if (permission.status !== 'granted') {
          const request = await Brightness.requestPermissionsAsync();
          if (request.status !== 'granted') {
            return;
          }
        }

        previousBrightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1);
      } catch (error) {
        console.warn('Unable to adjust brightness', error);
      }
    };

    maximizeBrightness();

    return () => {
      if (previousBrightness !== undefined) {
        Brightness.setBrightnessAsync(previousBrightness).catch(() => {});
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.header}>Persistence of Vision</Text>
      <Text style={styles.instructions}>
        Hold the phone at arm&apos;s length in a dark room and move it left and right to see the
        message appear in mid-air.
      </Text>

      <View style={styles.displayArea}>
        <View style={styles.ledStrip}>
          {currentColumn.map((isOn, index) => (
            <View
              key={`led-${index}`}
              style={[styles.ledPixel, isOn ? styles.ledOn : styles.ledOff]}
            />
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.button, isPlaying ? styles.buttonPause : styles.buttonStart]}
          onPress={() => setIsPlaying((playing) => !playing)}
        >
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <View style={styles.speedRow}>
          <Text style={styles.speedLabel}>Speed: {speedMs.toFixed(0)} ms/column</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={60}
            step={1}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#666"
            thumbTintColor="#ffffff"
            value={speedMs}
            onValueChange={(value) => setSpeedMs(value)}
          />
        </View>
      </View>

      <Text style={styles.footerMessage}>Message: "{MESSAGE}"</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  header: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    color: '#d9d9d9',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  displayArea: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    width: '100%',
    alignItems: 'center',
  },
  ledStrip: {
    width: 120,
    height: 280,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ledPixel: {
    width: '100%',
    height: 30,
    borderRadius: 4,
  },
  ledOn: {
    backgroundColor: '#ffffff',
  },
  ledOff: {
    backgroundColor: '#111111',
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonStart: {
    backgroundColor: '#2d6be0',
  },
  buttonPause: {
    backgroundColor: '#a83232',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  speedRow: {
    width: '100%',
    alignItems: 'stretch',
  },
  speedLabel: {
    color: '#d9d9d9',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footerMessage: {
    marginTop: 20,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

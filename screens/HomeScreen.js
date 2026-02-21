import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [electricity, setElectricity] = useState('');
  const [travel, setTravel] = useState('');
  const [plastic, setPlastic] = useState('');
  const [lpg, setLpg] = useState('');
  const [waste, setWaste] = useState('');
  const [totalCO2, setTotalCO2] = useState(0);
  const counterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const calculateCO2 = () => {
    const elec = parseFloat(electricity) || 0;
    const trav = parseFloat(travel) || 0;
    const plast = parseFloat(plastic) || 0;
    const lpgVal = parseFloat(lpg) || 0;
    const wst = parseFloat(waste) || 0;

    const total = (elec * 0.82) + (trav * 0.21) + (plast * 6) + (lpgVal * 2.98) + (wst * 0.5);
    
    Animated.timing(counterAnim, {
      toValue: total,
      duration: 800,
      useNativeDriver: false,
    }).start();
    
    setTotalCO2(total);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.heroSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.heroSubtitle}>Environmental Intelligence Platform</Text>
          <View style={styles.divider} />
          <Text style={styles.heroDescription}>
            Protecting Indian Rivers Through{'\n'}Advanced Monitoring & Analytics
          </Text>
        </Animated.View>

        <View style={styles.statsGrid}>
          <PremiumStatCard 
            value="2.4M" 
            label="TONS CO₂ TRACKED"
            trend="-12%"
            icon="◆"
            trendPositive={true}
          />
          <PremiumStatCard 
            value="847" 
            label="RIVERS MONITORED"
            trend="+5%"
            icon="◉"
            trendPositive={true}
          />
          <PremiumStatCard 
            value="156" 
            label="ACTIVE CLEANUPS"
            trend="+23%"
            icon="◈"
            trendPositive={true}
          />
          <PremiumStatCard 
            value="98.2%" 
            label="DETECTION ACCURACY"
            trend="+2%"
            icon="◐"
            trendPositive={true}
          />
        </View>

        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>MISSION CRITICAL</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionLabel}>MAHAKUMBH 2027</Text>
            <Text style={styles.missionText}>
              Real-time pollution monitoring during India's largest gathering
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '67%' }]} />
            </View>
            <Text style={styles.progressLabel}>Preparation: 67% Complete</Text>
          </View>
        </View>

        <View style={styles.co2Section}>
          <Text style={styles.sectionTitle}>CO₂ EMISSION CALCULATOR</Text>
          <View style={styles.co2Card}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Electricity (kWh)</Text>
              <TextInput
                style={styles.input}
                value={electricity}
                onChangeText={setElectricity}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Travel (km)</Text>
              <TextInput
                style={styles.input}
                value={travel}
                onChangeText={setTravel}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Plastic (kg)</Text>
              <TextInput
                style={styles.input}
                value={plastic}
                onChangeText={setPlastic}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>LPG (kg)</Text>
              <TextInput
                style={styles.input}
                value={lpg}
                onChangeText={setLpg}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Waste (kg)</Text>
              <TextInput
                style={styles.input}
                value={waste}
                onChangeText={setWaste}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity style={styles.calculateBtn} onPress={calculateCO2}>
              <Text style={styles.calculateBtnText}>CALCULATE EMISSIONS</Text>
            </TouchableOpacity>
            {totalCO2 > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>DAILY CO₂ EMISSIONS</Text>
                <Text style={styles.resultValue}>{totalCO2.toFixed(2)} kg</Text>
                <View style={styles.impactMeter}>
                  <View style={[styles.impactFill, { width: `${Math.min(totalCO2 * 2, 100)}%` }]} />
                </View>
                <Text style={styles.impactLabel}>
                  {totalCO2 < 10 ? 'LOW IMPACT' : totalCO2 < 25 ? 'MODERATE IMPACT' : 'HIGH IMPACT'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <FeatureItem 
            title="SATELLITE MONITORING"
            description="AI-powered debris detection across 847 river systems"
          />
          <FeatureItem 
            title="CARBON TRACKING"
            description="Individual and collective footprint analytics"
          />
          <FeatureItem 
            title="CLEANUP COORDINATION"
            description="Authority & NGO deployment management"
          />
          {/* quick link to segmentation screen */}
          <TouchableOpacity
            style={[styles.featureButton, { marginTop: 24 }]}
            onPress={() => navigation.navigate('Segmentation')}
          >
            <Text style={styles.featureButtonText}>View Semantic Segmentation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function PremiumStatCard({ value, label, trend, icon, trendPositive }) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.premiumCard, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.cardGlow} />
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
        <View style={styles.cardTrendContainer}>
          <View style={[styles.cardTrendBar, { width: trendPositive ? '70%' : '40%' }]} />
          <Text style={[styles.cardTrend, trendPositive && styles.cardTrendPositive]}>
            {trend}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function FeatureItem({ title, description }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  heroSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '600',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  heroDescription: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    fontWeight: '400',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  premiumCard: {
    width: (width - 64) / 2,
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: '#fff',
    opacity: 0.05,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
    padding: 16,
    justifyContent: 'space-between',
  },
  cardIcon: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.3,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    lineHeight: 12,
  },
  cardTrendContainer: {
    marginTop: 8,
  },
  cardTrendBar: {
    height: 2,
    backgroundColor: '#333',
    marginBottom: 4,
  },
  cardTrend: {
    fontSize: 11,
    color: '#f44',
    fontWeight: '700',
  },
  cardTrendPositive: {
    color: '#4f8',
  },
  missionSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 16,
  },
  missionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  missionLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
    marginBottom: 8,
  },
  missionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  progressLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  featureDot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    marginTop: 6,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  featureButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  featureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  co2Section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  co2Card: {
    backgroundColor: '#111',
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    flex: 1,
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    width: 100,
    textAlign: 'right',
  },
  calculateBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
  resultSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  resultLabel: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  impactMeter: {
    height: 6,
    backgroundColor: '#222',
    marginBottom: 8,
  },
  impactFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  impactLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '700',
    letterSpacing: 1,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polygon, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#111111' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#666666' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#222222' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const pollutionHotspots = [
  { id: 1, lat: 25.3176, lng: 82.9739, severity: 'critical', density: 847, type: 'Plastic & Organic', amount: '1,247 kg', status: 'Cleanup Deployed' },
  { id: 2, lat: 25.3276, lng: 82.9839, severity: 'high', density: 634, type: 'Industrial Waste', amount: '856 kg', status: 'Investigation Active' },
  { id: 3, lat: 25.3076, lng: 82.9639, severity: 'moderate', density: 423, type: 'Mixed Waste', amount: '534 kg', status: 'NGO Notified' },
  { id: 4, lat: 25.3376, lng: 82.9939, severity: 'low', density: 156, type: 'Organic Matter', amount: '234 kg', status: 'Monitoring' },
];

export default function RiverMonitorScreen() {
  const [selectedRiver, setSelectedRiver] = useState('ganga');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showMLPipeline, setShowMLPipeline] = useState(false);
  const [layers, setLayers] = useState({
    plastic: true,
    organic: true,
    alerts: true,
    cleanup: true,
  });

  const getMarkerColor = (severity) => {
    switch(severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'moderate': return '#ffaa00';
      case 'low': return '#00ff00';
      default: return '#ffffff';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={darkMapStyle}
          initialRegion={{
            latitude: 25.3176,
            longitude: 82.9739,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {pollutionHotspots.map((hotspot) => (
            <Marker
              key={hotspot.id}
              coordinate={{ latitude: hotspot.lat, longitude: hotspot.lng }}
              onPress={() => setSelectedHotspot(hotspot)}
            >
              <View style={[styles.marker, { backgroundColor: getMarkerColor(hotspot.severity) }]}>
                <View style={styles.markerInner} />
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.mapOverlay}>
          <Text style={styles.mapLabel}>LIVE SATELLITE VIEW</Text>
          <Text style={styles.mapCoords}>25.3176° N, 82.9739° E</Text>
        </View>

        <View style={styles.layerControls}>
          <LayerButton 
            label="PLASTIC" 
            active={layers.plastic}
            onPress={() => setLayers({...layers, plastic: !layers.plastic})}
          />
          <LayerButton 
            label="ORGANIC" 
            active={layers.organic}
            onPress={() => setLayers({...layers, organic: !layers.organic})}
          />
          <LayerButton 
            label="ALERTS" 
            active={layers.alerts}
            onPress={() => setLayers({...layers, alerts: !layers.alerts})}
          />
          <LayerButton 
            label="CLEANUP" 
            active={layers.cleanup}
            onPress={() => setLayers({...layers, cleanup: !layers.cleanup})}
          />
        </View>
      </View>

      {selectedHotspot && (
        <View style={styles.hotspotDetail}>
          <View style={styles.hotspotHeader}>
            <Text style={styles.hotspotTitle}>HOTSPOT DETECTED</Text>
            <TouchableOpacity onPress={() => setSelectedHotspot(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hotspotRow}>
            <Text style={styles.hotspotLabel}>Density:</Text>
            <Text style={styles.hotspotValue}>{selectedHotspot.density} kg/km²</Text>
          </View>
          <View style={styles.hotspotRow}>
            <Text style={styles.hotspotLabel}>Type:</Text>
            <Text style={styles.hotspotValue}>{selectedHotspot.type}</Text>
          </View>
          <View style={styles.hotspotRow}>
            <Text style={styles.hotspotLabel}>Amount:</Text>
            <Text style={styles.hotspotValue}>{selectedHotspot.amount}</Text>
          </View>
          <View style={styles.hotspotRow}>
            <Text style={styles.hotspotLabel}>Status:</Text>
            <Text style={styles.hotspotValue}>{selectedHotspot.status}</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.mlPipelineBtn}
          onPress={() => setShowMLPipeline(!showMLPipeline)}
        >
          <Text style={styles.mlPipelineBtnText}>
            {showMLPipeline ? 'HIDE' : 'SHOW'} ML PIPELINE
          </Text>
        </TouchableOpacity>

        {showMLPipeline && <MLPipelineView />}

        <View style={styles.riverSelector}>
          <RiverTab 
            name="GANGA" 
            active={selectedRiver === 'ganga'}
            onPress={() => setSelectedRiver('ganga')}
          />
          <RiverTab 
            name="YAMUNA" 
            active={selectedRiver === 'yamuna'}
            onPress={() => setSelectedRiver('yamuna')}
          />
          <RiverTab 
            name="GODAVARI" 
            active={selectedRiver === 'godavari'}
            onPress={() => setSelectedRiver('godavari')}
          />
        </View>

        {selectedRiver === 'ganga' && <GangaData />}
        {selectedRiver === 'yamuna' && <YamunaData />}
        {selectedRiver === 'godavari' && <GodavariData />}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEBRIS DETECTION</Text>
          {pollutionHotspots.map((hotspot) => (
            <DebrisCard 
              key={hotspot.id}
              location={`Varanasi Zone ${hotspot.id}`}
              density={`${hotspot.density} kg/km²`}
              type={hotspot.type}
              status={hotspot.severity.toUpperCase()}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function MLPipelineView() {
  return (
    <View style={styles.mlPipeline}>
      <Text style={styles.mlTitle}>ML DETECTION PIPELINE</Text>
      <View style={styles.pipelineFlow}>
        <PipelineStep label="Satellite Image Input" />
        <PipelineArrow />
        <PipelineStep label="Image Preprocessing" />
        <PipelineArrow />
        <PipelineStep label="ML Detection Model" />
        <PipelineArrow />
        <PipelineStep label="Garbage Classification" />
        <PipelineArrow />
        <PipelineStep label="Density Estimation" />
        <PipelineArrow />
        <PipelineStep label="Hotspot Mapping" />
        <PipelineArrow />
        <PipelineStep label="Cleanup Recommendation" />
      </View>
    </View>
  );
}

function PipelineStep({ label }) {
  return (
    <View style={styles.pipelineStep}>
      <Text style={styles.pipelineStepText}>{label}</Text>
    </View>
  );
}

function PipelineArrow() {
  return (
    <View style={styles.pipelineArrow}>
      <View style={styles.arrowLine} />
      <Text style={styles.arrowHead}>▼</Text>
    </View>
  );
}

function LayerButton({ label, active, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.layerBtn, active && styles.layerBtnActive]}
      onPress={onPress}
    >
      <Text style={[styles.layerBtnText, active && styles.layerBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function RiverTab({ name, active, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.riverTab, active && styles.riverTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.riverTabText, active && styles.riverTabTextActive]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

function GangaData() {
  return (
    <View style={styles.riverData}>
      <View style={styles.dataGrid}>
        <DataPoint label="CLEANLINESS" value="6.2/10" color="#fff" />
        <DataPoint label="TURBIDITY" value="89 NTU" color="#f44" />
      </View>
      <View style={styles.dataGrid}>
        <DataPoint label="pH LEVEL" value="7.4" color="#4f8" />
        <DataPoint label="FLOW RATE" value="2,847 m³/s" color="#fff" />
      </View>
      <View style={styles.heatmapSection}>
        <Text style={styles.heatmapTitle}>POLLUTION HEATMAP</Text>
        <View style={styles.heatmapGrid}>
          <View style={[styles.heatCell, { backgroundColor: '#f44' }]} />
          <View style={[styles.heatCell, { backgroundColor: '#f88' }]} />
          <View style={[styles.heatCell, { backgroundColor: '#faa' }]} />
          <View style={[styles.heatCell, { backgroundColor: '#f88' }]} />
          <View style={[styles.heatCell, { backgroundColor: '#faa' }]} />
          <View style={[styles.heatCell, { backgroundColor: '#fcc' }]} />
        </View>
      </View>
    </View>
  );
}

function YamunaData() {
  return (
    <View style={styles.riverData}>
      <View style={styles.dataGrid}>
        <DataPoint label="CLEANLINESS" value="4.8/10" color="#f44" />
        <DataPoint label="TURBIDITY" value="134 NTU" color="#f44" />
      </View>
      <View style={styles.dataGrid}>
        <DataPoint label="pH LEVEL" value="8.1" color="#fa4" />
        <DataPoint label="FLOW RATE" value="1,234 m³/s" color="#fff" />
      </View>
    </View>
  );
}

function GodavariData() {
  return (
    <View style={styles.riverData}>
      <View style={styles.dataGrid}>
        <DataPoint label="CLEANLINESS" value="7.9/10" color="#4f8" />
        <DataPoint label="TURBIDITY" value="45 NTU" color="#4f8" />
      </View>
      <View style={styles.dataGrid}>
        <DataPoint label="pH LEVEL" value="7.2" color="#4f8" />
        <DataPoint label="FLOW RATE" value="3,456 m³/s" color="#fff" />
      </View>
    </View>
  );
}

function DataPoint({ label, value, color }) {
  return (
    <View style={styles.dataPoint}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, { color }]}>{value}</Text>
    </View>
  );
}

function DebrisCard({ location, density, type, status }) {
  const statusColor = status === 'CRITICAL' ? '#fff' : status === 'HIGH' ? '#ccc' : '#888';
  
  return (
    <View style={styles.debrisCard}>
      <View style={styles.debrisHeader}>
        <Text style={styles.debrisLocation}>{location}</Text>
        <Text style={[styles.debrisStatus, { color: statusColor }]}>{status}</Text>
      </View>
      <View style={styles.debrisRow}>
        <Text style={styles.debrisLabel}>Density:</Text>
        <Text style={styles.debrisValue}>{density}</Text>
      </View>
      <View style={styles.debrisRow}>
        <Text style={styles.debrisLabel}>Type:</Text>
        <Text style={styles.debrisValue}>{type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapContainer: {
    height: 350,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  mapLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    fontWeight: '700',
  },
  mapCoords: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  layerControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  layerBtn: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  layerBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  layerBtnText: {
    fontSize: 9,
    color: '#666',
    fontWeight: '700',
    letterSpacing: 1,
  },
  layerBtnTextActive: {
    color: '#000',
  },
  hotspotDetail: {
    backgroundColor: '#111',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hotspotTitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 1,
  },
  closeBtn: {
    fontSize: 18,
    color: '#666',
    fontWeight: '700',
  },
  hotspotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hotspotLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  hotspotValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  mlPipelineBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mlPipelineBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
  mlPipeline: {
    backgroundColor: '#111',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  mlTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
  },
  pipelineFlow: {
    alignItems: 'center',
  },
  pipelineStep: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  pipelineStepText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  pipelineArrow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  arrowLine: {
    width: 2,
    height: 12,
    backgroundColor: '#333',
  },
  arrowHead: {
    fontSize: 12,
    color: '#333',
    marginTop: -4,
  },
  riverSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  riverTab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  riverTabActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  riverTabText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '700',
    letterSpacing: 1,
  },
  riverTabTextActive: {
    color: '#000',
  },
  riverData: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dataPoint: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  dataLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  heatmapSection: {
    backgroundColor: '#111',
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  heatmapTitle: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 12,
  },
  heatmapGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  heatCell: {
    flex: 1,
    height: 40,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 16,
  },
  debrisCard: {
    backgroundColor: '#111',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  debrisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  debrisLocation: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
  debrisStatus: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  debrisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  debrisLabel: {
    fontSize: 12,
    color: '#666',
  },
  debrisValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

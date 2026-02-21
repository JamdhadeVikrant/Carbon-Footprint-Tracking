import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>23</Text>
            <Text style={styles.summaryLabel}>ACTIVE ALERTS</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>8</Text>
            <Text style={styles.summaryLabel}>CRITICAL</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRITICAL ALERTS</Text>
          <AlertItem 
            severity="CRITICAL"
            title="Mahakumbh Zone - Debris Surge"
            location="Ganga, Prayagraj"
            metric="1,247 kg/km² detected"
            time="8 min ago"
            action="CLEANUP DEPLOYED"
            impact="HIGH - 50km river stretch affected"
            status="ACTIVE RESPONSE"
          />
          <AlertItem 
            severity="CRITICAL"
            title="Industrial Discharge Detected"
            location="Yamuna, Mathura"
            metric="pH: 9.2, Toxicity: High"
            time="23 min ago"
            action="INVESTIGATION ACTIVE"
            impact="CRITICAL - Water unsafe for 24hrs"
            status="AUTHORITY NOTIFIED"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HIGH PRIORITY</Text>
          <AlertItem 
            severity="HIGH"
            title="Plastic Accumulation"
            location="Godavari, Nashik"
            metric="634 kg/km²"
            time="1 hour ago"
            action="NGO NOTIFIED"
            impact="MODERATE - 15km affected"
            status="CLEANUP SCHEDULED"
          />
          <AlertItem 
            severity="HIGH"
            title="Turbidity Spike"
            location="Narmada, Jabalpur"
            metric="178 NTU"
            time="2 hours ago"
            action="MONITORING"
            impact="LOW - Localized event"
            status="UNDER OBSERVATION"
          />
          <AlertItem 
            severity="HIGH"
            title="Debris Surge Warning"
            location="Ganga, Haridwar"
            metric="Pre-event detection: 423 kg/km²"
            time="3 hours ago"
            action="PREVENTIVE DEPLOYMENT"
            impact="PREDICTED - Festival gathering"
            status="TEAMS ON STANDBY"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLEANUP COORDINATION</Text>
          <CleanupCard 
            zone="Varanasi Ghats"
            teams="12 Teams Deployed"
            progress="67%"
            status="IN PROGRESS"
          />
          <CleanupCard 
            zone="Haridwar Banks"
            teams="8 Teams Deployed"
            progress="34%"
            status="IN PROGRESS"
          />
          <CleanupCard 
            zone="Allahabad Sangam"
            teams="15 Teams Scheduled"
            progress="0%"
            status="SCHEDULED"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NGO PARTNERSHIPS</Text>
          <NGOCard 
            name="Ganga Action Parivar"
            active="23 Operations"
            impact="847 tons removed"
          />
          <NGOCard 
            name="Clean Rivers Initiative"
            active="16 Operations"
            impact="534 tons removed"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function AlertItem({ severity, title, location, metric, time, action, impact, status }) {
  const severityColor = severity === 'CRITICAL' ? '#000' : '#111';
  const textColor = severity === 'CRITICAL' ? '#fff' : '#fff';
  
  return (
    <View style={[styles.alertItem, { backgroundColor: severityColor }]}>
      <View style={styles.alertTop}>
        <Text style={[styles.alertSeverity, { color: textColor }]}>{severity}</Text>
        <Text style={styles.alertTime}>{time}</Text>
      </View>
      <Text style={[styles.alertTitle, { color: textColor }]}>{title}</Text>
      <Text style={styles.alertLocation}>{location}</Text>
      <Text style={styles.alertMetric}>{metric}</Text>
      {impact && <Text style={styles.alertImpact}>Impact: {impact}</Text>}
      {status && <Text style={styles.alertStatus}>Status: {status}</Text>}
      <View style={styles.alertAction}>
        <Text style={styles.alertActionText}>{action}</Text>
      </View>
    </View>
  );
}

function CleanupCard({ zone, teams, progress, status }) {
  return (
    <View style={styles.cleanupCard}>
      <View style={styles.cleanupHeader}>
        <Text style={styles.cleanupZone}>{zone}</Text>
        <Text style={styles.cleanupStatus}>{status}</Text>
      </View>
      <Text style={styles.cleanupTeams}>{teams}</Text>
      <View style={styles.cleanupProgress}>
        <View style={[styles.cleanupProgressFill, { width: progress }]} />
      </View>
      <Text style={styles.cleanupProgressText}>{progress} Complete</Text>
    </View>
  );
}

function NGOCard({ name, active, impact }) {
  return (
    <View style={styles.ngoCard}>
      <Text style={styles.ngoName}>{name}</Text>
      <View style={styles.ngoStats}>
        <View style={styles.ngoStat}>
          <Text style={styles.ngoStatLabel}>Active</Text>
          <Text style={styles.ngoStatValue}>{active}</Text>
        </View>
        <View style={styles.ngoStat}>
          <Text style={styles.ngoStatLabel}>Impact</Text>
          <Text style={styles.ngoStatValue}>{impact}</Text>
        </View>
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
    paddingTop: 24,
    paddingBottom: 30,
  },
  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 16,
  },
  alertItem: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertSeverity: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  alertTime: {
    fontSize: 10,
    color: '#666',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  alertMetric: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
  },
  alertImpact: {
    fontSize: 11,
    color: '#f88',
    marginBottom: 4,
    fontWeight: '600',
  },
  alertStatus: {
    fontSize: 11,
    color: '#8f8',
    marginBottom: 12,
    fontWeight: '600',
  },
  alertAction: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  alertActionText: {
    fontSize: 10,
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1,
  },
  cleanupCard: {
    backgroundColor: '#111',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  cleanupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cleanupZone: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
  cleanupStatus: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    fontWeight: '700',
  },
  cleanupTeams: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
  },
  cleanupProgress: {
    height: 4,
    backgroundColor: '#222',
    marginBottom: 6,
  },
  cleanupProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  cleanupProgressText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  ngoCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  ngoName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '800',
    marginBottom: 12,
  },
  ngoStats: {
    flexDirection: 'row',
    gap: 24,
  },
  ngoStat: {
    flex: 1,
  },
  ngoStatLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 4,
  },
  ngoStatValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
  },
});

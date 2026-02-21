import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [reportLocation, setReportLocation] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.scoreSection}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>7.8</Text>
            <Text style={styles.scoreLabel}>ECO-SCORE</Text>
            <View style={styles.scoreMeter}>
              <View style={[styles.scoreFill, { width: '78%' }]} />
            </View>
            <Text style={styles.scoreRank}>RANK: #234 / 12,847</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUSTAINABILITY CHALLENGES</Text>
          <ChallengeCard 
            title="Zero Plastic Week"
            description="Avoid single-use plastic for 7 days"
            progress="4/7 days"
            reward="50 ECO POINTS"
            active={activeChallenge === 1}
            onPress={() => setActiveChallenge(1)}
          />
          <ChallengeCard 
            title="River Cleanup Volunteer"
            description="Join 3 cleanup activities this month"
            progress="1/3 activities"
            reward="100 ECO POINTS"
            active={activeChallenge === 2}
            onPress={() => setActiveChallenge(2)}
          />
          <ChallengeCard 
            title="Carbon Reduction Goal"
            description="Reduce emissions by 20% this month"
            progress="12% reduced"
            reward="75 ECO POINTS"
            active={activeChallenge === 3}
            onPress={() => setActiveChallenge(3)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACHIEVEMENT BADGES</Text>
          <View style={styles.badgeGrid}>
            <Badge label="ECO WARRIOR" earned={true} />
            <Badge label="RIVER GUARDIAN" earned={true} />
            <Badge label="CARBON NEUTRAL" earned={false} />
            <Badge label="CLEANUP HERO" earned={true} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CARBON FOOTPRINT</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Monthly Emissions</Text>
              <Text style={styles.cardValue}>2.4 tons CO₂</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>vs Last Month</Text>
              <Text style={[styles.cardValue, styles.positive]}>-12%</Text>
            </View>
            <View style={styles.graphPlaceholder}>
              <View style={styles.bar} style={{ height: '60%' }} />
              <View style={styles.bar} style={{ height: '75%' }} />
              <View style={styles.bar} style={{ height: '55%' }} />
              <View style={styles.bar} style={{ height: '80%' }} />
              <View style={styles.bar} style={{ height: '45%' }} />
              <View style={styles.bar} style={{ height: '50%' }} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>POLLUTION ALERTS</Text>
          <AlertCard 
            severity="HIGH"
            location="Ganga - Varanasi"
            metric="Debris: 847 kg/km²"
            time="12 min ago"
          />
          <AlertCard 
            severity="MEDIUM"
            location="Yamuna - Delhi"
            metric="Turbidity: 156 NTU"
            time="1 hour ago"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>USER ACTIONS</Text>
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>REPORT GARBAGE LOCATION</Text>
            <TextInput
              style={styles.actionInput}
              placeholder="Enter location or coordinates"
              placeholderTextColor="#666"
              value={reportLocation}
              onChangeText={setReportLocation}
            />
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>SUBMIT REPORT</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>JOIN CLEANUP ACTIVITY</Text>
            <Text style={styles.actionDesc}>Next cleanup: Varanasi Ghats - Feb 22, 2026</Text>
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>VOLUNTEER NOW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionTitle}>SUBMIT POLLUTION ALERT</Text>
            <Text style={styles.actionDesc}>Report environmental violations</Text>
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>CREATE ALERT</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR IMPACT</Text>
          <View style={styles.impactCard}>
            <ImpactStat label="REPORTS SUBMITTED" value="23" />
            <ImpactStat label="CLEANUPS JOINED" value="7" />
            <ImpactStat label="CO₂ REDUCED" value="156 kg" />
            <ImpactStat label="ECO POINTS" value="847" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEADERBOARD</Text>
          <LeaderboardItem rank="1" name="Rajesh Kumar" score="2,847" />
          <LeaderboardItem rank="2" name="Priya Sharma" score="2,634" />
          <LeaderboardItem rank="3" name="Amit Patel" score="2,423" />
          <LeaderboardItem rank="234" name="You" score="847" highlight={true} />
        </View>
      </ScrollView>
    </View>
  );
}

function ChallengeCard({ title, description, progress, reward, active, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.challengeCard, active && styles.challengeCardActive]}
      onPress={onPress}
    >
      <Text style={styles.challengeTitle}>{title}</Text>
      <Text style={styles.challengeDesc}>{description}</Text>
      <View style={styles.challengeProgress}>
        <Text style={styles.challengeProgressText}>{progress}</Text>
        <Text style={styles.challengeReward}>{reward}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Badge({ label, earned }) {
  return (
    <View style={[styles.badge, !earned && styles.badgeLocked]}>
      <View style={styles.badgeIcon}>
        <Text style={styles.badgeIconText}>{earned ? '★' : '☆'}</Text>
      </View>
      <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>{label}</Text>
    </View>
  );
}

function AlertCard({ severity, location, metric, time }) {
  const severityColor = severity === 'HIGH' ? '#fff' : severity === 'MEDIUM' ? '#ccc' : '#666';
  const bgColor = severity === 'HIGH' ? '#000' : '#111';
  
  return (
    <View style={[styles.alertCard, { backgroundColor: bgColor }]}>
      <View style={styles.alertHeader}>
        <Text style={[styles.alertSeverity, { color: severityColor }]}>{severity}</Text>
        <Text style={styles.alertTime}>{time}</Text>
      </View>
      <Text style={styles.alertLocation}>{location}</Text>
      <Text style={styles.alertMetric}>{metric}</Text>
    </View>
  );
}

function ImpactStat({ label, value }) {
  return (
    <View style={styles.impactStat}>
      <Text style={styles.impactValue}>{value}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

function LeaderboardItem({ rank, name, score, highlight }) {
  return (
    <View style={[styles.leaderboardItem, highlight && styles.leaderboardHighlight]}>
      <Text style={styles.leaderboardRank}>#{rank}</Text>
      <Text style={styles.leaderboardName}>{name}</Text>
      <Text style={styles.leaderboardScore}>{score}</Text>
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
  scoreSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#000',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 8,
  },
  scoreMeter: {
    width: '100%',
    height: 6,
    backgroundColor: '#ddd',
    marginTop: 20,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  scoreRank: {
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
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
  challengeCard: {
    backgroundColor: '#111',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  challengeCardActive: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  challengeTitle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 6,
  },
  challengeDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  challengeProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeProgressText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  challengeReward: {
    fontSize: 11,
    color: '#4f8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    width: (width - 72) / 2,
    backgroundColor: '#111',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconText: {
    fontSize: 32,
    color: '#fff',
  },
  badgeLabel: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  badgeLabelLocked: {
    color: '#666',
  },
  card: {
    backgroundColor: '#111',
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  positive: {
    color: '#4f8',
  },
  graphPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginTop: 16,
    gap: 8,
  },
  bar: {
    flex: 1,
    backgroundColor: '#fff',
  },
  alertCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertSeverity: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  alertTime: {
    fontSize: 10,
    color: '#666',
  },
  alertLocation: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  alertMetric: {
    fontSize: 12,
    color: '#888',
  },
  actionCard: {
    backgroundColor: '#111',
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  actionTitle: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  actionInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  actionBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
  impactCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactStat: {
    width: (width - 72) / 2,
    backgroundColor: '#111',
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 1,
    fontWeight: '700',
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: '#111',
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  leaderboardHighlight: {
    backgroundColor: '#fff',
  },
  leaderboardRank: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    width: 40,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  leaderboardScore: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '800',
  },
});

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import RiverMonitorScreen from './screens/RiverMonitorScreen';
import AlertsScreen from './screens/AlertsScreen';
import SegmentationScreen from './screens/SegmentationScreen';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

function MenuButton({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const navigateTo = (screen) => {
    closeMenu();
    setTimeout(() => navigation.navigate(screen), 300);
  };

  return (
    <>
      <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity 
            style={styles.menuBackdrop} 
            activeOpacity={1}
            onPress={closeMenu}
          />
          <Animated.View 
            style={[
              styles.menuPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>NAVIGATION</Text>
              <TouchableOpacity onPress={closeMenu}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <MenuItem icon="◆" label="Home" onPress={() => navigateTo('Home')} />
            <MenuItem icon="◈" label="Dashboard" onPress={() => navigateTo('Dashboard')} />
            <MenuItem icon="◉" label="River Monitoring" onPress={() => navigateTo('Rivers')} />
            <MenuItem icon="◐" label="Alerts" onPress={() => navigateTo('Alerts')} />
            <MenuItem icon="◇" label="Segmentation" onPress={() => navigateTo('Segmentation')} />
            <MenuItem icon="◇" label="Carbon Tracker" onPress={() => navigateTo('Home')} />
            <MenuItem icon="◆" label="Cleanup Activity" onPress={() => navigateTo('Alerts')} />
            <MenuItem icon="◈" label="Settings" onPress={() => {}} />
            <MenuItem icon="◉" label="Help" onPress={() => {}} />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function CustomHeader({ navigation, title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
        VASUNDHARA
      </Text>
      <MenuButton navigation={navigation} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Rivers" component={RiverMonitorScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="Segmentation" component={SegmentationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: width < 350 ? 24 : width < 400 ? 28 : 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    flex: 1,
    maxWidth: width - 100,
  },
  menuButton: {
    flexDirection: 'column',
    gap: 4,
    padding: 8,
  },
  menuDot: {
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  menuBackdrop: {
    flex: 1,
  },
  menuPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#000',
    borderLeftWidth: 1,
    borderLeftColor: '#333',
    paddingTop: 50,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  menuIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});

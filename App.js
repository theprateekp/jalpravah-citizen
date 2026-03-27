import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider, useApp } from './src/context/AppContext';

import SplashScreen from './src/screens/auth/SplashScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

import HomeScreen from './src/screens/main/HomeScreen';
import MapScreen from './src/screens/main/MapScreen';
import SOSScreen from './src/screens/main/SOSScreen';
import ReportScreen from './src/screens/main/ReportScreen';
import AlertsScreen from './src/screens/main/AlertsScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import TriageCardScreen from './src/screens/main/TriageCardScreen';
import VoiceAgentScreen from './src/screens/main/VoiceAgentScreen';
import FloodIntelScreen from './src/screens/main/FloodIntelScreen';
import MicroHotspotScreen from './src/screens/main/MicroHotspotScreen';
import RainfallForecastScreen from './src/screens/main/RainfallForecastScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = { Home: '🏠', Map: '🗺️', SOS: '🆘', Report: '📋', Alerts: '🔔' };

function MainTabs() {
  const { unreadCount } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 64, paddingBottom: 8,
        },
        tabBarActiveTintColor: '#00C9A7',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused }) => (
          <View style={{
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: focused ? 'rgba(0,201,167,0.15)' : 'transparent',
            borderRadius: 10, width: 40, height: 32,
          }}>
            <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
            {route.name === 'Alerts' && unreadCount > 0 && (
              <View style={{
                position: 'absolute', top: 0, right: 0,
                backgroundColor: '#FF3B5C', borderRadius: 6,
                width: 12, height: 12, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '800' }}>{unreadCount}</Text>
              </View>
            )}
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="SOS" component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: '#FF3B5C', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#FF3B5C', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
            }}>
              <Text style={{ fontSize: 24 }}>🆘</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="TriageCard" component={TriageCardScreen} />
      <Stack.Screen name="VoiceAgent" component={VoiceAgentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="FloodIntel" component={FloodIntelScreen} />
      <Stack.Screen name="MicroHotspot" component={MicroHotspotScreen} />
      <Stack.Screen name="RainfallForecast" component={RainfallForecastScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

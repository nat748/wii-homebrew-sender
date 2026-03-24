import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { AppDetailScreen } from './src/screens/AppDetailScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { OSCApp } from './src/types/osc';

type RootStackParamList = {
  Main: undefined;
  AppDetail: { app: OSCApp };
};

type TabParamList = {
  Browse: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    Browse: '[ ]',
    Settings: '[=]',
  };
  return <Text style={{ color, fontSize: 18, fontWeight: '700' }}>{icons[name] || '?'}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 56,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
      })}
    >
      <Tab.Screen
        name="Browse"
        component={HomeScreen}
        options={{ title: 'Wii Homebrew' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppDetail"
          component={AppDetailScreen}
          options={({ route }) => ({
            title: (route.params as any)?.app?.name || 'App Details',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

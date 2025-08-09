import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons'; //  ✅ Clean import
import SearchScreen from './screens/SearchScreen';
import AddItemScreen from './screens/AddItemScreen';
import EditItemScreen from './screens/EditItemScreen';
import DetailsScreen from './screens/DetailsScreen';
import CameraScreen from './screens/CameraScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = 'search-outline';
          } else if (route.name === 'Camera') {
            iconName = 'camera-outline';    // ✅ NEW ICON for Camera tab
          } else if (route.name === 'Add Item') {
            iconName = 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Add Item" component={AddItemScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* ✅ Bottom Tabs for main sections */}
        <Stack.Screen
          name="HomeTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* ✅ Extra screens outside tabs to avoid tab reset issues */}
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="EditItem" component={EditItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { Tabs } from "expo-router";
import { COLORS } from "../../src/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="contacts" options={{ title: "Contacts" }} />
      <Tabs.Screen name="clipboard" options={{ title: "Clipboard" }} />
      <Tabs.Screen name="location" options={{ title: "Location" }} />
      <Tabs.Screen name="survey" options={{ title: "Survey" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

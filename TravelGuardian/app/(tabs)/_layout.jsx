import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
        }}
      />

      <Tabs.Screen
        name="advanced"
        options={{
          title: "Advanced",
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
        }}
      />

      <Tabs.Screen
        name="gallery"
        options={{
          title: "Gallery",
        }}
      />
    </Tabs>
  );
}
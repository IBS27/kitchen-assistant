import { Text, View } from 'react-native';

export default function PlanningScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-kitchen-cream px-8">
      <Text className="text-5xl mb-4">📅</Text>
      <Text className="text-2xl font-bold text-kitchen-brown mb-2">
        Meal Planning
      </Text>
      <Text className="text-base text-kitchen-brown/50 text-center">
        Coming in Phase 4 — plan meals around your schedule.
      </Text>
    </View>
  );
}

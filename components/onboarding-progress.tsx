import { Text, View } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-6 pt-2 pb-4">
      <Text className="text-sm text-kitchen-brown/60 mb-2">
        Step {currentStep} of {totalSteps}
      </Text>
      <View className="h-2 bg-primary-100 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}

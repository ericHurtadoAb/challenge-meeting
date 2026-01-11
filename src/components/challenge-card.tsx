import { Text, View } from 'react-native';

export default function ChallengeCard({ title }: any) {
  return (
    <View style={{ padding: 12, borderWidth: 1 }}>
      <Text>{title}</Text>
    </View>
  );
}

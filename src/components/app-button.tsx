import { Text, TouchableOpacity } from 'react-native';

export default function AppButton({ title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#333',
        padding: 12,
        marginVertical: 8,
        borderRadius: 6,
      }}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
  );
}

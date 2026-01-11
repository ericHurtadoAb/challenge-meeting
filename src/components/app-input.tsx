import { TextInput } from 'react-native';

export default function AppInput(props: any) {
  return (
    <TextInput
      {...props}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 8,
        borderRadius: 6,
      }}
    />
  );
}

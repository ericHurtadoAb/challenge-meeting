import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/auth-context";
import { user } from "../models/user";
import { RootStackParamList } from "../navigation/app-navigator";
import { searchUsers } from "../services/users.service";
import { COLORS, SPACING } from "../styles/theme";

export default function SearchUsersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        if (!user) return;
        const users = await searchUsers(query, user.id);
        setResults(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {loading && <Text style={{ color: "#fff" }}>Loading...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.userItem}
            onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.s }}>
                {item.photoURL ? (
                        <Image source={{ uri: item.photoURL }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.s }} />
                        ) : (
                        <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.s }}>
                            <Text style={{ color: COLORS.textSecondary }}>Add Photo</Text>
                        </View>
                        )}
                <Text style={styles.userName}>{item.displayName}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={() =>
            !loading ? (
            <Text style={styles.emptyText}>Type something to search users</Text>
            ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0f0f0f", 
    padding: 12,
},
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    marginTop: 50,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#303030",
  },
  userName: { color: "#fff", fontWeight: "600" },
  userEmail: { color: "#888", fontSize: 12 },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.m,
    height: 500,
},
});

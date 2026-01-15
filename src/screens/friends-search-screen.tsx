import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/auth-context";
import { user } from "../models/user";
import { RootStackParamList } from "../navigation/app-navigator";
import { getFriends } from "../services/friends.service";
import { COLORS, SPACING } from "../styles/theme";

export default function SearchFriendsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [allFriends, setAllFriends] = useState<user[]>([]);
  const [results, setResults] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
      if (!user) return;
  
      const friends = await getFriends(user.id);
      setAllFriends(friends.filter((f): f is user => f !== null));
    };
  
    useEffect(() => {
      if (!user) return;
      setLoading(true);
      loadData();
      setLoading(false);
    }, [user]);
  
    useEffect(() => {
      let filtered = allFriends;
  
  
      if (query.trim()) {
        filtered = filtered.filter((s) =>
          s.displayName.toLowerCase().includes(query.toLowerCase())
        );
      }
  
      setResults(filtered);
    }, [allFriends, query]);
  
    const onRefresh = async () => {
      setRefreshing(true);
      await loadData();
      setRefreshing(false);
    };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search friends..."
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
            <Text style={styles.emptyText}>No friends</Text>
          ) : null
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
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

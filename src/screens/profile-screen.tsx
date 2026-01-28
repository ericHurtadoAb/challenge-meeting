import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/auth-context";
import { RootStackParamList } from "../navigation/app-navigator";
import { logout } from "../services/auth.service";
import { calculateCompleteSubmissions, calculateFailSubmissions, updateUserProfile } from "../services/users.service";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(0);

  if (!user) return null;

  useEffect(() => {
      calculateComplete().then(setCompleted);
      calculateFail().then(setFailed);
    }, [user]);

  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (result.canceled) return;

    setUpdatingPhoto(true);
    try {
      const uri = result.assets[0].uri;
      const updatedUser = await updateUserProfile(user.id, { photoURL: uri });

      setUser(updatedUser);
    } catch (err) {
      console.error("Error updating profile photo:", err);
    } finally {
      setUpdatingPhoto(false);
    }
  };

  const calculateComplete = () => {
    return calculateCompleteSubmissions(user.id);
  };

  const calculateFail = () => {
    return calculateFailSubmissions(user.id);
  };

  const goToFriends = () => {
    navigation.navigate("SearchFriends");
  };

  const goToUsers = () => {
    navigation.navigate("SearchUsers");
  };

  const goToRequest = () => {
    navigation.navigate("FriendsRequest");
  };

  return (
    <ScrollView
      style={styles.scroll}
        contentContainerStyle={[
          styles.content,
        ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={handleChangePhoto} style={styles.photoContainer}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={{ color: COLORS.textSecondary }}>Add Photo</Text>
          </View>
        )}
        {updatingPhoto && <Text style={styles.updatingText}>Updating...</Text>}
      </Pressable>

      <Text style={styles.name}>{user.displayName}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{failed}</Text>
          <Text style={styles.statLabel}>Failed</Text>
        </View>
      </View>

      <Pressable style={styles.friendsButton} onPress={goToFriends}>
        <Text style={styles.friendsButtonText}>My Friends</Text>
      </Pressable>
      <Pressable style={styles.friendsButton} onPress={goToUsers}>
        <Text style={styles.friendsButtonText}>Add Friends</Text>
      </Pressable>
      <Pressable style={styles.friendsButton} onPress={goToRequest}>
        <Text style={styles.friendsButtonText}>Friends Requests</Text>
      </Pressable>
      <Pressable
          style={styles.uploadButton}
          onPress={logout}
        >
          <Text style={styles.uploadText}>
            Log out
          </Text>
        </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.m,
    minHeight: "100%",
    alignItems: "center",
  },
  photoContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  updatingText: {
    marginTop: SPACING.s,
    color: COLORS.accent,
    fontSize: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.l,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: SPACING.l,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    width: 100,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  friendsButton: {
    marginTop: SPACING.l,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: RADIUS.m,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.card,
  },
  friendsButtonText: {
    fontWeight: "700",
    color: COLORS.accent,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  uploadText: {
    color: '#000',
    fontWeight: '700',
  },
});

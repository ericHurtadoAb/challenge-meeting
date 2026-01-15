import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/auth-context";
import { user } from "../models/user";
import { acceptFriendRequest, getFriendshipId, getFriendshipStatus, rejectFriendRequest, sendFriendRequest } from "../services/friends.service";
import { getUserById } from "../services/users.service";
import { COLORS, SPACING } from "../styles/theme";

interface Props {
  route: {
    params: {
      userId: string;
    };
  };
}

export default function UserProfileScreen({ route }: Props) {
  const { user: currentUser } = useAuth();
  const { userId } = route.params;
  const [otherUser, setOtherUser] = useState<user | null>(null);
  const [friendStatus, setFriendStatus] = useState<"none" | "sent" | "pending" | "friends">("none");

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      const res = await getFriendshipStatus(currentUser.id, userId);
      setFriendStatus(res);
      const userData = await getUserById(userId);
      setOtherUser(userData);
    };
    load();
  }, [currentUser]);

  const handleFriendAction = async () => {
    if (!currentUser || !otherUser) return;
    if (friendStatus === "none") {
      await sendFriendRequest(currentUser.id, otherUser.id);
      setFriendStatus("sent");
    }
  };

  const handleAcceptAction = async () => {
    if (!currentUser || !otherUser) return;
    const friendshipId = await getFriendshipId(currentUser.id, otherUser.id);
    await acceptFriendRequest(friendshipId);
    setFriendStatus("friends");
  };

  const handleDeclineAction = async () => {
    if (!currentUser || !otherUser) return;
    const friendshipId = await getFriendshipId(currentUser.id, otherUser.id);
    await rejectFriendRequest(friendshipId);
    setFriendStatus("none");
  };

  if (!otherUser) return <View style={{ flex: 1, backgroundColor: "#0f0f0f" }} />;

  return (
    <View style={styles.container}>
      {otherUser.photoURL ? (
                <Image source={{ uri: otherUser.photoURL }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                  <Text style={{ color: COLORS.textSecondary }}>Add Photo</Text>
                </View>
              )}
      <Text style={styles.name}>{otherUser.displayName}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>Streak: {otherUser.streak}</Text>
        <Text style={styles.statText}>Completed: {otherUser.totalCompleted}</Text>
        <Text style={styles.statText}>Failed: {otherUser.totalFailed}</Text>
      </View>

      {friendStatus === "pending" ? (
        <View style={{ display: "flex", flexDirection: "row", gap: 25 }}>
        <Pressable style={styles.friendButton} onPress={handleAcceptAction}>
        <Text style={styles.friendButtonText}>
            Accept Request
        </Text>
      </Pressable>
      <Pressable style={styles.friendButton} onPress={handleDeclineAction}>
        <Text style={styles.friendButtonText}>
            Decline Request
        </Text>
      </Pressable>
        </View>
    ): (
      <Pressable style={styles.friendButton} onPress={handleFriendAction}>
        <Text style={styles.friendButtonText}>
          {friendStatus === "none" && "Send Request"}
          {friendStatus === "sent" && "Sent"}
          {friendStatus === "friends" && "Friends"}
        </Text>
      </Pressable>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", alignItems: "center", padding: 20 },
  photoContainer: {
      marginTop: SPACING.xl,
      marginBottom: SPACING.m,
    },
    photo: {
      marginTop: SPACING.xl,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: COLORS.card,
    },
    photoPlaceholder: {
      justifyContent: "center",
      alignItems: "center",
    },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: 40 },
  name: { color: "#fff", fontSize: 24, fontWeight: "700", marginVertical: 16 },
  stats: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 12 },
  statText: { color: "#fff", fontSize: 16 },
  friendButton: { backgroundColor: "#1a1a1a", padding: 12, borderRadius: 8, marginTop: 20 },
  friendButtonText: { color: "#fff", fontWeight: "600" },
});

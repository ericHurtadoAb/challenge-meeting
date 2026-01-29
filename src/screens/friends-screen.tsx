import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import ChallengeCard from '../components/challenge-card';
import { useAuth } from '../context/auth-context';
import { submission } from '../models/submission';
import { getTodayChallenge } from '../services/challenge.service';
import {
  getSubmissionsByChallenge
} from '../services/submissions.service';
//import { getFriendsByUserId } from '../services/users.service';
import { useFocusEffect } from '@react-navigation/native';
import { getFriends } from '../services/friends.service';
import { COLORS, RADIUS, SPACING } from '../styles/theme';

export default function FriendsScreen() {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState<submission[]>([]);
  const [temporalSubmissions, setTemporalSubmissions] = useState<submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyFriends, setShowOnlyFriends] = useState(true);
  const [search, setSearch] = useState('');
  const [friendsIds, setFriendsIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;

    const friends = await getFriends(user.id);
    setFriendsIds(friends.filter(f => f !== null).map((f) => f.id));
    
    const todayChallenge = await getTodayChallenge();
        if (!todayChallenge) {
          setLoading(false);
          return;
        }

    const submissionsToday = await getSubmissionsByChallenge(user.id, todayChallenge.id);

    if (!submissionsToday) {
        setLoading(false);
        return;
    }

    setTemporalSubmissions(submissionsToday);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

const onViewableItemsChanged = useRef(
  ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveVideoId(viewableItems[0].item.id);
    }
  }
).current;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadData();
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let filtered = temporalSubmissions;

    if (showOnlyFriends) {
      filtered = filtered.filter((s) => friendsIds.includes(s.userId));
    }

    if (search.trim()) {
      filtered = filtered.filter((s) =>
        s.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setSubmissions(filtered);
  }, [temporalSubmissions, friendsIds, showOnlyFriends, search]);

  useFocusEffect(
    useCallback(() => {
      if (submissions.length > 0) {
        setActiveVideoId(submissions[0].id);
      }

      return () => {
        setActiveVideoId(null);
      };
    }, [submissions])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Input y Toggle en fila */}
      <View style={styles.filterRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Friends only</Text>
          <Switch
            value={showOnlyFriends}
            onValueChange={setShowOnlyFriends}
          />
        </View>
      </View>

      {/* Lista de submissions */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeCard submission={item} isActive={activeVideoId === item.id} />}
        contentContainerStyle={{ paddingBottom: SPACING.l }}
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={styles.emptyText}>No submissions found</Text>
          ) : null
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        windowSize={5}
      />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.xxl,
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    height: 40,
    marginRight: SPACING.s,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    color: COLORS.textPrimary,
    marginRight: SPACING.s,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.m,
    height: 500,
  },
});

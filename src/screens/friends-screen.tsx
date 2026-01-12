import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import ChallengeCard from '../components/challenge-card';
import { useAuth } from '../hooks/use-auth';
import { submission } from '../models/submission';
import { getTodayChallenge } from '../services/challenge.service';
import { getSubmissionsByChallenge } from '../services/submissions.service';

const MOCK = [
  { id: '1', user: 'Pedro', image: 'https://picsum.photos/400', up: 23, down: 2 },
  { id: '2', user: 'Ana', image: 'https://picsum.photos/401', up: 10, down: 1 },
];

export default function FriendsScreen() {
const { user } = useAuth();

const [submissions, setSubmissions] = useState<submission[] | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!user) return;
    const loadData = async () => {
            setLoading(true);
    
            const todayChallenge = await getTodayChallenge();
    
            if (todayChallenge) {
            const userSubmissions =
                await getSubmissionsByChallenge(
                user.uid,
                todayChallenge.id
                );

            setSubmissions(userSubmissions);
            }
    
            setLoading(false);
        };
    
        loadData();
}, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <FlatList
        style={{ marginTop: 40 }}
        data={submissions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeCard {...item} />}
      />
    </View>
  );
}

import { ResizeMode, Video } from "expo-av";
import { useState } from 'react';
import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { comment } from '../models/comment';
import { submission } from '../models/submission';
import { createComment, getCommentsBySubmission } from '../services/comments.service';
import { COLORS, RADIUS, SPACING } from '../styles/theme';

export default function ChallengeCard(submission: submission) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    else setShowComments(true);

    setLoadingComments(true);

    try {
      const commentsData = await getCommentsBySubmission(submission);
      setComments(commentsData);
      setShowComments(true);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const created = await createComment(
        submission.id,
        submission.userId,
        submission.userName,
        submission.userImage,
        newComment.trim()
      );

      setComments((prev) => [...prev, created]);
      setNewComment("");
      Keyboard.dismiss();
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.s }}>
        {submission.userImage ? (
                  <Image source={{ uri: submission.userImage }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.s }} />
                ) : (
                  <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.s }}>
                    <Text style={{ color: COLORS.textSecondary }}>Add Photo</Text>
                  </View>
                )}
        <Text style={styles.user}>{submission.userName}</Text>
      </View>

      {submission.mediaType === "image" ? (
        <Image source={{ uri: submission.mediaUrl }} style={styles.image} />
      ) : (
        <Video
          source={{ uri: submission.mediaUrl }}
          style={styles.image}
          useNativeControls
          isLooping
          shouldPlay={true}
          resizeMode={ResizeMode.COVER}
        />
      )}

      <View style={styles.votes}>
        <View style={styles.likeButton}>
          <Text>✔️​ {submission.votesUp}</Text>
        </View>
        <Pressable style={styles.commentButton} onPress={loadComments}>
          <Text>💬</Text>
        </Pressable>
        <View style={styles.dislikeButton}>
          <Text>✖️​​ {submission.votesDown}</Text>
        </View>
      </View>
      {showComments && (
        <View style={styles.commentsContainer}>
          {loadingComments ? (
            <Text style={{ color: COLORS.textSecondary }}>Loading...</Text>
          ) : comments.length === 0 ? (
            <Text style={{ color: COLORS.textSecondary }}>No comments</Text>
          ) : (
            <View>
              {comments.map((item) => (
                <View key={item.id} style={styles.comment}>
                  {item.photoUrl ? (
                  <Image source={{ uri: item.photoUrl }} style={{ width: 20, height: 20, borderRadius: 20, marginRight: SPACING.s }} />
                ) : (
                  <View style={{ width: 20, height: 20, borderRadius: 20, marginRight: SPACING.s }}>
                    <Text style={{ color: COLORS.textSecondary }}>Add Photo</Text>
                  </View>
                )}
                  <Text style={styles.commentUser}>{item.userName}:</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.commentInputBox}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.commentInput}
            />
            <Pressable onPress={handleSendComment} style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    margin: SPACING.m,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
  },
  user: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: RADIUS.m,
  },
  votes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  likeButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  dislikeButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  up: {
    color: COLORS.accent,
  },
  down: {
    color: COLORS.danger,
  },
  commentButton: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: "center",
    marginTop: SPACING.m,
  },
  commentsContainer: {
    marginTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.card,
    paddingTop: SPACING.s,
  },
  comment: {
    flexDirection: "row",
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
    flexWrap: 'wrap',
  },
  commentUser: {
    fontWeight: "600",
    marginRight: 4,
    color: COLORS.textPrimary,
  },
  commentText: {
    color: COLORS.textSecondary,
  },
  commentInputBox: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: SPACING.m,
  backgroundColor: "#1a1a1a",
  borderRadius: RADIUS.m,
  borderColor: '#303030',
  borderWidth: 1,
  paddingHorizontal: SPACING.s,
},

commentInput: {
  flex: 1,
  color: COLORS.textPrimary,
  paddingVertical: SPACING.s,
},

sendButton: {
  paddingHorizontal: SPACING.m,
  paddingVertical: SPACING.s,
},

sendText: {
  color: COLORS.accent,
  fontWeight: "600",
},

emptyText: {
  color: COLORS.textSecondary,
},
});


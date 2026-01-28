"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmissionsByChallenge = exports.getSubmissionByUserAndChallenge = exports.createSubmission = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_config_1 = require("../../firebase-config");
const createSubmission = async (submission) => {
    const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_config_1.db, 'submissions'), submission);
    return {
        id: docRef.id,
        ...submission
    };
};
exports.createSubmission = createSubmission;
const getSubmissionByUserAndChallenge = async (userId, challengeId) => {
    const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_config_1.db, 'submissions'), (0, firestore_1.where)('userId', '==', userId), (0, firestore_1.where)('challengeId', '==', challengeId));
    const snap = await (0, firestore_1.getDocs)(q);
    if (snap.empty)
        return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
};
exports.getSubmissionByUserAndChallenge = getSubmissionByUserAndChallenge;
const getSubmissionsByChallenge = async (userId, challengeId) => {
    const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_config_1.db, 'submissions'), (0, firestore_1.where)('challengeId', '==', challengeId), (0, firestore_1.orderBy)("createdAt", "desc"));
    const snap = await (0, firestore_1.getDocs)(q);
    if (snap.empty)
        return null;
    const submissions = snap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    return submissions.filter((sub) => sub.userId !== userId);
};
exports.getSubmissionsByChallenge = getSubmissionsByChallenge;
//# sourceMappingURL=submissions.service.js.map
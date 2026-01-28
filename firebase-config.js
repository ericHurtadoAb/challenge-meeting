"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = exports.auth = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyAKLTn6uHlkcl_AtmEC5TG1vFsO9ZcyjAk",
    authDomain: "challenge-meeting-68e25.firebaseapp.com",
    projectId: "challenge-meeting-68e25",
    storageBucket: "challenge-meeting-68e25.firebasestorage.app",
    messagingSenderId: "634222116462",
    appId: "1:634222116462:web:15e46d52585f66bbe9707f",
    measurementId: "G-Z23PK3XK2G"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.initializeAuth)(app, {
    persistence: (0, auth_1.getReactNativePersistence)(async_storage_1.default),
});
exports.db = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)(app);
//# sourceMappingURL=firebase-config.js.map
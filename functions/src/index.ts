import { createHash } from "crypto";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/scheduler";

export const CLOUDINARY_REMOVE_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
export const API_KEY = "182169399123492";
export const API_SECRET = "rgJOq4QzCoZHWDwl7HFV7aNS48o";

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const dailyDeactivateChallenge = onSchedule({schedule: "0 6 * * *",
    timeZone: "Europe/Madrid"}, async (event) => {

    console.log("⏰ Ejecutando job diario para desactivar retos activos");

    try {
        let batch = db.batch();

        const snapshotChallenge = await db.collection("dailyChallenges")
        .where("isActive", "==", true)
        .get();

        if (snapshotChallenge.empty) {
            console.log("No hay retos activos que desactivar");
        return;
        }

        const challenge = snapshotChallenge.docs[0].id;

        const snapshotSubmissions = await db.collection("submissions")
        .where("challengeId", "==", challenge)
        .get();

        if (snapshotSubmissions.empty) {
            console.log("No hay submissions para evaluar");
        }

        let ops = 0;

        //ACTUALIZA RESULTADOS
        console.log("Actualizando resultados de submissions...");
        for (const doc of snapshotSubmissions.docs) {
            const data = doc.data();

            const likes = data.votesUp ?? 0;
            const dislikes = data.votesDown ?? 0;

            const result = likes > dislikes ? "approved" : "failed";

            batch.update(doc.ref, {
                result,
            });

            ops++;

            if (ops === 499) {
                await batch.commit();
                batch = db.batch();
                ops = 0;
            }
        }

        if (ops > 0) {
            await batch.commit();
        }

        //ACTUALIZA RACHAS
        console.log("Actualizando rachas de usuarios...");
        const submissionsMap = new Map<string, "passed" | "failed">();
            snapshotSubmissions.docs.forEach(doc => {
            const sub = doc.data();
            submissionsMap.set(sub.userId, sub.result);
        });

        const usersSnap = await db.collection("users").get();

        ops = 0;
        batch = db.batch();

        for (const userDoc of usersSnap.docs) {
            const userId = userDoc.id;
            const user = userDoc.data();
            const submissionResult = submissionsMap.get(userId);

            let newStreak = 0;
            if (submissionResult === "passed") {
                newStreak = user.streak + 1;
            }

            batch.update(userDoc.ref, {
                streak: newStreak,
            });

            ops++;

            if (ops === 499) {
                await batch.commit();
                batch = db.batch();
                ops = 0;
            }
        }

        if (ops > 0) {
        await batch.commit();
        }

        //ELIMINA MEDIA DE SUBMISSIONS
        console.log("Eliminando media de submissions...");
        for (const docSnap of snapshotSubmissions.docs) {
        const data = docSnap.data();

        const timestamp = Math.floor(Date.now() / 1000);
        const toSign = `public_id=${data.public_id}&timestamp=${timestamp}${API_SECRET}`;
        const signature = createHash("sha1").update(toSign).digest("hex");
        const delete_url = CLOUDINARY_REMOVE_URL + data.mediaType + "/destroy";

        if (data.public_id) {
            const resu = await fetch(delete_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `public_id=${data.public_id}&timestamp=${timestamp}&api_key=${API_KEY}&signature=${signature}`,
            });
            console.log(`Media eliminada para submission ${docSnap.id}:`, await resu.json());
        }
    }

        //ACTUALIZA RETO
        console.log("Desactivando reto del día...");
        batch = db.batch();
        
        snapshotChallenge.docs.forEach((doc) => {
            batch.update(doc.ref, { isActive: false });
        });

        const todayId = new Date().toISOString().split('T')[0];

        batch.update(db.collection("dailyChallenges").doc(todayId), { isActive: true });

        await batch.commit();
        console.log(`✅ ${snapshotChallenge.docs.length} retos desactivados`);
    } catch (error) {
        console.error("Error al desactivar retos:", error);
    }
});

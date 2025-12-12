const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Webhook } = require("svix");

admin.initializeApp();
const db = admin.firestore();

// --- 1. Clerk Webhook Handler (User Created/Updated) ---
exports.handleClerkUser = functions.https.onRequest(async (req, res) => {
    // Verify the webhook signature securely
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or config");
    }

    const headers = req.headers;
    const payload = req.rawBody;

    const wh = new Webhook(WEBHOOK_SECRET);
    let msg;
    try {
        msg = wh.verify(payload, headers);
    } catch (err) {
        return res.status(400).json({ error: "Invalid Signature" });
    }

    const eventType = msg.type;
    const { id, email_addresses, first_name, last_name, public_metadata } = msg.data;
    const email = email_addresses ? email_addresses[0].email_address : "";

    // Handle User Creation
    if (eventType === "user.created") {
        const role = public_metadata.role; // 'patient' or 'hospital'

        if (role === "patient") {
            await db.collection("patients").doc(id).set({
                userId: id,
                name: `${first_name} ${last_name}`,
                email: email,
                role: "patient",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                profileCompleted: false
            });
        } else if (role === "hospital") {
            await db.collection("hospitals").doc(id).set({
                userId: id,
                email: email,
                role: "hospital",
                verified: false, // Critical: Starts unverified
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    // Handle User Update
    if (eventType === "user.updated") {
        // Sync logic if needed
    }

    return res.json({ received: true });
});


// --- 2. Admin Approve Hospital ---
// Call this function via an Admin UI or Postman to approve a hospital
// Request body: { hospitalId: "user_..." }
exports.approveHospital = functions.https.onCall(async (data, context) => {
    // Security: Check if caller is admin
    // if (context.auth.token.role !== 'admin') throw new functions.https.HttpsError('permission-denied');

    const { hospitalId } = data;

    // A. Update Firestore
    await db.collection("hospitals").doc(hospitalId).update({
        verified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // B. Update Clerk Metadata (so frontend knows immediately)
    // Note: Requires @clerk/clerk-sdk-node
    // await clerk.users.updateUser(hospitalId, { publicMetadata: { role: 'hospital', verified: true } });

    return { success: true, hospitalId };
});

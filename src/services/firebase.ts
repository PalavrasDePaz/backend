import * as admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export const authService = admin.auth(app);

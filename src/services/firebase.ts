import { auth } from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

const app = initializeApp({
  credential: applicationDefault()
});

export const authorization = auth(app);

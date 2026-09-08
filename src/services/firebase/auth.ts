import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const signInWithGoogle = async () => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const signUpWithEmail = async (name: string, email: string, pass: string) => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(result.user, { displayName: name });
  
  // Create an initial empty profile for the user
  const userRef = doc(db, 'users', result.user.uid);
  await setDoc(userRef, {
    uid: result.user.uid,
    name: name,
    email: email,
    accountType: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return result.user;
};

export const sendPasswordReset = async (email: string) => {
  if (!auth) throw new Error("Firebase is not configured.");
  await sendPasswordResetEmail(auth, email);
};

export const signOutUser = async () => {
  if (!auth) throw new Error("Firebase is not configured.");
  await signOut(auth);
};

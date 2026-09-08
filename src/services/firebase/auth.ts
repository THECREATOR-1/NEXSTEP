import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const ensureUserProfile = async (firebaseUser: User) => {
  if (!db) return;
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  await setDoc(userRef, {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? "",
    email: firebaseUser.email ?? "",
    // We only set accountType if it doesn't exist, setDoc with merge:true will respect existing fields
    accountType: null,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  
  // To handle createdAt properly without overwriting:
  const docSnap = await getDoc(userRef);
  if (docSnap.exists() && !docSnap.data().createdAt) {
    await setDoc(userRef, {
      createdAt: serverTimestamp(),
    }, { merge: true });
  }
};

export const signInWithGoogle = async () => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await ensureUserProfile(result.user);
  return result.user;
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const result = await signInWithEmailAndPassword(auth, email, pass);
  await ensureUserProfile(result.user);
  return result.user;
};

export const signUpWithEmail = async (name: string, email: string, pass: string) => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(result.user, { displayName: name });
  
  // ensureUserProfile will handle merging
  await ensureUserProfile(result.user);
  
  // But wait, ensureUserProfile will see the displayName? We just updated it.
  // Actually, result.user object might not have the updated displayName immediately in all properties.
  // We can just explicitly setDoc here to ensure name is correct.
  const userRef = doc(db, 'users', result.user.uid);
  await setDoc(userRef, {
    name: name,
  }, { merge: true });
  
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

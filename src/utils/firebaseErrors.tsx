import React from 'react';
import { Link } from 'react-router-dom';

export function getFriendlyErrorMessage(error: any): React.ReactNode {
  if (!error) return 'An unknown error occurred.';
  
  const code = error.code;
  
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Your email or password is incorrect.';
      
    case 'auth/user-not-found':
      return 'No account was found with this email.';
      
    case 'auth/email-already-in-use':
      return (
        <span>
          This email is already registered. <Link to="/auth/login" className="underline font-bold ml-1">Sign in instead</Link>
        </span>
      );
      
    case 'auth/weak-password':
      return 'Choose a stronger password.';
      
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
      
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
      
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Please allow pop-ups and try again.';
      
    case 'auth/unauthorized-domain':
      return 'This application domain is not authorized for Firebase Authentication. Add the current application domain in Firebase Authentication settings.';
      
    case 'auth/network-request-failed':
      return 'Unable to connect to Firebase. Check your internet connection and try again.';
      
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
      
    default:
      return 'Something went wrong while signing you in. Please try again.';
  }
}

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, collection, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";

import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";



export const loginPharmacist = async (email, password) => {
  try {
    // Step 1: Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Check if the user exists in 'pharmacists' collection
    const pharmacistRef = doc(db, "pharmacists", user.uid);
    const pharmacistSnap = await getDoc(pharmacistRef);

    if (!pharmacistSnap.exists()) {
      // If the pharmacist record doesn't exist, sign them out and throw error
      await signOut(auth);
      throw new Error("Access denied. You are not a registered pharmacist.");
    }

    // Step 3: Pharmacist exists; save their data locally
    const pharmacistData = pharmacistSnap.data();
    localStorage.setItem("pharmacistUser", JSON.stringify({
      uid: user.uid,
      email: user.email,
      ...pharmacistData
    }));

    console.log("Pharmacist logged in successfully:", user.email);
    return pharmacistData;
  } catch (error) {
    console.error("Error logging in pharmacist:", error);
    throw error;
  }
};

export const fetchPharmacy = async (pharmacyId) => {
  try {
    const pharmacyRef = doc(db, "pharmacies", pharmacyId);
    const pharmacySnap = await getDoc(pharmacyRef);

    if (!pharmacySnap.exists()) {
      throw new Error("Pharmacy not found.");
    }

    return pharmacySnap.data();
  } catch (error) {
    console.error("Error fetching pharmacy:", error);
    throw error;
  }
};

export const updatePharmacistInfo = async (userId, newProfileData) => {
  try {
    const pharmacistRef = doc(db, "pharmacists", userId);
    const pharmacistSnap = await getDoc(pharmacistRef);

    if (!pharmacistSnap.exists()) {
      throw new Error("Pharmacist document does not exist");
    }

    const existingData = pharmacistSnap.data();
    const updatedData = { ...existingData, ...newProfileData };

    await updateDoc(pharmacistRef, updatedData);

    return updatedData;
  } catch (error) {
    console.error("Error updating pharmacist info:", error);
    throw error;
  }
};

// New function to change pharmacist password securely
export const changePharmacistPassword = async (currentPassword, newPassword) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    const credentials = EmailAuthProvider.credential(currentUser.email, currentPassword);

    // Reauthenticate user first
    await reauthenticateWithCredential(currentUser, credentials);

    // Update password
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
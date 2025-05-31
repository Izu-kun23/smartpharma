import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, query, where, collection, addDoc,  getDocs, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
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

export const addCategory = async (name, description, imageFile) => {
  try {
    // Retrieve pharmacist data from localStorage
    const storedPharmacist = localStorage.getItem("pharmacistUser");
    if (!storedPharmacist) throw new Error("No authenticated pharmacist found.");

    const pharmacistData = JSON.parse(storedPharmacist);
    const pharmacyId = pharmacistData.pharmacyId;

    if (!pharmacyId) throw new Error("No pharmacy ID associated with this pharmacist.");

    // Generate a unique category ID using Date.now() + random string (or any preferred ID strategy)
    const categoryId = `category-${Date.now()}`;

    // Upload the image to Firebase Storage
    const imageRef = ref(storage, `categoryImages/${categoryId}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);

    // Get the image download URL
    const imageUrl = await getDownloadURL(imageRef);

    // Construct the category object
    const newCategory = {
      id: categoryId,
      name,
      description,
      imageUrl,
      pharmacyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      productCount: 0,
    };

    // Add the category to Firestore
    const categoryRef = collection(db, "categories");
    await addDoc(categoryRef, newCategory);

    console.log("Category added successfully!");
    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const fetchCategoriesByPharmacy = async (pharmacyId) => {
  try {
    if (!pharmacyId) throw new Error("Pharmacy ID is required to fetch categories.");

    const categoryRef = collection(db, "categories");
    const q = query(categoryRef, where("pharmacyId", "==", pharmacyId));
    const querySnapshot = await getDocs(q);

    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
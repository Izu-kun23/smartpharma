import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc,collection, getDocs, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth,  db, storage } from "../firebaseConfig";

export const addPharmacy = async (pharmacyData, imageFile = null) => {
  try {
    const pharmaciesCollectionRef = collection(db, "pharmacies");
    const newPharmacyDocRef = doc(pharmaciesCollectionRef);

    let imageUrl = null;
    if (imageFile) {
      const imageRef = ref(storage, `pharmacies/${newPharmacyDocRef.id}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    await setDoc(newPharmacyDocRef, {
      pharmacyId: newPharmacyDocRef.id,  // <-- here
      ...pharmacyData,
      imageUrl,
      createdAt: new Date(),
    });

    return newPharmacyDocRef.id;
  } catch (error) {
    console.error("Error adding pharmacy: ", error);
    throw error;
  }
};

export const fetchPharmacies = async () => {
  try {
    const pharmaciesCol = collection(db, "pharmacies");
    const pharmacySnapshot = await getDocs(pharmaciesCol);
    const pharmacies = pharmacySnapshot.docs.map(doc => ({
      pharmacyId: doc.id,
      ...doc.data()
    }));
    return pharmacies; // array of { pharmacyId, name, ... }
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    throw error;
  }
};

export const addAdmin = async ({ name, email, password }) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Create Admin Document
    const userDocRef = doc(db, "admins", uid);
    const userDocData = {
      userId: uid,
      name,
      email,
      role: "admin",
      createdAt: new Date()
    };

    await setDoc(userDocRef, userDocData);

    return uid;
  } catch (error) {
    console.error("Error adding admin:", error);
    throw new Error("Failed to add admin");
  }
};

// Function to add a Pharmacist
export const addPharmacist = async ({ name, email, password, pharmacyId }) => {
  try {
    if (!pharmacyId) {
      throw new Error("Pharmacy ID is required for pharmacists");
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Fetch pharmacy details
    const pharmacyDocRef = doc(db, "pharmacies", pharmacyId);
    const pharmacyDocSnap = await getDoc(pharmacyDocRef);

    if (!pharmacyDocSnap.exists()) {
      throw new Error("Pharmacy not found");
    }

    const pharmacyData = pharmacyDocSnap.data();

    // Create Pharmacist Document
    const userDocRef = doc(db, "pharmacists", uid);
    const userDocData = {
      userId: uid,
      name,
      email,
      role: "pharmacist",
      pharmacyId,
      pharmacy: {
        pharmacyName: pharmacyData.pharmacyName || "",
        address: pharmacyData.address || "",
      },
      createdAt: new Date()
    };

    await setDoc(userDocRef, userDocData);

    return uid;
  } catch (error) {
    console.error("Error adding pharmacist:", error);
    throw new Error("Failed to add pharmacist");
  }
};

export const fetchAdmins = async () => {
  try {
    const adminsCol = collection(db, "admins");
    const adminsSnapshot = await getDocs(adminsCol);

    const admins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      role: "admin",
      ...doc.data(),
    }));

    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const fetchPharmacists = async () => {
  try {
    const pharmacistsCol = collection(db, "pharmacists");
    const pharmacistsSnapshot = await getDocs(pharmacistsCol);

    const pharmacists = pharmacistsSnapshot.docs.map((doc) => ({
      id: doc.id,
      role: "pharmacist",
      ...doc.data(),
    }));

    return pharmacists;
  } catch (error) {
    console.error("Error fetching pharmacists:", error);
    throw error;
  }
};


export const loginAdmin = async (email, password) => {
  try {
    // Sign in user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Check if user exists in "admins" collection in Firestore
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (!adminDocSnap.exists()) {
      // User signed in but is not an admin
      await auth.signOut(); // Sign out immediately
      throw new Error("User is not an admin");
    }

    // Return admin user data
    return {
      uid,
      ...adminDocSnap.data(),
    };
  } catch (error) {
    console.error("Admin login failed:", error);
    throw error;
  }
};

export const signOutAdmin = async () => {
  try {
    await signOut(auth);
    console.log("Admin signed out successfully");
  } catch (error) {
    console.error("Error signing out admin:", error);
    throw error;
  }
};
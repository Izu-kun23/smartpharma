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

export const addUser = async (userData) => {
  const { name, email, password, role, pharmacyId = null } = userData;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Determine Firestore collection based on role
    const collectionName = role === "admin" ? "admins" : "pharmacists";
    const userDocRef = doc(db, collectionName, uid);

    // Base user document data
    const userDocData = {
      userId: uid,
      name,
      email,
      role,
      createdAt: new Date(),
    };

    if (role === "pharmacist") {
      if (!pharmacyId) {
        throw new Error("Pharmacy ID is required for pharmacists");
      }

      // Fetch pharmacy details from Firestore
      const pharmacyDocRef = doc(db, "pharmacies", pharmacyId);
      const pharmacyDocSnap = await getDoc(pharmacyDocRef);

      if (!pharmacyDocSnap.exists()) {
        throw new Error("Pharmacy not found");
      }

      const pharmacyData = pharmacyDocSnap.data();

      // Assign pharmacyId and pharmacy details
      userDocData.pharmacyId = pharmacyId;
      userDocData.pharmacy = {
        pharmacyName: pharmacyData.pharmacyName || "",
        address: pharmacyData.address || "",
        // Add more pharmacy fields here if needed
      };
    }

    // Save user document to Firestore
    await setDoc(userDocRef, userDocData);

    return uid;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user");
  }
};

export const fetchUsers = async () => {
  try {
    const adminsCol = collection(db, "admins");
    const pharmacistsCol = collection(db, "pharmacists");

    // Fetch admins
    const adminsSnapshot = await getDocs(adminsCol);
    const admins = adminsSnapshot.docs.map(doc => ({
      id: doc.id,
      role: "admin",
      ...doc.data(),
    }));

    // Fetch pharmacists
    const pharmacistsSnapshot = await getDocs(pharmacistsCol);
    const pharmacists = pharmacistsSnapshot.docs.map(doc => ({
      id: doc.id,
      role: "pharmacist",
      ...doc.data(),
    }));

    // Combine both lists
    const users = [...admins, ...pharmacists];

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
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
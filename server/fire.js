// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc,collection, getDocs, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebaseConfig";


// Register a new user
export const registerUser = async (
  email,
  password,
  fullName,
  phoneNumber,
  photoFile,
  dob,
  gender,
  addressObj // now expecting an object { address, city, country, postalCode }
) => {
  try {
    // Step 1: Create User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Upload Profile Photo if provided
    let photoURL = "";
    if (photoFile) {
      if (!photoFile.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
      }
      const maxSizeMB = 5;
      if (photoFile.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Image size must be less than ${maxSizeMB}MB.`);
      }

      const storageRef = ref(storage, `userProfiles/${user.uid}/${photoFile.name}`);
      await uploadBytes(storageRef, photoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    // Step 3: Store User Info in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email,
      fullName,
      phoneNumber,
      dob,
      gender,
      // Spread address fields explicitly to keep Firestore document clear and queryable
      address: addressObj.address || "",
      city: addressObj.city || "",
      country: addressObj.country || "",
      postalCode: addressObj.postalCode || "",
      profileImage: photoURL,
      createdAt: new Date().toISOString(),
      role: "user",
    });

    console.log("✅ User registered and data stored.");
  } catch (error) {
    console.error("❌ Registration Error:", error);
    throw new Error(error.message || "Registration failed.");
  }
};

export const fetchUserProfile = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in.");

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("User profile not found.");

    return { success: true, data: docSnap.data() };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};



// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};



export const getCategoriesMap = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoriesMap = {};
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      categoriesMap[doc.id] = data.name;
    });
    return { success: true, categoriesMap };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return { success: false, error: error.message || "Failed to fetch categories." };
  }
};

export const fetchAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Category doc:", doc.id, data);  // <-- Check here
      return {
        id: doc.id,
        ...data
      };
    });
    return { success: true, categories };
  } catch (error) {
    console.error("❌ Error fetching all categories:", error);
    return { success: false, error: error.message || "Failed to fetch categories." };
  }
};

export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, products };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { success: false, error: error.message || "Failed to fetch products." };
  }
};
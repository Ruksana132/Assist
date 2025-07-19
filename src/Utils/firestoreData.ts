import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Function to save a record to Firestore
export const saveRecord = async (data: any) => {
  try {
    await addDoc(collection(db, "serviceRecords"), data);
    alert("Data saved to Firebase!");
  } catch (e) {
    alert("Error saving data: " + e);
  }
};

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface AssistRecord {
  id?: string;
  customerName: string;
  registrationNo: string;
  workshopName: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  serviceType?: string;
  serviceDescription?: string;
  estimatedCost?: string;
  actualCost?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'ASSIST';

export const assistService = {
  // Create a new ASSIST record
  async create(data: Omit<AssistRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ASSIST record:', error);
      throw error;
    }
  },

  // Get all ASSIST records
  async getAll(): Promise<AssistRecord[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as AssistRecord[];
    } catch (error) {
      console.error('Error fetching ASSIST records:', error);
      throw error;
    }
  },

  // Update an ASSIST record
  async update(id: string, data: Partial<Omit<AssistRecord, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating ASSIST record:', error);
      throw error;
    }
  },

  // Delete an ASSIST record
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting ASSIST record:', error);
      throw error;
    }
  }
};
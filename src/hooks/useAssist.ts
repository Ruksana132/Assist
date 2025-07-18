import { useState, useEffect } from 'react';
import { assistService, AssistRecord } from '../services/assistService';

export const useAssist = () => {
  const [records, setRecords] = useState<AssistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all records
  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assistService.getAll();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  // Create a new record
  const createRecord = async (data: Omit<AssistRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      await assistService.create(data);
      await loadRecords(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
      throw err;
    }
  };

  // Update a record
  const updateRecord = async (id: string, data: Partial<Omit<AssistRecord, 'id' | 'createdAt'>>) => {
    try {
      setError(null);
      await assistService.update(id, data);
      await loadRecords(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
      throw err;
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      setError(null);
      await assistService.delete(id);
      await loadRecords(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
      throw err;
    }
  };

  // Load records on mount
  useEffect(() => {
    loadRecords();
  }, []);

  return {
    records,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    refreshRecords: loadRecords
  };
};
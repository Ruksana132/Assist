import React, { useState } from 'react';
import { useAssist } from './hooks/useAssist';
import { useAssist } from './hooks/useAssist';
import { AssistRecord } from './services/assistService';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

function App() {
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useAssist();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    registrationNo: '',
    workshopName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRecord(editingId, formData);
        setEditingId(null);
      } else {
        await createRecord(formData);
        setIsAdding(false);
      }
      setFormData({ customerName: '', registrationNo: '', workshopName: '' });
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleEdit = (record: AssistRecord) => {
    setEditingId(record.id!);
    setFormData({
      customerName: record.customerName,
      registrationNo: record.registrationNo,
      workshopName: record.workshopName
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ customerName: '', registrationNo: '', workshopName: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ASSIST records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">ASSIST Management System</h1>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Record
            </button>
          </div>

          {(isAdding || editingId) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration No
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workshop Name
                  </label>
                  <input
                    type="text"
                    value={formData.workshopName}
                    onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Registration No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Workshop Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No records found. Click "Add New Record" to get started.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.customerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.registrationNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.workshopName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id!)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { useAssist } from '../hooks/useAssist';
import { useAuth } from '../hooks/useAuth';
import { AssistRecord } from '../services/assistService';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  LogOut, 
  Car, 
  Users, 
  FileText,
  Search,
  Download,
  Calendar,
  Award,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { CertificateGenerator } from './CertificateGenerator';

export const Dashboard: React.FC = () => {
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useAssist();
  const { userProfile, signOut } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCertificate, setShowCertificate] = useState<AssistRecord | null>(null);
  const [formData, setFormData] = useState({
    // Vehicle Sale Date
    vehicleSaleDate: '',
    vehicleSaleDateDocument: null as File | null,
    
    // Customer Information
    customerName: '',
    emailAddress: '',
    contactNumber: '',
    gstNumber: '',
    
    // Vehicle Information
    registrationNo: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    chassisNumber: '',
    engineNumber: '',
    
    // Service Information
    serviceType: '',
    serviceDescription: '',
    estimatedCost: '',
    actualCost: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'cancelled',
    
    // Workshop
    workshopName: userProfile?.workshopName || '',
    
    // Additional fields
    mileage: '',
    fuelType: '',
    insuranceProvider: '',
    insuranceExpiryDate: '',
    lastServiceDate: '',
    nextServiceDue: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recordData = {
        ...formData,
        workshopName: userProfile?.workshopName || formData.workshopName
      };

      if (editingId) {
        await updateRecord(editingId, recordData);
        setEditingId(null);
      } else {
        await createRecord(recordData);
        setIsAdding(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleSaleDate: '',
      vehicleSaleDateDocument: null,
      customerName: '',
      emailAddress: '',
      contactNumber: '',
      gstNumber: '',
      registrationNo: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      chassisNumber: '',
      engineNumber: '',
      serviceType: '',
      serviceDescription: '',
      estimatedCost: '',
      actualCost: '',
      status: 'pending',
      workshopName: userProfile?.workshopName || '',
      mileage: '',
      fuelType: '',
      insuranceProvider: '',
      insuranceExpiryDate: '',
      lastServiceDate: '',
      nextServiceDue: ''
    });
  };

  const handleEdit = (record: AssistRecord) => {
    setEditingId(record.id!);
    setFormData({
      vehicleSaleDate: (record as any).vehicleSaleDate || '',
      vehicleSaleDateDocument: null,
      customerName: record.customerName,
      emailAddress: (record as any).emailAddress || '',
      contactNumber: (record as any).contactNumber || '',
      gstNumber: (record as any).gstNumber || '',
      registrationNo: record.registrationNo,
      vehicleMake: (record as any).vehicleMake || '',
      vehicleModel: (record as any).vehicleModel || '',
      vehicleYear: (record as any).vehicleYear || '',
      chassisNumber: (record as any).chassisNumber || '',
      engineNumber: (record as any).engineNumber || '',
      serviceType: (record as any).serviceType || '',
      serviceDescription: (record as any).serviceDescription || '',
      estimatedCost: (record as any).estimatedCost || '',
      actualCost: (record as any).actualCost || '',
      status: (record as any).status || 'pending',
      workshopName: record.workshopName,
      mileage: (record as any).mileage || '',
      fuelType: (record as any).fuelType || '',
      insuranceProvider: (record as any).insuranceProvider || '',
      insuranceExpiryDate: (record as any).insuranceExpiryDate || '',
      lastServiceDate: (record as any).lastServiceDate || '',
      nextServiceDue: (record as any).nextServiceDue || ''
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ASSIST Records');
    XLSX.writeFile(workbook, `assist-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = () => {
    const csvContent = [
      Object.keys(records[0] || {}).join(','),
      ...records.map(record => Object.values(record).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assist-records-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const filteredRecords = records.filter(record =>
    record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.workshopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
    <div className="min-h-screen bg-gray-100">
      {/* Header - Matching the blue design from screenshot */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <Car className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ASSIST Management System</h1>
                <p className="text-blue-100 text-sm">Age-based Service Support & Eligibility Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-blue-100">
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-sm">{records.length} Records</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Workshop Admin</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
            <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </button>
          </div>
        </div>

        {/* New Service Record Form */}
        {(isAdding || editingId) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">New Service Record</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Vehicle Sale Date Section */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Sale Date</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Sale Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.vehicleSaleDate}
                      onChange={(e) => setFormData({ ...formData, vehicleSaleDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Sale Date Document
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, vehicleSaleDateDocument: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information Section */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information Section */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Make
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Year
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chassis Number
                    </label>
                    <input
                      type="text"
                      value={formData.chassisNumber}
                      onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engine Number
                    </label>
                    <input
                      type="text"
                      value={formData.engineNumber}
                      onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mileage (km)
                    </label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="cng">CNG</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Information Section */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Service Type</option>
                      <option value="maintenance">Regular Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                      <option value="bodywork">Body Work</option>
                      <option value="warranty">Warranty Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Service Date
                    </label>
                    <input
                      type="date"
                      value={formData.lastServiceDate}
                      onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Service Due
                    </label>
                    <input
                      type="date"
                      value={formData.nextServiceDue}
                      onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description
                    </label>
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the service work performed..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.actualCost}
                      onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Information Section */}
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceProvider}
                      onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.insuranceExpiryDate}
                      onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Service Records</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'No records match your search.' : 'No records found. Click "Add Record" to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.customerName}</div>
                          <div className="text-sm text-gray-500">{(record as any).contactNumber}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.registrationNo}</div>
                          <div className="text-sm text-gray-500">
                            {(record as any).vehicleMake} {(record as any).vehicleModel} {(record as any).vehicleYear}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{(record as any).serviceType || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor((record as any).status || 'pending')}`}>
                          {((record as any).status || 'pending').replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {record.createdAt ? format(new Date(record.createdAt), 'MMM dd, yyyy') : 'N/A'}
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
                            onClick={() => setShowCertificate(record)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Generate Certificate"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          {(record as any).status === 'completed' && (
                            <button
                              onClick={() => setShowCertificate(record)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Generate Certificate"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Certificate Generator Modal */}
      {showCertificate && (
        <CertificateGenerator
          record={showCertificate}
          onClose={() => setShowCertificate(null)}
        />
      )}
    </div>
  );
};
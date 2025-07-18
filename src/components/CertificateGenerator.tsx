import React, { useRef } from 'react';
import { X, Download, Award } from 'lucide-react';
import { AssistRecord } from '../services/assistService';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateGeneratorProps {
  record: AssistRecord;
  onClose: () => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ record, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`service-certificate-${record.registrationNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="w-6 h-6 mr-2 text-blue-600" />
            Service Certificate
          </h2>
          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="p-6">
          <div
            ref={certificateRef}
            className="bg-white p-12 border-4 border-blue-600 rounded-lg"
            style={{ minHeight: '600px' }}
          >
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">SERVICE CERTIFICATE</h1>
              <div className="w-32 h-1 bg-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">This certifies that the following service has been completed</p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="text-lg font-semibold text-gray-900">{record.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900">{(record as any).customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{(record as any).customerEmail || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="text-lg font-semibold text-gray-900">{record.registrationNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Make & Model</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(record as any).vehicleMake} {(record as any).vehicleModel} {(record as any).vehicleYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Service Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="text-lg font-semibold text-gray-900">{(record as any).serviceType || 'General Service'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {record.createdAt ? format(new Date(record.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(record as any).actualCost || (record as any).estimatedCost || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-green-600">COMPLETED</p>
                  </div>
                </div>
                {(record as any).serviceDescription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Service Description</p>
                    <p className="text-gray-900 bg-white p-3 rounded border">
                      {(record as any).serviceDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Workshop Information */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">Workshop Information</h3>
                <div>
                  <p className="text-sm text-blue-600">Authorized Service Center</p>
                  <p className="text-2xl font-bold text-blue-800">{record.workshopName}</p>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="mt-8 pt-6 border-t-2 border-blue-600">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Certificate Generated On</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(new Date(), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Certificate ID: CERT-{record.id?.slice(-8).toUpperCase()}-{format(new Date(), 'yyyyMMdd')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
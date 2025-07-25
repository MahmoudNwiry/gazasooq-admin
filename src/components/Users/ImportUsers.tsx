import React, { useState, useRef } from 'react';
import { FaUpload, FaFileExcel, FaFileCsv, FaTimes, FaSpinner, FaCheck, FaDownload, FaInfoCircle } from 'react-icons/fa';

interface ImportUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const ImportUsers: React.FC<ImportUsersProps> = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importResults, setImportResults] = useState<{
    total: number;
    success: number;
    errors: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setImportResults(null);
      setImportComplete(false);
    } else {
      alert('يرجى اختيار ملف Excel أو CSV فقط');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate import results
    const mockResults = {
      total: 150,
      success: 145,
      errors: 5
    };
    
    setImportResults(mockResults);
    setIsImporting(false);
    setImportComplete(true);
    
    // Call the onImport callback with mock data
    onImport([]);
    
    // Reset after showing success
    setTimeout(() => {
      setImportComplete(false);
      setFile(null);
      setImportResults(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }, 3000);
  };

  const downloadTemplate = () => {
    // In a real app, you would download an actual template file
    const csvContent = 'الاسم الأول,الاسم الأخير,رقم الهاتف,الدور,الحالة\nأحمد,محمد,+970591234567,عميل,نشط\nفاطمة,أحمد,+970592345678,تاجر,نشط';
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'قالب_المستخدمين.csv';
    link.click();
  };

  const resetModal = () => {
    setFile(null);
    setImportResults(null);
    setImportComplete(false);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FaUpload className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                استيراد بيانات المستخدمين
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                رفع ملف Excel أو CSV
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            disabled={isImporting}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  تحميل قالب البيانات
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  لضمان استيراد البيانات بشكل صحيح، يرجى استخدام القالب المحدد أدناه
                </p>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <FaDownload className="w-4 h-4" />
                  تحميل القالب
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : file
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            
            {file ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  {file.type.includes('excel') || file.type.includes('spreadsheet') ? (
                    <FaFileExcel className="text-4xl text-green-600 dark:text-green-400" />
                  ) : (
                    <FaFileCsv className="text-4xl text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  disabled={isImporting}
                >
                  إزالة الملف
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <FaUpload className="mx-auto text-4xl text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    اسحب الملف هنا أو انقر للاختيار
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    الملفات المدعومة: Excel (.xlsx, .xls) أو CSV (.csv)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Import Progress/Results */}
          {importResults && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                نتائج الاستيراد
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {importResults.total}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    إجمالي السجلات
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {importResults.success}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    تم بنجاح
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {importResults.errors}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    أخطاء
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {file ? (
              <span>ملف جاهز للاستيراد: <span className="font-medium">{file.name}</span></span>
            ) : (
              <span>لم يتم اختيار ملف</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetModal();
                onClose();
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              disabled={isImporting}
            >
              إلغاء
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isImporting || importComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                importComplete
                  ? 'bg-green-600 text-white shadow-lg'
                  : isImporting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : file
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {importComplete ? (
                <>
                  <FaCheck />
                  <span>تم الاستيراد بنجاح</span>
                </>
              ) : isImporting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>جاري الاستيراد...</span>
                </>
              ) : (
                <>
                  <FaUpload />
                  <span>استيراد الآن</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportUsers;

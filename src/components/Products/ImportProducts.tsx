import React, { useState, useRef } from 'react';
import { 
  FaUpload, 
  FaTimes, 
  FaFileExcel, 
  FaFileCsv, 
  FaDownload, 
  FaSpinner, 
  FaCheck, 
  FaExclamationTriangle,
  FaTrash
} from 'react-icons/fa';

interface ImportProductsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  total: number;
  success: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

const ImportProducts: React.FC<ImportProductsProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('يرجى اختيار ملف Excel أو CSV صحيح');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = [
      'اسم_المنتج',
      'الوصف',
      'السعر',
      'السعر_الأصلي',
      'المخزون',
      'رقم_المنتج',
      'القسم_ID',
      'القسم_الفرعي_ID',
      'المتجر_ID',
      'العلامات',
      'مميز',
      'نشط'
    ];
    
    const sampleData = [
      'منتج تجريبي',
      'وصف المنتج التجريبي',
      '100',
      '120',
      '50',
      'SKU001',
      '12345',
      '67890',
      'shop123',
      'علامة1, علامة2',
      'true',
      'true'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_template.csv';
    link.click();
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportProgress(0);

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setImportProgress(100);

      // Simulate import result
      const mockResult: ImportResult = {
        total: 100,
        success: 85,
        errors: [
          { row: 5, field: 'السعر', message: 'السعر يجب أن يكون رقم موجب' },
          { row: 12, field: 'المخزون', message: 'المخزون يجب أن يكون رقم صحيح' },
          { row: 18, field: 'القسم_ID', message: 'معرف القسم غير موجود' },
          { row: 25, field: 'اسم_المنتج', message: 'اسم المنتج مطلوب' },
          { row: 33, field: 'المتجر_ID', message: 'معرف المتجر غير صحيح' }
        ]
      };

      setImportResult(mockResult);
      
      if (mockResult.success > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('حدث خطأ أثناء استيراد الملف');
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
    setImportProgress(0);
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
                استيراد المنتجات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                رفع ملف Excel أو CSV لاستيراد المنتجات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            disabled={isImporting}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {!importResult ? (
            <>
              {/* Template Download */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      تحميل القالب
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      احصل على قالب CSV مع الأعمدة المطلوبة
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaDownload className="w-3 h-3" />
                    تحميل القالب
                  </button>
                </div>
              </div>

              {/* File Upload Area */}
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FaUpload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        اسحب وأفلت الملف هنا
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        أو انقر لتحديد ملف Excel أو CSV
                      </p>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaFileExcel className="text-green-600" />
                          <span>.xlsx, .xls</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaFileCsv className="text-blue-600" />
                          <span>.csv</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Selected File */
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        {selectedFile.name.endsWith('.csv') ? (
                          <FaFileCsv className="text-green-600 dark:text-green-400" />
                        ) : (
                          <FaFileExcel className="text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeSelectedFile}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isImporting}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Import Progress */}
                  {isImporting && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          جاري الاستيراد...
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          {importProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Import Guidelines */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  إرشادات الاستيراد
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>تأكد من أن الملف يحتوي على العناوين المطلوبة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>الحد الأقصى لحجم الملف هو 10 ميجابايت</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>تأكد من صحة معرفات الأقسام والمتاجر</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>استخدم "true" أو "false" للحقول المنطقية</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Import Results */
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {importResult.total}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">إجمالي السجلات</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {importResult.success}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">تم بنجاح</div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {importResult.errors.length}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">أخطاء</div>
                </div>
              </div>

              {/* Errors List */}
              {importResult.errors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaExclamationTriangle className="text-red-500" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      الأخطاء المكتشفة
                    </h4>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b border-red-200 dark:border-red-800 last:border-b-0"
                      >
                        <div>
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">
                            الصف {error.row}
                          </span>
                          <span className="text-sm text-red-600 dark:text-red-400 mx-2">•</span>
                          <span className="text-sm text-red-600 dark:text-red-400">
                            {error.field}
                          </span>
                        </div>
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {error.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {importResult.success > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      تم استيراد {importResult.success} منتج بنجاح!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedFile && (
              <span>ملف محدد: {selectedFile.name}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {importResult ? (
              <>
                <button
                  onClick={resetImport}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  استيراد ملف آخر
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  إنهاء
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                  disabled={isImporting}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedFile && !isImporting
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isImporting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>جاري الاستيراد...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>بدء الاستيراد</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;

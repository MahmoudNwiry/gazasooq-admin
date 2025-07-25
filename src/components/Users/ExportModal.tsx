import { useState } from "react";
import { FaDownload, FaFileExcel, FaFilePdf, FaFileCsv, FaTimes, FaCheck } from "react-icons/fa";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  filename?: string;
}

export default function ExportModal({ isOpen, onClose, data, filename = "users" }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState("excel");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name", "phone", "role", "status", "joinDate"
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { key: "name", label: "الاسم" },
    { key: "phone", label: "رقم الهاتف" },
    { key: "role", label: "الدور" },
    { key: "status", label: "الحالة" },
    { key: "joinDate", label: "تاريخ الانضمام" },
    { key: "lastLogin", label: "آخر دخول" },
    { key: "location", label: "الموقع" },
    { key: "storeCount", label: "عدد المتاجر" },
    { key: "orderCount", label: "عدد الطلبات" }
  ];

  const formats = [
    { key: "excel", label: "Excel (.xlsx)", icon: <FaFileExcel className="text-green-500" /> },
    { key: "csv", label: "CSV (.csv)", icon: <FaFileCsv className="text-blue-500" /> },
    { key: "pdf", label: "PDF (.pdf)", icon: <FaFilePdf className="text-red-500" /> }
  ];

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(key => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would implement the actual export logic
      console.log("Exporting data:", {
        format: selectedFormat,
        fields: selectedFields,
        data: data,
        filename: `${filename}_${new Date().toISOString().split('T')[0]}`
      });
      
      // Show success message
      alert(`تم تصدير البيانات بنجاح بصيغة ${selectedFormat.toUpperCase()}!`);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      alert("حدث خطأ أثناء تصدير البيانات");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaDownload className="w-5 h-5 text-brand-500" />
              تصدير البيانات
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                اختر صيغة التصدير
              </h4>
              <div className="space-y-2">
                {formats.map((format) => (
                  <label
                    key={format.key}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      selectedFormat === format.key
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.key}
                      checked={selectedFormat === format.key}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="sr-only"
                    />
                    {format.icon}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {format.label}
                    </span>
                    {selectedFormat === format.key && (
                      <FaCheck className="w-4 h-4 text-brand-500 mr-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                اختر الحقول المراد تصديرها
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {availableFields.map((field) => (
                  <label
                    key={field.key}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {field.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">عدد السجلات:</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">الحقول المحددة:</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedFields.length}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedFields.length === 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaDownload className="w-4 h-4" />
              {isExporting ? "جارٍ التصدير..." : "تصدير"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

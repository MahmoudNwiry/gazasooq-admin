import React, { useState } from 'react';
import { FaDownload, FaFileExcel, FaFilePdf, FaFileCsv, FaTimes, FaSpinner, FaCheck } from 'react-icons/fa';

interface ExportProductsProps {
  products: any[];
  isOpen: boolean;
  onClose: () => void;
}

const ExportProducts: React.FC<ExportProductsProps> = ({ products, isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [exportFields, setExportFields] = useState({
    basicInfo: true,
    pricing: true,
    inventory: true,
    category: true,
    shop: true,
    images: false,
    tags: false,
    ratings: false,
    dates: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Prepare data based on selected fields
    const exportData = products.map(product => {
      const data: any = {};
      
      if (exportFields.basicInfo) {
        data.الاسم = product.name;
        data.الوصف = product.description;
        data['رقم_المنتج'] = product.sku;
      }
      
      if (exportFields.pricing) {
        data.السعر = product.price;
        data['السعر_الأصلي'] = product.originalPrice || '';
      }
      
      if (exportFields.inventory) {
        data.المخزون = product.stock;
        data.الحالة = product.isActive ? 'نشط' : 'غير نشط';
      }
      
      if (exportFields.category) {
        data.القسم = product.category?.name || '';
        data['القسم_الفرعي'] = product.subCategory?.name || '';
      }
      
      if (exportFields.shop) {
        data.المتجر = product.shop?.name || '';
      }
      
      if (exportFields.images) {
        data.الصور = product.images?.join(', ') || '';
      }
      
      if (exportFields.tags) {
        data.العلامات = product.tags?.join(', ') || '';
      }
      
      if (exportFields.ratings) {
        data.التقييم = product.rating || 0;
        data['عدد_التقييمات'] = product.reviewCount || 0;
        data.مميز = product.isFeatured ? 'نعم' : 'لا';
      }
      
      if (exportFields.dates) {
        data['تاريخ_الإنشاء'] = new Date(product.createdAt).toLocaleDateString('ar-EG');
        data['تاريخ_التحديث'] = new Date(product.updatedAt).toLocaleDateString('ar-EG');
      }
      
      return data;
    });

    // Generate file based on format
    if (exportFormat === 'excel') {
      generateExcelFile(exportData);
    } else if (exportFormat === 'csv') {
      generateCSVFile(exportData);
    } else if (exportFormat === 'pdf') {
      generatePDFFile(exportData);
    }

    setIsExporting(false);
    setExportComplete(true);
    
    // Reset after showing success
    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 2000);
  };

  const generateExcelFile = (data: any[]) => {
    // In a real app, you'd use a library like xlsx
    console.log('Exporting to Excel:', data);
    downloadFile('products_export.xlsx');
  };

  const generateCSVFile = (data: any[]) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_export.csv';
    link.click();
  };

  const generatePDFFile = (data: any[]) => {
    // In a real app, you'd use a library like jsPDF
    console.log('Exporting to PDF:', data);
    downloadFile('products_export.pdf');
  };

  const downloadFile = (filename: string) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FaDownload className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                تصدير بيانات المنتجات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {products.length} منتج جاهز للتصدير
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            disabled={isExporting}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              تنسيق التصدير
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportFormat('excel')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all duration-200 ${
                  exportFormat === 'excel'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <FaFileExcel className="text-xl" />
                <span className="text-sm font-medium">Excel</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">(.xlsx)</span>
              </button>
              
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all duration-200 ${
                  exportFormat === 'csv'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <FaFileCsv className="text-xl" />
                <span className="text-sm font-medium">CSV</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">(.csv)</span>
              </button>
              
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all duration-200 ${
                  exportFormat === 'pdf'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <FaFilePdf className="text-xl" />
                <span className="text-sm font-medium">PDF</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">(.pdf)</span>
              </button>
            </div>
          </div>

          {/* Export Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              البيانات المراد تصديرها
            </label>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.basicInfo}
                  onChange={(e) => setExportFields(prev => ({ ...prev, basicInfo: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    المعلومات الأساسية
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">الاسم والوصف ورقم المنتج</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.pricing}
                  onChange={(e) => setExportFields(prev => ({ ...prev, pricing: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    معلومات التسعير
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">السعر والسعر الأصلي</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.inventory}
                  onChange={(e) => setExportFields(prev => ({ ...prev, inventory: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    المخزون والحالة
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">كمية المخزون وحالة المنتج</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.category}
                  onChange={(e) => setExportFields(prev => ({ ...prev, category: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    معلومات التصنيف
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">القسم والقسم الفرعي</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.shop}
                  onChange={(e) => setExportFields(prev => ({ ...prev, shop: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    معلومات المتجر
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">اسم المتجر المالك</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.images}
                  onChange={(e) => setExportFields(prev => ({ ...prev, images: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    الصور
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">روابط صور المنتج</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.tags}
                  onChange={(e) => setExportFields(prev => ({ ...prev, tags: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    العلامات
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">علامات وتصنيفات المنتج</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.ratings}
                  onChange={(e) => setExportFields(prev => ({ ...prev, ratings: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    التقييمات والتميز
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">التقييم وعدد المراجعات والتميز</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={exportFields.dates}
                  onChange={(e) => setExportFields(prev => ({ ...prev, dates: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    التواريخ
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">تاريخ الإنشاء والتحديث</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <FaCheck className="text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                معاينة البيانات المحددة
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(exportFields).map(([key, enabled]) => {
                if (!enabled) return null;
                const labels = {
                  basicInfo: 'المعلومات الأساسية',
                  pricing: 'معلومات التسعير',
                  inventory: 'المخزون والحالة',
                  category: 'معلومات التصنيف',
                  shop: 'معلومات المتجر',
                  images: 'الصور',
                  tags: 'العلامات',
                  ratings: 'التقييمات والتميز',
                  dates: 'التواريخ'
                };
                return (
                  <div key={key} className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{labels[key as keyof typeof labels]}</span>
                  </div>
                );
              })}
              {!Object.values(exportFields).some(Boolean) && (
                <span className="text-gray-500 dark:text-gray-400 col-span-2">
                  لم يتم تحديد أي بيانات للتصدير
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{products.length}</span> منتج • تنسيق 
            <span className="font-medium text-green-600 dark:text-green-400 mx-1">
              {exportFormat.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              disabled={isExporting}
            >
              إلغاء
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || exportComplete || !Object.values(exportFields).some(Boolean)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                exportComplete
                  ? 'bg-green-600 text-white shadow-lg'
                  : isExporting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : Object.values(exportFields).some(Boolean)
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {exportComplete ? (
                <>
                  <FaCheck />
                  <span>تم التصدير بنجاح</span>
                </>
              ) : isExporting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>جاري التصدير...</span>
                </>
              ) : (
                <>
                  <FaDownload />
                  <span>تصدير الآن</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportProducts;

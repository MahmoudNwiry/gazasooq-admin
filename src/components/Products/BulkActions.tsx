import React, { useState } from 'react';
import { FaTimes, FaTrash, FaToggleOn, FaToggleOff, FaStar, FaRegStar } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Modal } from '../ui/modal';

interface BulkActionsProps {
  selectedProducts: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedProducts, 
  onClearSelection, 
  onRefresh 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const actions = [
    {
      id: 'activate',
      label: 'تفعيل المنتجات',
      icon: <FaToggleOn />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50'
    },
    {
      id: 'deactivate',
      label: 'إلغاء تفعيل المنتجات',
      icon: <FaToggleOff />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50'
    },
    {
      id: 'feature',
      label: 'إضافة للمميزة',
      icon: <FaStar />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50'
    },
    {
      id: 'unfeature',
      label: 'إزالة من المميزة',
      icon: <FaRegStar />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/30 dark:hover:bg-gray-900/50'
    },
    {
      id: 'delete',
      label: 'حذف المنتجات',
      icon: <FaTrash />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50'
    }
  ];

  const handleAction = (action: string) => {
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      setIsProcessing(true);
      
      let endpoint = '';
      let data = { productIds: selectedProducts };
      
      switch (actionType) {
        case 'activate':
          endpoint = '/admin/products/bulk-activate';
          break;
        case 'deactivate':
          endpoint = '/admin/products/bulk-deactivate';
          break;
        case 'feature':
          endpoint = '/admin/products/bulk-feature';
          break;
        case 'unfeature':
          endpoint = '/admin/products/bulk-unfeature';
          break;
        case 'delete':
          endpoint = '/admin/products/bulk-delete';
          break;
        default:
          throw new Error('Invalid action type');
      }

      await axiosInstance.post(endpoint, data);
      
      const actionLabels = {
        'activate': 'تم تفعيل المنتجات المحددة بنجاح',
        'deactivate': 'تم إلغاء تفعيل المنتجات المحددة بنجاح',
        'feature': 'تم إضافة المنتجات المحددة للمميزة بنجاح',
        'unfeature': 'تم إزالة المنتجات المحددة من المميزة بنجاح',
        'delete': 'تم حذف المنتجات المحددة بنجاح'
      };
      
      toast.success(actionLabels[actionType as keyof typeof actionLabels]);
      onClearSelection();
      onRefresh();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('حدث خطأ أثناء تنفيذ العملية');
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfirmationText = () => {
    const count = selectedProducts.length;
    switch (actionType) {
      case 'activate':
        return `هل أنت متأكد من رغبتك في تفعيل ${count} منتج؟`;
      case 'deactivate':
        return `هل أنت متأكد من رغبتك في إلغاء تفعيل ${count} منتج؟`;
      case 'feature':
        return `هل أنت متأكد من رغبتك في إضافة ${count} منتج للمنتجات المميزة؟`;
      case 'unfeature':
        return `هل أنت متأكد من رغبتك في إزالة ${count} منتج من المنتجات المميزة؟`;
      case 'delete':
        return `هل أنت متأكد من رغبتك في حذف ${count} منتج؟ هذا الإجراء لا يمكن التراجع عنه.`;
      default:
        return 'هل أنت متأكد من تنفيذ هذا الإجراء؟';
    }
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9998]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[600px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MdInventory className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                تم تحديد {selectedProducts.length} منتج
              </span>
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${action.bgColor} ${action.color}`}
                  title={action.label}
                >
                  {action.icon}
                  <span className="text-sm font-medium hidden lg:inline">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
            
            <button
              onClick={onClearSelection}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="إلغاء التحديد"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} className="max-w-md z-[9999]">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${
              actionType === 'delete' ? 'bg-red-500' : 
              actionType === 'activate' ? 'bg-green-500' : 
              actionType === 'deactivate' ? 'bg-orange-500' :
              actionType === 'feature' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}>
              {actions.find(a => a.id === actionType)?.icon && (
                <div className="text-white text-lg">
                  {actions.find(a => a.id === actionType)?.icon}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              تأكيد العملية
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getConfirmationText()}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <FaTimes className="text-sm" />
              إلغاء
            </button>
            <button
              onClick={confirmAction}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed text-white ${
                actionType === 'delete' 
                  ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-400' 
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400'
              }`}
            >
              {actions.find(a => a.id === actionType)?.icon}
              {isProcessing ? "جاري التنفيذ..." : "تأكيد"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkActions;

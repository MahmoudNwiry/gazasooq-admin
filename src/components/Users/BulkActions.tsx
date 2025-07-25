import React, { useState } from 'react';
import { FaCheck, FaTimes, FaTrash, FaUserShield, FaUserTimes } from 'react-icons/fa';

interface BulkActionsProps {
  selectedUsers: string[];
  onAction: (action: string, userIds: string[]) => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedUsers, 
  onAction, 
  onClearSelection 
}) => {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const actions = [
    {
      id: 'activate',
      label: 'تفعيل الحسابات',
      icon: FaCheck,
      color: 'bg-green-600 hover:bg-green-700',
      confirmTitle: 'تفعيل الحسابات المحددة',
      confirmMessage: `هل أنت متأكد من تفعيل ${selectedUsers.length} حساب؟`
    },
    {
      id: 'deactivate',
      label: 'إلغاء تفعيل',
      icon: FaTimes,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      confirmTitle: 'إلغاء تفعيل الحسابات',
      confirmMessage: `هل أنت متأكد من إلغاء تفعيل ${selectedUsers.length} حساب؟`
    },
    {
      id: 'suspend',
      label: 'حظر الحسابات',
      icon: FaUserTimes,
      color: 'bg-red-600 hover:bg-red-700',
      confirmTitle: 'حظر الحسابات المحددة',
      confirmMessage: `هل أنت متأكد من حظر ${selectedUsers.length} حساب؟ لن يتمكن المستخدمون من الدخول.`
    },
    {
      id: 'delete',
      label: 'حذف الحسابات',
      icon: FaTrash,
      color: 'bg-red-800 hover:bg-red-900',
      confirmTitle: 'حذف الحسابات نهائياً',
      confirmMessage: `هل أنت متأكد من حذف ${selectedUsers.length} حساب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`,
      destructive: true
    }
  ];

  const handleAction = (actionId: string) => {
    setShowConfirm(actionId);
  };

  const confirmAction = (actionId: string) => {
    onAction(actionId, selectedUsers);
    setShowConfirm(null);
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  const currentAction = actions.find(action => action.id === showConfirm);

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9998]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[500px]">
          <div className="flex items-center gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                <FaUserShield className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUsers.length} مستخدم محدد
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  اختر إجراء للتطبيق
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-md ${action.color}`}
                    title={action.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="إلغاء التحديد"
            >
              <FaTimes className="w-4 h-4" />
              <span className="hidden sm:inline">إلغاء</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && currentAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentAction.destructive 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <currentAction.icon className={`${
                    currentAction.destructive 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentAction.confirmTitle}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    تأكيد الإجراء
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {currentAction.confirmMessage}
              </p>
              
              {currentAction.destructive && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <FaUserTimes className="text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        تحذير
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        هذا الإجراء لا يمكن التراجع عنه. تأكد من صحة القرار قبل المتابعة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Users Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المستخدمون المحددون ({selectedUsers.length})
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  سيتم تطبيق الإجراء على جميع المستخدمين المحددين
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={() => confirmAction(showConfirm)}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                  currentAction.destructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                تأكيد الإجراء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;

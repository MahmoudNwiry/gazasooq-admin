import { useState } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUser,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaDownload,
  FaUpload
} from "react-icons/fa";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Avatar from "../../components/ui/Avatar";
import ConfirmModal from "../../components/ui/ConfirmModal";
import UsersStats from "../../components/Users/UsersStats";
import UsersFilters from "../../components/Users/UsersFilters";
import ExportUsers from "../../components/Users/ExportUsers";
import BulkActions from "../../components/Users/BulkActions";
import ImportUsers from "../../components/Users/ImportUsers";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  storeCount?: number;
  orderCount?: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: "أحمد",
      lastName: "محمد",
      phone: "+970 59 123 4567",
      role: "مدير نظام",
      status: "active",
      avatar: "/images/user/user-01.png",
      joinDate: "2024-01-15",
      lastLogin: "منذ دقيقتين",
      storeCount: 0,
      orderCount: 0
    },
    {
      id: 2,
      firstName: "فاطمة",
      lastName: "أحمد",
      phone: "+970 59 234 5678",
      role: "تاجر",
      status: "active",
      avatar: "/images/user/user-02.png",
      joinDate: "2024-02-10",
      lastLogin: "منذ ساعة",
      storeCount: 2,
      orderCount: 47
    },
    {
      id: 3,
      firstName: "محمد",
      lastName: "علي",
      phone: "+970 59 345 6789",
      role: "عميل",
      status: "active",
      joinDate: "2024-03-05",
      lastLogin: "منذ يوم",
      storeCount: 0,
      orderCount: 15
    },
    {
      id: 4,
      firstName: "سارة",
      lastName: "خالد",
      phone: "+970 59 456 7890",
      role: "تاجر",
      status: "suspended",
      joinDate: "2024-01-20",
      lastLogin: "منذ أسبوع",
      storeCount: 1,
      orderCount: 8
    },
    {
      id: 5,
      firstName: "خالد",
      lastName: "حسن",
      phone: "+970 59 567 8901",
      role: "عميل",
      status: "inactive",
      joinDate: "2024-02-28",
      lastLogin: "منذ شهر",
      storeCount: 0,
      orderCount: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({
    isOpen: false,
    userId: null,
    userName: ""
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "active").length;
  const inactiveUsers = users.filter(user => user.status === "inactive").length;
  const suspendedUsers = users.filter(user => user.status === "suspended").length;
  const admins = users.filter(user => user.role === "مدير نظام").length;
  const merchants = users.filter(user => user.role === "تاجر").length;
  const customers = users.filter(user => user.role === "عميل").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <FaUserCheck className="w-3 h-3 mr-1" />
            نشط
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <FaUser className="w-3 h-3 mr-1" />
            غير نشط
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <FaUserTimes className="w-3 h-3 mr-1" />
            محظور
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "مدير نظام":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <FaUserShield className="w-3 h-3 mr-1" />
            {role}
          </span>
        );
      case "تاجر":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <FaUser className="w-3 h-3 mr-1" />
            {role}
          </span>
        );
      case "عميل":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <FaUser className="w-3 h-3 mr-1" />
            {role}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {role}
          </span>
        );
    }
  };

  const handleDelete = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setDeleteModal({
        isOpen: true,
        userId: userId,
        userName: `${user.firstName} ${user.lastName}`
      });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.userId) {
      setUsers(users.filter(user => user.id !== deleteModal.userId));
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
    }
  };

  // Bulk actions handlers
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(currentUsers.map(user => user.id.toString()));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action: string, userIds: string[]) => {
    console.log(`Performing ${action} on users:`, userIds);
    // Here you would implement the actual bulk action logic
    
    // Example implementation:
    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(user => 
          userIds.includes(user.id.toString()) 
            ? { ...user, status: 'active' as const }
            : user
        ));
        break;
      case 'deactivate':
        setUsers(prev => prev.map(user => 
          userIds.includes(user.id.toString()) 
            ? { ...user, status: 'inactive' as const }
            : user
        ));
        break;
      case 'suspend':
        setUsers(prev => prev.map(user => 
          userIds.includes(user.id.toString()) 
            ? { ...user, status: 'suspended' as const }
            : user
        ));
        break;
      case 'delete':
        setUsers(prev => prev.filter(user => !userIds.includes(user.id.toString())));
        break;
    }
    
    // Clear selection after action
    setSelectedUsers([]);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const handleImportUsers = (importedUsers: any[]) => {
    // In a real app, you would process the imported users
    console.log('Imported users:', importedUsers);
    // For now, just show a success message
    alert('تم استيراد المستخدمين بنجاح!');
  };

  return (
    <>
      <PageMeta
        title="إدارة المستخدمين | غزة سوق - لوحة التحكم"
        description="إدارة المستخدمين والعملاء في نظام غزة سوق"
      />
      <PageBreadcrumb pageTitle="إدارة المستخدمين" />
      
      <div className="space-y-6">
        {/* Stats */}
        <UsersStats
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
          suspendedUsers={suspendedUsers}
          admins={admins}
          merchants={merchants}
          customers={customers}
        />

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                إدارة المستخدمين
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                إدارة جميع المستخدمين والعملاء والتجار في النظام
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/users/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <FaUserShield className="w-4 h-4" />
                لوحة المعلومات
              </Link>
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                تصدير
              </button>
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaUpload className="w-4 h-4" />
                استيراد
              </button>
              <Link
                to="/users/add"
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                إضافة مستخدم جديد
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <UsersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          resultCount={filteredUsers.length}
        />

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإحصائيات
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    آخر دخول
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id.toString())}
                        onChange={(e) => handleUserSelection(user.id.toString(), e.target.checked)}
                        className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={user.avatar} 
                          alt={`${user.firstName} ${user.lastName}`}
                          size="md"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.role === "تاجر" && (
                          <div>
                            <div>المتاجر: {user.storeCount}</div>
                            <div>الطلبات: {user.orderCount}</div>
                          </div>
                        )}
                        {user.role === "عميل" && (
                          <div>الطلبات: {user.orderCount}</div>
                        )}
                        {user.role === "مدير نظام" && (
                          <div className="text-gray-500">-</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredUsers.length)} من {filteredUsers.length} نتيجة
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-brand-500 text-white"
                          : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: "" })}
          onConfirm={confirmDelete}
          title="حذف المستخدم"
          message={`هل أنت متأكد من حذف المستخدم "${deleteModal.userName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
        />

        {/* Export Modal */}
        <ExportUsers
          users={filteredUsers}
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />

        {/* Import Modal */}
        <ImportUsers
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportUsers}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedUsers={selectedUsers}
          onAction={handleBulkAction}
          onClearSelection={clearSelection}
        />
      </div>
    </>
  );
}

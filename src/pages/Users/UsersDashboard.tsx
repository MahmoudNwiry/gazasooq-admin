import { useState } from 'react';
import { FaUsers, FaChartLine, FaFilter, FaDownload } from 'react-icons/fa';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import AdvancedStats from '../../components/Users/AdvancedStats';

// Mock data - same as Users.tsx
const mockUsers = [
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
    location: "غزة",
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
    lastLogin: "منذ 5 دقائق",
    location: "رفح",
    storeCount: 2,
    orderCount: 15
  },
  {
    id: 3,
    firstName: "محمود",
    lastName: "علي",
    phone: "+970 59 345 6789",
    role: "عميل",
    status: "inactive",
    avatar: "/images/user/user-03.png",
    joinDate: "2024-03-05",
    lastLogin: "منذ يومين",
    location: "خان يونس",
    storeCount: 0,
    orderCount: 8
  },
  {
    id: 4,
    firstName: "عائشة",
    lastName: "حسن",
    phone: "+970 59 456 7890",
    role: "تاجر",
    status: "active",
    avatar: "/images/user/user-04.png",
    joinDate: "2024-01-20",
    lastLogin: "منذ ساعة",
    location: "غزة",
    storeCount: 1,
    orderCount: 22
  },
  {
    id: 5,
    firstName: "يوسف",
    lastName: "عبدالله",
    phone: "+970 59 567 8901",
    role: "عميل",
    status: "suspended",
    avatar: "/images/user/user-05.png",
    joinDate: "2024-04-12",
    lastLogin: "منذ أسبوع",
    location: "دير البلح",
    storeCount: 0,
    orderCount: 3
  }
];

export default function UsersDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const exportData = () => {
    // Simulate data export
    console.log('Exporting dashboard data...');
    alert('تم تصدير البيانات بنجاح!');
  };

  return (
    <>
      <PageMeta
        title="لوحة معلومات المستخدمين | غزة سوق - لوحة التحكم"
        description="لوحة معلومات شاملة للمستخدمين مع الإحصائيات والتحليلات"
      />
      <PageBreadcrumb pageTitle="لوحة معلومات المستخدمين" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  لوحة معلومات المستخدمين
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  تحليلات وإحصائيات شاملة للمستخدمين في النظام
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                تصدير التقرير
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-brand-600 dark:text-brand-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              فلاتر سريعة
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="ابحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">محظور</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الدور
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="all">جميع الأدوار</option>
                <option value="مدير نظام">مدير نظام</option>
                <option value="تاجر">تاجر</option>
                <option value="عميل">عميل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Statistics */}
        <AdvancedStats users={filteredUsers} />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaUsers className="text-white" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  إدارة المستخدمين
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  عرض وتعديل المستخدمين
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-white" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  تقارير مفصلة
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  تحليلات متقدمة
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors group">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FaDownload className="text-white" />
              </div>
              <div className="text-right">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  تصدير البيانات
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  تنزيل التقارير
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              النشاط الأخير
            </h3>
            <div className="space-y-4">
              {filteredUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                    <FaUsers className="text-brand-600 dark:text-brand-400 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      آخر دخول: {user.lastLogin}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : user.status === 'inactive'
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'محظور'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أكثر التجار نشاطاً
            </h3>
            <div className="space-y-4">
              {filteredUsers
                .filter(user => user.role === 'تاجر')
                .sort((a, b) => b.orderCount - a.orderCount)
                .slice(0, 5)
                .map((user, index) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.orderCount} طلب
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.storeCount} متجر
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { FaUsers, FaUserCheck, FaUserTimes, FaUserShield } from "react-icons/fa";

interface UsersStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  admins: number;
  merchants: number;
  customers: number;
}

export default function UsersStats({
  totalUsers,
  activeUsers,
  inactiveUsers,
  suspendedUsers,
  admins,
  merchants,
  customers
}: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-green-600 dark:text-green-400">+12%</span>
          <span className="text-gray-500 dark:text-gray-400">من الشهر الماضي</span>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <FaUserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">المستخدمين النشطين</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-green-600 dark:text-green-400">+8%</span>
          <span className="text-gray-500 dark:text-gray-400">من الأسبوع الماضي</span>
        </div>
      </div>

      {/* Inactive/Suspended Users */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <FaUserTimes className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">غير نشط/محظور</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{inactiveUsers + suspendedUsers}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-red-600 dark:text-red-400">-3%</span>
          <span className="text-gray-500 dark:text-gray-400">من الشهر الماضي</span>
        </div>
      </div>

      {/* User Roles Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <FaUserShield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">توزيع الأدوار</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">مدراء النظام</span>
            <span className="font-medium text-gray-900 dark:text-white">{admins}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">التجار</span>
            <span className="font-medium text-gray-900 dark:text-white">{merchants}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">العملاء</span>
            <span className="font-medium text-gray-900 dark:text-white">{customers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { FaUsers, FaChartLine, FaShoppingCart, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

interface AdvancedStatsProps {
  users: any[];
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ users }) => {
  // Calculate advanced statistics
  const totalUsers = users.length;
  const newUsersThisMonth = users.filter(user => {
    const joinDate = new Date(user.joinDate);
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return joinDate >= thisMonth;
  }).length;

  const activeUsersToday = users.filter(user => 
    user.lastLogin === 'منذ دقيقتين' || 
    user.lastLogin === 'منذ 5 دقائق' || 
    user.lastLogin === 'منذ 10 دقائق'
  ).length;

  const totalOrders = users.reduce((total, user) => total + (user.orderCount || 0), 0);
  const averageOrdersPerUser = totalUsers > 0 ? (totalOrders / totalUsers).toFixed(1) : '0';

  // Location distribution
  const locationCounts = users.reduce((acc, user) => {
    const location = user.location || 'غير محدد';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  // User growth data (simulated)
  const userGrowthData = [
    { month: 'يناير', users: 45 },
    { month: 'فبراير', users: 78 },
    { month: 'مارس', users: 92 },
    { month: 'أبريل', users: 156 },
    { month: 'مايو', users: 203 },
    { month: 'يونيو', users: totalUsers }
  ];

  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: FaUsers,
      color: 'blue'
    },
    {
      title: 'مستخدمون جدد هذا الشهر',
      value: newUsersThisMonth.toLocaleString(),
      change: '+24%',
      changeType: 'positive' as const,
      icon: FaChartLine,
      color: 'green'
    },
    {
      title: 'نشط اليوم',
      value: activeUsersToday.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: FaClock,
      color: 'orange'
    },
    {
      title: 'متوسط الطلبات',
      value: averageOrdersPerUser,
      change: '+5%',
      changeType: 'positive' as const,
      icon: FaShoppingCart,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            orange: 'bg-orange-500',
            purple: 'bg-purple-500'
          };

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              نمو المستخدمين
            </h3>
            <FaChartLine className="text-blue-500" />
          </div>
          <div className="space-y-4">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {data.month}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(data.users / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {data.users}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              أكثر المناطق
            </h3>
            <FaMapMarkerAlt className="text-green-500" />
          </div>
          <div className="space-y-4">
            {topLocations.map(([location, count], index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${((count as number) / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {count as number}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          ملخص النشاط
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPhone className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {users.filter(user => user.phone).length}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مستخدم مع رقم هاتف
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaShoppingCart className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {totalOrders}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              إجمالي الطلبات
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUsers className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {users.filter(user => user.role === 'تاجر').length}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              تاجر نشط
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStats;

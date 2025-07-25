import { useState } from "react";
import { Link } from "react-router";
import { 
  FaArrowRight, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStore,
  FaShoppingCart,
  FaClock,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaBan,
  FaUnlock,
  FaHistory
} from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Avatar from "../../components/ui/Avatar";
import StatsCard from "../../components/ui/StatsCard";

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  location: string;
  bio: string;
  storeCount: number;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  stores?: Store[];
  recentOrders?: Order[];
  loginHistory?: LoginHistory[];
}

interface Store {
  id: number;
  name: string;
  category: string;
  status: string;
  createdDate: string;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface LoginHistory {
  id: number;
  date: string;
  ip: string;
  device: string;
  location: string;
}

export default function UserDetails() {
  // const { id } = useParams<{ id: string }>();
  
  // Mock data - in real app, this would be fetched from API
  const [user] = useState<UserDetails>({
    id: 1,
    firstName: "أحمد",
    lastName: "محمد",
    phone: "+970 59 123 4567",
    role: "تاجر",
    status: "active",
    avatar: "/images/user/user-01.png",
    joinDate: "2024-01-15",
    lastLogin: "منذ دقيقتين",
    location: "غزة، فلسطين",
    bio: "تاجر متخصص في بيع الإلكترونيات والأجهزة الذكية. أعمل في هذا المجال منذ أكثر من 5 سنوات وأسعى لتقديم أفضل المنتجات للعملاء.",
    storeCount: 2,
    orderCount: 47,
    totalSpent: 12450,
    lastOrderDate: "2024-03-20",
    stores: [
      {
        id: 1,
        name: "متجر الإلكترونيات الحديثة",
        category: "إلكترونيات",
        status: "نشط",
        createdDate: "2024-01-20"
      },
      {
        id: 2,
        name: "عالم الهواتف الذكية",
        category: "هواتف ذكية",
        status: "نشط",
        createdDate: "2024-02-15"
      }
    ],
    recentOrders: [
      {
        id: 1001,
        date: "2024-03-20",
        total: 250,
        status: "مكتمل",
        items: 3
      },
      {
        id: 1002,
        date: "2024-03-18",
        total: 180,
        status: "مكتمل",
        items: 2
      },
      {
        id: 1003,
        date: "2024-03-15",
        total: 320,
        status: "قيد التوصيل",
        items: 4
      }
    ],
    loginHistory: [
      {
        id: 1,
        date: "2024-03-21 14:30",
        ip: "192.168.1.100",
        device: "Chrome على Windows",
        location: "غزة، فلسطين"
      },
      {
        id: 2,
        date: "2024-03-20 09:15",
        ip: "192.168.1.100",
        device: "Mobile App على Android",
        location: "غزة، فلسطين"
      },
      {
        id: 3,
        date: "2024-03-19 16:45",
        ip: "192.168.1.100",
        device: "Safari على iPhone",
        location: "غزة، فلسطين"
      }
    ]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <FaUserCheck className="w-4 h-4 mr-2" />
            نشط
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <FaUser className="w-4 h-4 mr-2" />
            غير نشط
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <FaUserTimes className="w-4 h-4 mr-2" />
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <FaUserShield className="w-4 h-4 mr-2" />
            {role}
          </span>
        );
      case "تاجر":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <FaStore className="w-4 h-4 mr-2" />
            {role}
          </span>
        );
      case "عميل":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <FaUser className="w-4 h-4 mr-2" />
            {role}
          </span>
        );
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        );
      case "قيد التوصيل":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  const stats = [
    {
      title: "إجمالي المتاجر",
      value: user.storeCount.toString(),
      icon: <FaStore className="w-6 h-6" />,
      color: "bg-blue-500",
      change: "+2 هذا الشهر"
    },
    {
      title: "إجمالي الطلبات",
      value: user.orderCount.toString(),
      icon: <FaShoppingCart className="w-6 h-6" />,
      color: "bg-green-500",
      change: "+5 هذا الأسبوع"
    },
    {
      title: "إجمالي الإنفاق",
      value: `$${user.totalSpent}`,
      icon: <FaUser className="w-6 h-6" />,
      color: "bg-purple-500",
      change: "+$450 هذا الشهر"
    },
    {
      title: "آخر نشاط",
      value: user.lastLogin,
      icon: <FaClock className="w-6 h-6" />,
      color: "bg-orange-500",
      change: "نشط الآن"
    }
  ];

  return (
    <>
      <PageMeta
        title={`${user.firstName} ${user.lastName} | إدارة المستخدمين - غزة سوق`}
        description={`تفاصيل المستخدم ${user.firstName} ${user.lastName}`}
      />
      <PageBreadcrumb pageTitle={`${user.firstName} ${user.lastName}`} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Cover Section */}
          <div className="relative h-48 bg-gradient-to-r from-brand-500 to-brand-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4">
              <Link
                to="/users"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                <FaArrowRight className="w-4 h-4" />
                العودة للقائمة
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-16">
              <Avatar 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                size="xl"
                className="border-4 border-white shadow-2xl"
              />
              
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>انضم في {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      تعديل
                    </Link>
                    {user.status === "suspended" ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                        <FaUnlock className="w-4 h-4" />
                        إلغاء الحظر
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors">
                        <FaBan className="w-4 h-4" />
                        حظر
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      <FaTrash className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
              trend="up"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stores */}
          {user.role === "تاجر" && user.stores && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                المتاجر ({user.stores.length})
              </h2>
              <div className="space-y-3">
                {user.stores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{store.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{store.category}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">أنشئ في {store.createdDate}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {store.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          {user.recentOrders && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                آخر الطلبات ({user.recentOrders.length})
              </h2>
              <div className="space-y-3">
                {user.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">طلب #{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.items} عنصر - ${order.total}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{order.date}</p>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Login History */}
        {user.loginHistory && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaHistory className="w-5 h-5" />
              تاريخ تسجيل الدخول
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">التاريخ والوقت</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الجهاز</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">عنوان IP</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">الموقع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {user.loginHistory.map((login) => (
                    <tr key={login.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{login.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{login.device}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{login.ip}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{login.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

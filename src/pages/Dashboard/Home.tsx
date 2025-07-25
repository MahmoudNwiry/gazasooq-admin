import { useState, useEffect, JSX } from "react";
import PageMeta from "../../components/common/PageMeta";
import { SimpleLoader } from "../../components/common";
import { 
  FaStore, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine,
  FaMoneyBillWave,
  FaBoxOpen,
  FaUserTie,
  FaTruck,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUserShield,
  FaCrown,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaPercent,
  FaGift,
  FaStar,
  FaDownload,
  FaBell,
  FaWarehouse,
  FaShippingFast,
  FaDollarSign,
  FaChartBar,
  FaChartPie
} from "react-icons/fa";
import { MdTrendingUp, MdNotifications, MdShoppingBag } from "react-icons/md";

interface DashboardStats {
  totalShops: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeShops: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCategories: number;
  totalBrands: number;
  totalReviews: number;
  averageRating: number;
  totalSubscriptions: number;
  totalCoupons: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  topSellingProducts: number;
  newUsersToday: number;
  monthlyGrowth: {
    shops: number;
    products: number;
    users: number;
    revenue: number;
    orders: number;
    reviews: number;
  };
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  paymentMethods: {
    cash: number;
    card: number;
    digital: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'order' | 'shop' | 'user' | 'product' | 'review' | 'payment' | 'coupon' | 'subscription';
  title: string;
  description: string;
  time: string;
  icon: JSX.Element;
  color: string;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalShops: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeShops: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalReviews: 0,
    averageRating: 0,
    totalSubscriptions: 0,
    totalCoupons: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    topSellingProducts: 0,
    newUsersToday: 0,
    monthlyGrowth: {
      shops: 0,
      products: 0,
      users: 0,
      revenue: 0,
      orders: 0,
      reviews: 0,
    },
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    paymentMethods: {
      cash: 0,
      card: 0,
      digital: 0,
    }
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      title: 'طلب جديد',
      description: 'تم استلام طلب جديد بقيمة 150 شيكل',
      time: 'منذ 5 دقائق',
      icon: <FaShoppingCart />,
      color: 'text-success-600'
    },
    {
      id: '2',
      type: 'shop',
      title: 'متجر جديد',
      description: 'انضم متجر "الكترونيات غزة" للمنصة',
      time: 'منذ 15 دقيقة',
      icon: <FaStore />,
      color: 'text-brand-600'
    },
    {
      id: '3',
      type: 'user',
      title: 'مستخدم جديد',
      description: 'تم تسجيل مستخدم جديد',
      time: 'منذ 30 دقيقة',
      icon: <FaUsers />,
      color: 'text-blue-light-600'
    },
    {
      id: '4',
      type: 'product',
      title: 'منتج جديد',
      description: 'تم إضافة منتج جديد في قسم الملابس',
      time: 'منذ ساعة',
      icon: <FaBoxOpen />,
      color: 'text-orange-600'
    },
    {
      id: '5',
      type: 'review',
      title: 'تقييم جديد',
      description: 'تم إضافة تقييم 5 نجوم لمنتج "جوال سامسونج"',
      time: 'منذ ساعتين',
      icon: <FaStar />,
      color: 'text-warning-600'
    },
    {
      id: '6',
      type: 'payment',
      title: 'دفعة جديدة',
      description: 'تم استلام دفعة بقيمة 500 شيكل',
      time: 'منذ 3 ساعات',
      icon: <FaCreditCard />,
      color: 'text-success-600'
    },
    {
      id: '7',
      type: 'coupon',
      title: 'كوبون خصم',
      description: 'تم استخدام كوبون خصم 20%',
      time: 'منذ 4 ساعات',
      icon: <FaPercent />,
      color: 'text-orange-600'
    },
    {
      id: '8',
      type: 'subscription',
      title: 'اشتراك جديد',
      description: 'تم تجديد اشتراك باقة "الذهبية"',
      time: 'منذ 5 ساعات',
      icon: <FaCrown />,
      color: 'text-warning-600'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'مخزون منخفض',
      message: 'يوجد 15 منتج مخزونهم منخفض',
      time: 'منذ 10 دقائق',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'تحديث النظام',
      message: 'سيتم تحديث النظام غداً الساعة 2:00 ص',
      time: 'منذ ساعة',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'نجاح العملية',
      message: 'تم رفع النسخة الاحتياطية بنجاح',
      time: 'منذ 3 ساعات',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'خطأ في الدفع',
      message: 'فشل في معالجة 3 عمليات دفع',
      time: 'منذ 6 ساعات',
      read: false
    }
  ]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات تجريبية - يجب استبدالها بـ API حقيقي
      setStats({
        totalShops: 45,
        totalProducts: 1250,
        totalUsers: 890,
        totalOrders: 234,
        totalRevenue: 45000,
        pendingOrders: 12,
        activeShops: 42,
        deliveredOrders: 198,
        cancelledOrders: 24,
        totalCategories: 25,
        totalBrands: 85,
        totalReviews: 567,
        averageRating: 4.3,
        totalSubscriptions: 38,
        totalCoupons: 15,
        lowStockProducts: 23,
        outOfStockProducts: 8,
        todayRevenue: 2300,
        weeklyRevenue: 15400,
        monthlyRevenue: 45000,
        topSellingProducts: 35,
        newUsersToday: 12,
        monthlyGrowth: {
          shops: 12.5,
          products: 8.3,
          users: 15.7,
          revenue: 22.1,
          orders: 18.4,
          reviews: 25.6,
        },
        ordersByStatus: {
          pending: 12,
          processing: 28,
          shipped: 45,
          delivered: 198,
          cancelled: 24,
        },
        paymentMethods: {
          cash: 145,
          card: 89,
          digital: 67,
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    growth, 
    color, 
    prefix = "", 
    suffix = "" 
  }: {
    title: string;
    value: number;
    icon: JSX.Element;
    growth?: number;
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}{value.toLocaleString()}{suffix}
          </h3>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
              <span className="text-sm font-medium">{Math.abs(growth)}%</span>
              <span className="text-xs text-gray-500">هذا الشهر</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickStatsCard = ({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: JSX.Element;
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <PageMeta title="لوحة التحكم - غزة سوق" description="لوحة التحكم الرئيسية لإدارة منصة غزة سوق" />
        <div className="min-h-screen flex items-center justify-center">
          <SimpleLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="لوحة التحكم - غزة سوق" description="لوحة التحكم الرئيسية لإدارة منصة غزة سوق" />
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">مرحباً بك في غزة سوق</h1>
              <p className="text-brand-100">لوحة التحكم الشاملة لإدارة منصتك التجارية</p>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <FaChartLine className="text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي المتاجر"
            value={stats.totalShops}
            icon={<FaStore className="text-2xl" />}
            growth={stats.monthlyGrowth.shops}
            color="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
          />
          <StatCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={<FaBoxOpen className="text-2xl" />}
            growth={stats.monthlyGrowth.products}
            color="bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400"
          />
          <StatCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers}
            icon={<FaUsers className="text-2xl" />}
            growth={stats.monthlyGrowth.users}
            color="bg-blue-light-100 dark:bg-blue-light-900/30 text-blue-light-600 dark:text-blue-light-400"
          />
          <StatCard
            title="إجمالي الإيرادات"
            value={stats.totalRevenue}
            icon={<FaMoneyBillWave className="text-2xl" />}
            growth={stats.monthlyGrowth.revenue}
            color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            suffix=" ₪"
          />
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="الفئات"
            value={stats.totalCategories}
            icon={<FaChartPie className="text-2xl" />}
            color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            title="العلامات التجارية"
            value={stats.totalBrands}
            icon={<FaCrown className="text-2xl" />}
            color="bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400"
          />
          <StatCard
            title="الاشتراكات النشطة"
            value={stats.totalSubscriptions}
            icon={<FaUserShield className="text-2xl" />}
            color="bg-blue-light-100 dark:bg-blue-light-900/30 text-blue-light-600 dark:text-blue-light-400"
          />
          <StatCard
            title="كوبونات الخصم"
            value={stats.totalCoupons}
            icon={<FaGift className="text-2xl" />}
            color="bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickStatsCard
            title="طلبات معلقة"
            value={stats.pendingOrders}
            icon={<FaTruck className="text-lg" />}
            color="bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400"
          />
          <QuickStatsCard
            title="متاجر نشطة"
            value={stats.activeShops}
            icon={<FaUserTie className="text-lg" />}
            color="bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400"
          />
          <QuickStatsCard
            title="طلبات مكتملة"
            value={stats.deliveredOrders}
            icon={<FaShoppingCart className="text-lg" />}
            color="bg-blue-light-100 dark:bg-blue-light-900/30 text-blue-light-600 dark:text-blue-light-400"
          />
          <QuickStatsCard
            title="إجمالي الطلبات"
            value={stats.totalOrders}
            icon={<FaChartLine className="text-lg" />}
            color="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
          />
          <QuickStatsCard
            title="مخزون منخفض"
            value={stats.lowStockProducts}
            icon={<FaExclamationTriangle className="text-lg" />}
            color="bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400"
          />
          <QuickStatsCard
            title="تقييمات"
            value={stats.totalReviews}
            icon={<FaStar className="text-lg" />}
            color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الإيرادات اليوم</h3>
              <FaDollarSign className="text-2xl text-success-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.todayRevenue.toLocaleString()} ₪</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">من {stats.totalOrders} طلب</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الإيرادات الأسبوعية</h3>
              <FaChartBar className="text-2xl text-blue-light-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.weeklyRevenue.toLocaleString()} ₪</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">نمو بنسبة 15.2%</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">متوسط التقييم</h3>
              <FaStar className="text-2xl text-warning-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageRating}/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">من {stats.totalReviews} تقييم</p>
          </div>
        </div>

        {/* Order Status & Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaChartPie className="text-brand-600" />
                حالة الطلبات
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-warning-600" />
                    <span className="font-medium text-gray-900 dark:text-white">معلقة</span>
                  </div>
                  <span className="font-bold text-warning-600">{stats.ordersByStatus.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-light-50 dark:bg-blue-light-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaWarehouse className="text-blue-light-600" />
                    <span className="font-medium text-gray-900 dark:text-white">قيد التحضير</span>
                  </div>
                  <span className="font-bold text-blue-light-600">{stats.ordersByStatus.processing}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaShippingFast className="text-orange-600" />
                    <span className="font-medium text-gray-900 dark:text-white">مشحونة</span>
                  </div>
                  <span className="font-bold text-orange-600">{stats.ordersByStatus.shipped}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-success-600" />
                    <span className="font-medium text-gray-900 dark:text-white">مكتملة</span>
                  </div>
                  <span className="font-bold text-success-600">{stats.ordersByStatus.delivered}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-error-50 dark:bg-error-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaTimesCircle className="text-error-600" />
                    <span className="font-medium text-gray-900 dark:text-white">ملغية</span>
                  </div>
                  <span className="font-bold text-error-600">{stats.ordersByStatus.cancelled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaCreditCard className="text-success-600" />
                طرق الدفع
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success-50 dark:bg-success-900/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-success-600 text-xl" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">نقداً</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">الدفع عند الاستلام</span>
                    </div>
                  </div>
                  <span className="font-bold text-success-600 text-xl">{stats.paymentMethods.cash}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-light-50 dark:bg-blue-light-900/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-blue-light-600 text-xl" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">بطاقة ائتمان</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">فيزا وماستركارد</span>
                    </div>
                  </div>
                  <span className="font-bold text-blue-light-600 text-xl">{stats.paymentMethods.card}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MdShoppingBag className="text-orange-600 text-xl" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">محافظ رقمية</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">PayPal وأخرى</span>
                    </div>
                  </div>
                  <span className="font-bold text-orange-600 text-xl">{stats.paymentMethods.digital}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBell className="text-warning-600" />
              التنبيهات والإشعارات
              <span className="bg-brand-100 text-brand-600 px-2 py-1 rounded-full text-sm">
                {notifications.filter(n => !n.read).length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    !notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
                      : 'bg-gray-25 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'warning' ? 'bg-warning-100 text-warning-600' :
                      notification.type === 'info' ? 'bg-blue-light-100 text-blue-light-600' :
                      notification.type === 'success' ? 'bg-success-100 text-success-600' :
                      'bg-error-100 text-error-600'
                    }`}>
                      {notification.type === 'warning' && <FaExclamationTriangle />}
                      {notification.type === 'info' && <MdNotifications />}
                      {notification.type === 'success' && <FaCheckCircle />}
                      {notification.type === 'error' && <FaTimesCircle />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance & Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaChartBar className="text-brand-600" />
              تحليلات الأداء
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">مؤشرات مهمة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">مستخدمين جدد اليوم</span>
                    <span className="font-bold text-success-600">{stats.newUsersToday}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">المنتجات الأكثر مبيعاً</span>
                    <span className="font-bold text-brand-600">{stats.topSellingProducts}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">منتجات نفدت</span>
                    <span className="font-bold text-error-600">{stats.outOfStockProducts}</span>
                  </div>
                </div>
              </div>

              {/* Growth Trends */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اتجاهات النمو</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/30 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">نمو الطلبات</span>
                    <span className="font-bold text-success-600 flex items-center gap-1">
                      <MdTrendingUp />
                      {stats.monthlyGrowth.orders}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-light-50 dark:bg-blue-light-900/30 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">نمو التقييمات</span>
                    <span className="font-bold text-blue-light-600 flex items-center gap-1">
                      <MdTrendingUp />
                      {stats.monthlyGrowth.reviews}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/30 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">معدل الإلغاء</span>
                    <span className="font-bold text-warning-600">
                      {((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">معلومات سريعة</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/20 rounded-lg">
                    <div className="flex items-center gap-2 text-brand-600 mb-2">
                      <FaMapMarkerAlt />
                      <span className="font-semibold">غزة، فلسطين</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المنطقة الجغرافية الرئيسية</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success-600 mb-2">
                      <FaCalendarAlt />
                      <span className="font-semibold">متاح 24/7</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">خدمة العملاء المستمرة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaEye className="text-brand-600" />
                  النشاطات الأخيرة
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">إجراءات سريعة</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button className="w-full flex items-center gap-3 p-4 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-xl transition-colors">
                    <FaStore />
                    <span className="font-medium">إدارة المتاجر</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-success-50 hover:bg-success-100 dark:bg-success-900/30 dark:hover:bg-success-900/50 text-success-600 dark:text-success-400 rounded-xl transition-colors">
                    <FaBoxOpen />
                    <span className="font-medium">إدارة المنتجات</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-blue-light-50 hover:bg-blue-light-100 dark:bg-blue-light-900/30 dark:hover:bg-blue-light-900/50 text-blue-light-600 dark:text-blue-light-400 rounded-xl transition-colors">
                    <FaUsers />
                    <span className="font-medium">إدارة المستخدمين</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl transition-colors">
                    <FaShoppingCart />
                    <span className="font-medium">إدارة الطلبات</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-warning-50 hover:bg-warning-100 dark:bg-warning-900/30 dark:hover:bg-warning-900/50 text-warning-600 dark:text-warning-400 rounded-xl transition-colors">
                    <FaPercent />
                    <span className="font-medium">إدارة الكوبونات</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl transition-colors">
                    <FaCrown />
                    <span className="font-medium">خطط الاشتراك</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-xl transition-colors">
                    <FaDownload />
                    <span className="font-medium">تصدير التقارير</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

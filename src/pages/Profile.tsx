import { useState } from "react";
import { 
  FaUser, 
  FaEdit, 
  FaCamera, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaShieldAlt,
  FaSave,
  FaTimes,
  FaStore,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBell,
  FaKey,
  FaGlobe,
  FaPalette
} from "react-icons/fa";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Avatar from "../components/ui/Avatar";
import StatsCard from "../components/ui/StatsCard";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { useUserStore } from "../store/useStore";

export default function Profile() {
  const { userdata } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [notifications, setNotifications] = useState({
    browser: false,
    sms: true
  });
  
  const [profileData, setProfileData] = useState({
    firstName: userdata?.firstName || "أحمد",
    lastName: userdata?.lastName || "محمد",
    phone: userdata?.phone || "+970 59 123 4567",
    role: userdata?.role || "مدير النظام",
    location: "غزة، فلسطين",
    joinDate: "يناير 2024",
    bio: "مدير نظام متخصص في إدارة منصات التجارة الإلكترونية مع خبرة واسعة في تطوير الأعمال",
    website: "https://gazasouq.com",
    company: "غزة سوق"
  });

  const [stats] = useState([
    {
      title: "إجمالي المتاجر",
      value: "245",
      icon: <FaStore className="w-6 h-6" />,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "إجمالي الطلبات",
      value: "1,847",
      icon: <FaShoppingCart className="w-6 h-6" />,
      color: "bg-green-500",
      change: "+23%"
    },
    {
      title: "المستخدمين النشطين",
      value: "3,429",
      icon: <FaUsers className="w-6 h-6" />,
      color: "bg-purple-500",
      change: "+8%"
    },
    {
      title: "نمو الإيرادات",
      value: "89%",
      icon: <FaChartLine className="w-6 h-6" />,
      color: "bg-orange-500",
      change: "+15%"
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Here you would typically upload to your backend
        console.log("Uploading image:", e.target?.result);
        // For demo purposes, we'll just show a notification
        alert("تم رفع الصورة بنجاح!");
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "personal", name: "المعلومات الشخصية", icon: <FaUser className="w-4 h-4" /> },
    { id: "security", name: "الأمان", icon: <FaShieldAlt className="w-4 h-4" /> },
    { id: "preferences", name: "التفضيلات", icon: <FaCog className="w-4 h-4" /> },
    { id: "notifications", name: "الإشعارات", icon: <FaBell className="w-4 h-4" /> }
  ];

  return (
    <>
      <PageMeta
        title="الملف الشخصي | غزة سوق - لوحة التحكم"
        description="إدارة الملف الشخصي وإعدادات الحساب في لوحة تحكم غزة سوق"
      />
      <PageBreadcrumb pageTitle="الملف الشخصي" />
      
      <div className="space-y-6">
        {/* Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar 
                  src={userdata?.avatar} 
                  alt="Profile" 
                  size="xl"
                  className="border-4 border-white/20 shadow-2xl"
                />
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors cursor-pointer">
                  <FaCamera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <div className="flex items-center gap-2 mb-3">
                      <FaShieldAlt className="w-4 h-4" />
                      <span className="text-lg opacity-90">{profileData.role}</span>
                    </div>
                    <p className="text-white/80 max-w-md leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                  >
                    {isEditing ? <FaTimes className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                    {isEditing ? "إلغاء" : "تعديل"}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      المعلومات الشخصية
                    </h2>
                    {isEditing && (
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors flex items-center gap-2"
                      >
                        <FaSave className="w-4 h-4" />
                        حفظ التغييرات
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الأول
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                          {profileData.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الأخير
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                          {profileData.lastName}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الهاتف
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white flex items-center gap-2">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          {profileData.phone}
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموقع
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                          {profileData.location}
                        </div>
                      )}
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تاريخ الانضمام
                      </label>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                        {profileData.joinDate}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نبذة تعريفية
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                        {profileData.bio}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    إعدادات الأمان
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaKey className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">كلمة المرور</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">آخر تغيير منذ 30 يوماً</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
                          تغيير
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaShieldAlt className="w-5 h-5 text-green-500" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">المصادقة الثنائية</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">مفعلة</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
                          إدارة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    التفضيلات
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaGlobe className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">اللغة</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">العربية</p>
                          </div>
                        </div>
                        <select className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option>العربية</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FaPalette className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">المظهر</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">وضع النظام</p>
                          </div>
                        </div>
                        <select className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option>وضع النظام</option>
                          <option>فاتح</option>
                          <option>داكن</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    إعدادات الإشعارات
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <ToggleSwitch
                        checked={notifications.browser}
                        onChange={(checked) => setNotifications(prev => ({ ...prev, browser: checked }))}
                        label="إشعارات المتصفح"
                        description="تلقي الإشعارات في المتصفح"
                      />
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <ToggleSwitch
                        checked={notifications.sms}
                        onChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                        label="إشعارات المتصفح"
                        description="تلقي الإشعارات في المتصفح"
                      />
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <ToggleSwitch
                        checked={notifications.sms}
                        onChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                        label="إشعارات الرسائل النصية"
                        description="تلقي الإشعارات عبر الرسائل النصية"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

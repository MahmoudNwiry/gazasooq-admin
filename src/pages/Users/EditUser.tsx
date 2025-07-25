import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  FaArrowRight, 
  FaSave, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt,
  FaUserShield,
  FaCamera,
  FaKey,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Avatar from "../../components/ui/Avatar";

interface UserFormData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  location: string;
  bio: string;
  avatar?: string;
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

export default function EditUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    role: "عميل",
    status: "active",
    location: "",
    bio: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Partial<UserFormData & PasswordData>>({});

  // Load user data (mock data - in real app, fetch from API)
  useEffect(() => {
    // Simulate loading user data
    setFormData({
      firstName: "أحمد",
      lastName: "محمد",
      phone: "+970 59 123 4567",
      role: "تاجر",
      status: "active",
      location: "غزة، فلسطين",
      bio: "تاجر متخصص في بيع الإلكترونيات والأجهزة الذكية. أعمل في هذا المجال منذ أكثر من 5 سنوات وأسعى لتقديم أفضل المنتجات للعملاء.",
      avatar: "/images/user/user-01.png"
    });
  }, []);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "الاسم الأخير مطلوب";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\+970\s\d{2}\s\d{3}\s\d{4}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح (مثال: +970 59 123 4567)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Partial<PasswordData> = {};

    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (passwordData.newPassword && !passwordData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Updating user profile:", formData);
      
      // Show success message
      alert("تم تحديث بيانات المستخدم بنجاح!");
      
      // Navigate back to users list
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("حدث خطأ أثناء تحديث بيانات المستخدم");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Updating password");
      
      // Show success message
      alert("تم تحديث كلمة المرور بنجاح!");
      
      // Clear password fields
      setPasswordData({
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "المعلومات الشخصية", icon: <FaUser className="w-4 h-4" /> },
    { id: "password", name: "كلمة المرور", icon: <FaKey className="w-4 h-4" /> }
  ];

  return (
    <>
      <PageMeta
        title={`تعديل ${formData.firstName} ${formData.lastName} | إدارة المستخدمين - غزة سوق`}
        description={`تعديل بيانات المستخدم ${formData.firstName} ${formData.lastName}`}
      />
      <PageBreadcrumb pageTitle={`تعديل ${formData.firstName} ${formData.lastName}`} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                تعديل بيانات المستخدم
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                تعديل معلومات {formData.firstName} {formData.lastName}
              </p>
            </div>
            <Link
              to="/users"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaArrowRight className="w-4 h-4" />
              العودة للقائمة
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${
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
              
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    المعلومات الشخصية
                  </h2>

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar 
                        src={formData.avatar} 
                        alt={`${formData.firstName} ${formData.lastName}`}
                        size="xl"
                        className="border-4 border-gray-200 dark:border-gray-700"
                      />
                      <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-brand-600 transition-colors cursor-pointer">
                        <FaCamera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      اضغط على أيقونة الكاميرا لتغيير الصورة
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الأول *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                            errors.firstName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                          placeholder="أدخل الاسم الأول"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الأخير *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                            errors.lastName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                          placeholder="أدخل الاسم الأخير"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الهاتف *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                            errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                          placeholder="+970 59 123 4567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموقع
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          placeholder="غزة، فلسطين"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الدور *
                      </label>
                      <div className="relative">
                        <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          value={formData.role}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                        >
                          <option value="عميل">عميل</option>
                          <option value="تاجر">تاجر</option>
                          <option value="مدير نظام">مدير نظام</option>
                        </select>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الحالة *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange("status", e.target.value as 'active' | 'inactive' | 'suspended')}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                        <option value="suspended">محظور</option>
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نبذة تعريفية
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                      placeholder="اكتب نبذة تعريفية عن المستخدم..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave className="w-4 h-4" />
                      {isLoading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    تغيير كلمة المرور
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                            errors.newPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                          placeholder="أدخل كلمة المرور الجديدة"
                        />
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تأكيد كلمة المرور
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                          placeholder="أعد إدخال كلمة المرور"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave className="w-4 h-4" />
                      {isLoading ? "جارٍ الحفظ..." : "تحديث كلمة المرور"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useUserStore } from "../../store/useStore";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function SignInForm() {

  const navigation = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: '', password: '' });

  const { setUserData, isLoggedIn } = useUserStore();

  // Validation function
  const validateForm = () => {
    const newErrors = { phoneNumber: '', password: '' };
    let isValid = true;

    // Phone number validation
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب';
      isValid = false;
    } else if (!/^05\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendData = async () => {
    // Check if already logged in
    if(isLoggedIn) {
      navigation('/');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({ phoneNumber: '', password: '' });

    try {
      const response = await axiosInstance.post(
        '/auth/login', 
        {
          phoneNumber: phoneNumber,
          password: password
        }
      );

      if(response.status === 200) {
        const data = {
          id: response.data.user.userId,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          phone: response.data.user.phoneNumber,
          role: response.data.user.role,
          avatar: response.data.user.avatar,
          token: response.data.accessToken
        }
        
        setUserData(data);
        localStorage.setItem("sooq-isLoggedIn", JSON.stringify(true));
        localStorage.setItem("sooq-token", JSON.stringify(data.token));
        
        toast.success('تم تسجيل الدخول بنجاح');
        navigation('/');
      }
      
    } catch (error: any) {
      localStorage.removeItem("sooq-isLoggedIn");
      localStorage.removeItem("sooq-token");
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('رقم الهاتف أو كلمة المرور غير صحيحة');
      } else if (error.response?.status === 403) {
        toast.error('حسابك غير مخول للدخول إلى لوحة التحكم');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              تسجيل الدخول إلى لوحة التحكم
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              ادخل رقم الهاتف وكلمة المرور للدخول إلى نظام إدارة المتاجر
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={(e) => {e.preventDefault(); sendData()}}>
              <div className="space-y-6">
                <div>
                  <Label>
                    رقم الهاتف <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="05XXXXXXXX" 
                    value={phoneNumber} 
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      // Clear error when user starts typing
                      if (errors.phoneNumber) {
                        setErrors(prev => ({ ...prev, phoneNumber: '' }));
                      }
                    }}
                    className={errors.phoneNumber ? 'border-red-500 focus:border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    كلمة المرور <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="ادخل كلمة المرور"
                      value={password} 
                      onChange={(e) => {
                        setPassword(e.target.value);
                        // Clear error when user starts typing
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: '' }));
                        }
                      }}
                      className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer left-4 top-1/2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white rounded-lg p-3 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-brand-500 hover:bg-brand-600 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جارٍ تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        تسجيل الدخول
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Security note */}
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">تنبيه أمني:</span> لا تشارك بيانات دخولك مع أي شخص آخر. تأكد من تسجيل الخروج عند الانتهاء.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

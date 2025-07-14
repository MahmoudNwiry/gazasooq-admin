import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useUserStore } from "../../store/useStore";
import axiosInstance from "../../utils/axiosInstance";

export default function SignInForm() {

  const navigation = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { setUserData, isLoggedIn } = useUserStore();

  const sendData = async () => {
    if(isLoggedIn) {
      navigation('/')
    }
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
        localStorage.setItem("sooq-isLoggedIn", JSON.stringify(true))
        localStorage.setItem("sooq-token", JSON.stringify(data.token))
      }
      
    } catch (error) {
        localStorage.removeItem("sooq-isLoggedIn")
        localStorage.removeItem("sooq-token")

    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              تسجيل الدخول إلى لوحة التحكم
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ادخل رقم الهاتف وكلمة المرور للدخول
            </p>
          </div>
          <div>
            <form onSubmit={(e) => {e.preventDefault(); sendData()}}>
              <div className="space-y-6">
                <div>
                  <Label>
                    رقم الهاتف <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="05XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div>
                  <Label>
                    كلمة المرور <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="ادخل كلمة المرور"
                       value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer left-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div>
                  <input
                    type="submit"
                    value="تسجيل الدخول"
                    className="bg-brand-500 w-full text-white rounded-lg p-3 cursor-pointer transition hover:bg-brand-700"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

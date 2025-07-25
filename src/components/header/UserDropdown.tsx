import { useState } from "react";
import { FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";
import { useUserStore } from "../../store/useStore";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {userdata} = useUserStore();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
      >
        <div className="relative">
          <img 
            src={userdata?.avatar || "/images/user/default-avatar.jpg"} 
            alt="User" 
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {`${userdata?.firstName || 'أحمد'} ${userdata?.lastName || 'محمد'}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {userdata?.role || 'مدير'}
          </div>
        </div>
        <FaChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-0 mt-3 flex w-[280px] flex-col rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-sm p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900/95"
      >
        {/* Header Section */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <img 
              src={userdata?.avatar || "/images/user/default-avatar.jpg"} 
              alt="User" 
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full dark:border-gray-900"></div>
          </div>
          <div className="flex-1">
            <h6 className="font-bold text-gray-900 dark:text-white">
              {`${userdata?.firstName || 'أحمد'} ${userdata?.lastName || 'محمد'}`}
            </h6>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userdata?.phone || '+970 59 123 4567'}
            </p>
            <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-brand-100 text-brand-600 rounded-full dark:bg-brand-900 dark:text-brand-400">
              {userdata?.role || 'مدير النظام'}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            to="/profile"
            className="flex items-center gap-3 px-3 py-3 font-medium text-gray-700 rounded-xl hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span>الملف الشخصي</span>
          </DropdownItem>

          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            to="/settings"
            className="flex items-center gap-3 px-3 py-3 font-medium text-gray-700 rounded-xl hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-800">
              <FaCog className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <span>إعدادات الحساب</span>
          </DropdownItem>

          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            to="/support"
            className="flex items-center gap-3 px-3 py-3 font-medium text-gray-700 rounded-xl hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg dark:bg-green-900/30">
              <FaQuestionCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span>المساعدة والدعم</span>
          </DropdownItem>
        </div>

        {/* Logout Button */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/signin"
            className="flex items-center gap-3 px-3 py-3 font-medium text-red-600 rounded-xl hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg dark:bg-red-900/30">
              <FaSignOutAlt className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span>تسجيل الخروج</span>
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}

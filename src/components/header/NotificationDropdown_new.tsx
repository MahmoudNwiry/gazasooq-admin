import { useState } from "react";
import { FaBell, FaTimes, FaStore, FaShoppingCart, FaUser, FaCheck } from "react-icons/fa";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const notifications = [
    {
      id: 1,
      type: "order",
      title: "طلب جديد",
      message: "تم إنشاء طلب جديد من متجر الكترونيات غزة",
      time: "5 دقائق",
      icon: <FaShoppingCart className="w-4 h-4" />,
      color: "bg-brand-500",
      unread: true
    },
    {
      id: 2,
      type: "shop",
      title: "متجر جديد",
      message: "تم تسجيل متجر جديد: متجر الأزياء العصرية",
      time: "15 دقيقة",
      icon: <FaStore className="w-4 h-4" />,
      color: "bg-blue-500",
      unread: true
    },
    {
      id: 3,
      type: "user",
      title: "مستخدم جديد",
      message: "انضم أحمد محمد إلى المنصة",
      time: "30 دقيقة",
      icon: <FaUser className="w-4 h-4" />,
      color: "bg-green-500",
      unread: false
    },
    {
      id: 4,
      type: "system",
      title: "تحديث النظام",
      message: "تم تحديث النظام بنجاح إلى الإصدار 2.1.0",
      time: "ساعة واحدة",
      icon: <FaCheck className="w-4 h-4" />,
      color: "bg-purple-500",
      unread: false
    },
    {
      id: 5,
      type: "order",
      title: "تحديث حالة الطلب",
      message: "تم شحن الطلب #12345 وهو في الطريق إليك",
      time: "ساعتان",
      icon: <FaShoppingCart className="w-4 h-4" />,
      color: "bg-orange-500",
      unread: false
    }
  ];

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 hover:text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={handleClick}
      >
        {notifying && (
          <span className="absolute -top-1 -right-1 z-10 h-3 w-3 rounded-full bg-brand-500">
            <span className="absolute inline-flex w-full h-full bg-brand-500 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <FaBell className="w-5 h-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-0 mt-4 flex h-[500px] w-[380px] flex-col rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-sm p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900/95"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg">
              <FaBell className="w-4 h-4 text-white" />
            </div>
            <h5 className="text-lg font-bold text-gray-900 dark:text-white">
              الإشعارات
            </h5>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-600 rounded-full dark:bg-brand-900 dark:text-brand-400">
              {notifications.filter(n => n.unread).length} جديد
            </span>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-8 h-8 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {notifications.map((notification) => (
            <DropdownItem
              key={notification.id}
              onItemClick={closeDropdown}
              className={`group flex gap-3 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer ${
                notification.unread ? 'bg-brand-50/30 border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800' : ''
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${notification.color} flex-shrink-0`}>
                <span className="text-white">
                  {notification.icon}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h6 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {notification.title}
                  </h6>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    منذ {notification.time}
                  </span>
                  <button className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </DropdownItem>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            تمييز الكل كمقروء
          </button>
          <Link
            to="/notifications"
            className="block w-full px-4 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg"
            onClick={closeDropdown}
          >
            عرض جميع الإشعارات
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}

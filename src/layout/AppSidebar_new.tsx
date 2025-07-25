import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { 
  FaStore, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine,
  FaBoxOpen,
  FaCrown,
  FaTruck,
  FaUserShield,
  FaTags,
  FaGift
} from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <FaChartLine className="w-5 h-5" />,
    name: "لوحة التحكم",
    path: "/"
  },
  {
    icon: <FaShoppingCart className="w-5 h-5" />,
    name: "الطلبات",
    path: "/orders",
  },
  {
    icon: <FaUsers className="w-5 h-5" />,
    name: "المستخدمين",
    path: "/users",
  },
  {
    icon: <FaStore className="w-5 h-5" />,
    name: "المتاجر",
    path: "/shops",
  },
  {
    icon: <FaBoxOpen className="w-5 h-5" />,
    name: "المنتجات",
    path: "/products",
  },
  {
    icon: <FaTruck className="w-5 h-5" />,
    name: "الديليفري",
    path: "/delivery",
  },
  {
    icon: <FaUserShield className="w-5 h-5" />,
    name: "الرتب",
    path: "/roles",
  },
  {
    icon: <FaCrown className="w-5 h-5" />,
    name: "خطط الاشتراكات",
    path: "/subscription-plans",
  }
];

const othersItems: NavItem[] = [
  {
    icon: <FaTags className="w-5 h-5" />,
    name: 'الأقسام',
    subItems: [
      { name: "اقسام المتاجر", path: "/shop-category", pro: false },
      { name: "أقسام المنتجات", path: "/products-category", pro: false },
    ]
  },
  {
    icon: <FaGift className="w-5 h-5" />,
    name: 'العروض والكوبونات',
    subItems: [
      { name: "الكوبونات", path: "/coupons", pro: false },
      { name: "العروض الخاصة", path: "/offers", pro: false },
    ]
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <div className="space-y-2">
      {items.map((nav, index) => (
        <div key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "text-gray-700 dark:text-gray-300"
              } cursor-pointer ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "bg-brand-100 dark:bg-brand-800/50 text-brand-600 dark:text-brand-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {nav.icon}
              </div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="font-medium flex-1 text-left">{nav.name}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  isActive(nav.path) 
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" 
                    : "text-gray-700 dark:text-gray-300"
                } ${
                  !isExpanded && !isHovered && !isMobileOpen
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    isActive(nav.path)
                      ? "bg-brand-100 dark:bg-brand-800/50 text-brand-600 dark:text-brand-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {nav.icon}
                </div>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="font-medium">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <div className="mt-2 ml-12 space-y-1">
                {nav.subItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.path}
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive(subItem.path)
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{subItem.name}</span>
                      <div className="flex items-center gap-1">
                        {subItem.new && (
                          <span className="px-2 py-0.5 text-xs bg-success-100 text-success-600 rounded-full">
                            جديد
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full">
                            محترف
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 right-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 shadow-lg
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Logo */}
      <div
        className={`py-6 px-2 flex border-b border-gray-200 dark:border-gray-700 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl">
                <FaStore className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">غزة سوق</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">لوحة التحكم</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl">
              <FaStore className="text-white text-xl" />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-4 py-6">
        <nav className="space-y-8">
          {/* Main Menu */}
          <div>
            <h2
              className={`mb-4 text-xs uppercase font-semibold tracking-wider flex leading-[20px] text-gray-500 dark:text-gray-400 ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "justify-start px-2"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "القائمة الرئيسية"
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>
            {renderMenuItems(navItems, "main")}
          </div>

          {/* Other Menu */}
          <div>
            <h2
              className={`mb-4 text-xs uppercase font-semibold tracking-wider flex leading-[20px] text-gray-500 dark:text-gray-400 ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "justify-start px-2"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "الإعدادات والإضافات"
              ) : (
                <HorizontaLDots />
              )}
            </h2>
            {renderMenuItems(othersItems, "others")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

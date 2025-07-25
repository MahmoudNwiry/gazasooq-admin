import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { FaSearch, FaBars, FaTimes, FaStore } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white/95 backdrop-blur-sm border-gray-200 z-999 dark:border-gray-800 dark:bg-gray-900/95 lg:border-b shadow-sm">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 z-99999 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 lg:h-11 lg:w-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-4 h-4" />
            )}
          </button>

          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">غزة سوق</span>
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-xl hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden transition-colors duration-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="ابحث أو اكتب أمر..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-12 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-brand-600 xl:w-[430px] transition-all duration-200"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 bg-white/50 backdrop-blur-sm border-t border-gray-100 lg:flex lg:bg-transparent lg:border-t-0 lg:justify-end lg:px-0 lg:backdrop-blur-none dark:bg-gray-900/50 dark:border-gray-700 lg:dark:bg-transparent`}
        >
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

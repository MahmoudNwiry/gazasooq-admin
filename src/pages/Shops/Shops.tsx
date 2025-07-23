import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import toast from "react-hot-toast";
import Loading from "../../components/common/Loading";
import { FaEdit, FaEye } from "react-icons/fa";

export default function Shops() {

  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalShops, setTotalShops] = useState<number>(0);
  const itemsPerPage = 10;

  const fetchShops = (page: number = 1) => {
    setLoading(true);
    axiosInstance(`/admin/shop?page=${page}&limit=${itemsPerPage}`)
    .then((res) => {
      setShops(res.data.shops || res.data);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.total || res.data.length) / itemsPerPage));
      setTotalShops(res.data.total || res.data.length);
      setCurrentPage(page);
    })
    .catch((err) => {
      console.error("Error fetching shops:", err);
      setShops([]);
      toast.error("حدث خطأ أثناء تحميل المتاجر، يرجى المحاولة مرة أخرى");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchShops(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchShops(page);
    }
  };

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            السابق
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            التالي
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              عرض{' '}
              <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
              {' '}إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalShops)}
              </span>
              {' '}من{' '}
              <span className="font-medium">{totalShops}</span>
              {' '}نتيجة
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                <span className="sr-only">السابق</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {getVisiblePages().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={page === '...'}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-brand-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'
                      : page === '...'
                      ? 'text-gray-700 ring-1 ring-inset ring-gray-300 cursor-default dark:text-gray-300 dark:ring-gray-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
              >
                <span className="sr-only">التالي</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="المتاجر" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {loading && <Loading />}
        
        <div className="w-full">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                جميع المتاجر
              </h3>
              {!loading && totalShops > 0 && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {totalShops} متجر • الصفحة {currentPage} من {totalPages}
                </p>
              )}
            </div>
            <Link 
              to='add' 
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة متجر جديد
            </Link>
          </div>

          {shops.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <Table className="w-full">
                  <TableHeader className="bg-gray-50 dark:bg-gray-700">
                    <TableRow className="text-gray-700 dark:text-gray-200">
                      <TableCell className="px-6 py-4 text-sm font-medium">الشعار</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">اسم المتجر</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">رقم الهاتف</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">اسم المالك</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">نوع الاشتراك</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">حالة الاشتراك</TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">الإجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shops.map((shop, index) => (
                      <TableRow key={index} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                        <TableCell className="px-6 py-4">
                          <img 
                            src={shop.logo} 
                            alt={shop.name} 
                            className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700" 
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {shop.name}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {shop.phoneNumber}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {shop.ownerName}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {shop.subscripe.type.name}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            shop?.subscripe?.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {shop?.subscripe?.status === 'active' ? 'نشط' : 'منتهي'}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/shops/${shop.shopId}`} 
                              className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                              <FaEye size={12} />
                              عرض
                            </Link>
                            <Link 
                              to={`/shops/edit/${shop.shopId}`} 
                              className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            >
                              <FaEdit size={12} />
                              تعديل
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {shops.map((shop, index) => (
                    <div key={index} className="p-4 space-y-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img 
                          src={shop.logo} 
                          alt={shop.name} 
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {shop.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {shop.ownerName}
                          </p>
                        </div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          shop?.subscripe?.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {shop?.subscripe?.status === 'active' ? 'نشط' : 'منتهي'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">رقم الهاتف:</span>
                          <p className="text-gray-900 dark:text-white font-medium">{shop.phoneNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">نوع الاشتراك:</span>
                          <p className="text-gray-900 dark:text-white font-medium">{shop.subscripe.type.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Link 
                          to={`/shops/${shop.shopId}`} 
                          className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                          <FaEye size={12} />
                          عرض التفاصيل
                        </Link>
                        <Link 
                          to={`/shops/edit/${shop.shopId}`} 
                          className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                        >
                          <FaEdit size={12} />
                          تعديل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">جارٍ التحميل...</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">لا توجد متاجر</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">لم يتم العثور على أي متاجر لعرضها.</p>
              <div className="mt-6">
                <Link 
                  to='add' 
                  className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  إضافة أول متجر
                </Link>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {shops.length > 0 && <PaginationComponent />}
        </div>
      </div>
    </div>
  );
}

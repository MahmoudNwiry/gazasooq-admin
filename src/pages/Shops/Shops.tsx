import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import toast from "react-hot-toast";
import Loading from "../../components/common/Loading";

export default function Shops() {

  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance('/admin/shop')
    .then((res)=>{            
      setShops(res.data);
    })
    .catch((err)=>{
      console.error("Error fetching shops:", err);
      setShops([]);
      toast.error("حدث خطأ أثناء تحميل المتاجر، يرجى المحاولة مرة أخرى");
    })
    .finally(() => {
      setLoading(false);
    });
  },[]);



  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="المتاجر" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : null
        }
        <div className="w-full">
            <div className="flex flex-row items-center justify-between">
                <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    جميع المتاجر
                </h3>
                <Link to='add' className="bg-brand-500 py-2 px-3 text-white rounded-lg">
                    إضافة متجر جديد
                </Link>
            </div>

            {
              shops.length > 0 ? (
                <Table className="w-full border border-gray-200 dark:border-gray-800">
                  <TableHeader className=" bg-gray-100 dark:bg-gray-800">
                    <TableRow className=" text-gray-600 dark:text-white">
                      <TableCell className="w-1/12 p-2">الشعار</TableCell>
                      <TableCell className="w-1/12 p-2">اسم المتجر</TableCell>
                      <TableCell className="w-1/12 p-2">رقم الهاتف</TableCell>
                      <TableCell className="w-1/12 p-2">اسم المالك</TableCell>
                      <TableCell className="w-1/12 p-2">نوع الاشتراك</TableCell>
                      <TableCell className="w-1/12 p-2">حالة الاشتراك</TableCell>
                      <TableCell className="w-1/12 p-2">الإجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shops.map((shop, index) => (
                      <TableRow key={index} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="w-1/12 p-2">
                          <img src={shop.logo} alt={shop.name} className="w-10 h-10" />
                        </TableCell>
                        <TableCell className="w-1/12 p-2">{shop.name}</TableCell>
                        <TableCell className="w-1/12 p-2">{shop.phoneNumber}</TableCell>
                        <TableCell className="w-1/12 p-2">{shop.ownerName}</TableCell>
                        <TableCell className="w-1/12 p-2">{shop.subscripe.type.name}</TableCell>
                        <TableCell className={`w-1/12 p-2 ${shop?.subscripe?.status === 'active' ? 'text-success-400': 'text-error-400'}`}>{shop?.subscripe?.status}</TableCell>
                        <TableCell className="w-1/12 p-2">
                          <Link to={`/shops/${shop.shopId}`} className="text-brand-500 hover:underline">عرض التفاصيل</Link>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
              )
               : loading ? (
                <p>جارٍ التحميل...</p>
              ) : (
                <p>لا توجد متاجر لعرضها.</p>
              )
            }
        </div>
      </div>
    </div>
  );
}

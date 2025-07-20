import React, { useEffect } from 'react'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { useParams } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';

// Icons
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaRegIdCard } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Loading from '../../components/common/Loading';



const ShopDetails = () => {

    const {shopId} = useParams<{shopId: string}>();
    const [shop, setShop] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
    if (!shopId) return;
    setLoading(true);
        axiosInstance(`/admin/shop/${shopId}`)
        .then((res) => {
            setShop(res.data);
        })
        .catch((err) => {
            console.error("Error fetching shop details:", err);
            setShop(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }
    , [shopId]);

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="تفاصيل المتجر" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {loading ? (
          <Loading />
        ) : shop ? (
            <div className="w-full">
              <div className="flex gap-5 mb-6">
                <div className='w-52 h-52 bg-gray-200 rounded-lg overflow-hidden p-2'>
                  <img src={shop.logo} alt={shop.name} className="w-full object-cover rounded-lg" />
                    </div>
                    <div>
                      <div className="mb-4">
                        <h3 className="mb-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                            {shop.name}
                        </h3>
                        <div className='flex items-center gap-2'>
                          {
                            shop?.category.map((cat: any) => (
                              <span key={cat._id} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm">
                                {cat.name}
                              </span>
                            ))
                          }
                        </div>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className='flex items-center gap-1'>
                          <MdOutlinePhoneAndroid className="inline-block text-gray-600 dark:text-gray-300" size={20} />
                          <p className="text-gray-600 dark:text-gray-300">{shop.phoneNumber}</p>
                        </div>
                        |
                        <div className='flex items-center gap-1'>
                          <FaUser className="inline-block text-gray-600 dark:text-gray-300" size={20} />
                          <p className="text-gray-600 dark:text-gray-300">{shop.ownerName}</p>
                        </div>
                        |
                        <div className='flex items-center gap-1'>
                          <FaRegIdCard className="inline-block text-gray-600 dark:text-gray-300" size={20} />
                          <p className="text-gray-600 dark:text-gray-300">{shop.ownerId}</p>
                        </div>
                      </div>
                      <div className='flex gap-2 mb-2'>
                      <p className="text-gray-600 dark:text-gray-300">نوع الاشتراك: {shop.subscripe?.type?.name}</p> 
                      |
                      <p className={`text-gray-600 dark:text-gray-300 ${shop?.subscripe?.status === 'active' ? 'text-success-400': 'text-error-400'}`}>{shop?.subscripe?.status}</p>
                      | (
                      <p className="text-gray-600 dark:text-gray-300">{new Date(shop.subscripe?.startDate).toLocaleDateString()}</p>
                      -
                      <p className="text-gray-600 dark:text-gray-300">{new Date(shop.subscripe?.endDate).toLocaleDateString()}</p>
                      )
                      </div>
                      <div className='flex items-center gap-1 mb-2'>
                        <FaLocationDot className="inline-block text-gray-600 dark:text-gray-300" size={20} />
                        <p className="text-gray-600 dark:text-gray-300">{shop?.address?.addressId?.governorate} - {shop?.address?.addressId?.area} - {shop?.address?.details}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">وصف المتجر: {shop.description}</p>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">جارٍ تحميل تفاصيل المتجر...</div>
            )
        }
      </div>
    </div>
  )
}

export default ShopDetails
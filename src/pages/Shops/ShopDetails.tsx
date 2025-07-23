import React, { useEffect, useState } from 'react'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { useParams, Link } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

// Icons
import { MdOutlinePhoneAndroid, MdInventory, MdLocalOffer } from "react-icons/md";
import { FaUser, FaRegIdCard, FaShoppingCart, FaStore, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineClipboardList } from "react-icons/hi";

interface Shop {
  _id: string;
  name: string;
  logo: string;
  phoneNumber: string;
  ownerName: string;
  ownerId: string;
  type: string;
  description: string;
  category: Array<{ _id: string; name: string }>;
  address: {
    addressId: {
      governorate: string;
      area: string;
    };
    details: string;
  };
  subscripe: {
    type: { name: string; price: number };
    status: 'active' | 'expired' | 'canceled';
    startDate: string;
    endDate: string;
  };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
  stock: number;
  isActive: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ product: { name: string }; quantity: number; price: number }>;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  isActive: boolean;
}



const ShopDetails = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const [shop, setShop] = useState<Shop | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'offers'>('overview');

    useEffect(() => {
        if (!shopId) return;
        fetchShopData();
    }, [shopId]);

    const fetchShopData = async () => {
        setLoading(true);
        try {
            // Fetch shop details
            const shopRes = await axiosInstance(`/admin/shop/${shopId}`);
            setShop(shopRes.data);

            // Fetch products
            const productsRes = await axiosInstance(`/admin/shop/${shopId}/products`);
            setProducts(productsRes.data);

            // Fetch orders
            const ordersRes = await axiosInstance(`/admin/shop/${shopId}/orders`);
            setOrders(ordersRes.data);

            // Fetch offers
            const offersRes = await axiosInstance(`/admin/shop/${shopId}/offers`);
            setOffers(offersRes.data);
        } catch (err) {
            console.error("Error fetching shop data:", err);
            toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, title, value, color = 'blue' }: { icon: React.ReactNode; title: string; value: string | number; color?: string }) => (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center">
                <div className={`rounded-lg p-3 bg-${color}-50 dark:bg-${color}-900/20`}>
                    <div className={`text-${color}-600 dark:text-${color}-400 text-xl`}>
                        {icon}
                    </div>
                </div>
                <div className="mr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    );

    const TabButton = ({ id, label, icon, isActive }: { id: string; label: string; icon: React.ReactNode; isActive: boolean }) => (
        <button
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="تفاصيل المتجر" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                {loading ? (
                    <Loading />
                ) : shop ? (
                    <div className="w-full space-y-8">
                        {/* Header with Edit Button */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل المتجر</h1>
                            <Link
                                to={`/shops/edit/${shopId}`}
                                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white transition-colors hover:bg-brand-700"
                            >
                                <FaEdit />
                                تعديل المتجر
                            </Link>
                        </div>

                        {/* معلومات المتجر الأساسية */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <div className="flex-shrink-0">
                                    <div className="h-48 w-48 overflow-hidden rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                                        <img src={shop.logo} alt={shop.name} className="h-full w-full rounded-lg object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{shop.name}</h1>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {shop.category.map((cat) => (
                                                <span key={cat._id} className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="flex items-center gap-3">
                                            <MdOutlinePhoneAndroid className="text-gray-400" size={20} />
                                            <span className="text-gray-600 dark:text-gray-300">{shop.phoneNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaUser className="text-gray-400" size={20} />
                                            <span className="text-gray-600 dark:text-gray-300">{shop.ownerName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaRegIdCard className="text-gray-400" size={20} />
                                            <span className="text-gray-600 dark:text-gray-300">{shop.ownerId}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaStore className="text-gray-400" size={20} />
                                            <span className="text-gray-600 dark:text-gray-300">{shop.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaLocationDot className="text-gray-400" size={20} />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {shop.address?.addressId?.governorate} - {shop.address?.addressId?.area}
                                            </span>
                                        </div>
                                    </div>

                                    {shop.address?.details && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">تفاصيل العنوان:</p>
                                            <p className="text-gray-600 dark:text-gray-400">{shop.address.details}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">وصف المتجر:</p>
                                        <p className="text-gray-600 dark:text-gray-400">{shop.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* معلومات الاشتراك */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">معلومات الاشتراك</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">نوع الاشتراك</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{shop.subscripe?.type?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">السعر</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{shop.subscripe?.type?.price} شيكل</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">الحالة</p>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                        shop.subscripe?.status === 'active' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                        {shop.subscripe?.status === 'active' ? 'نشط' : 'منتهي'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">فترة الاشتراك</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(shop.subscripe?.startDate).toLocaleDateString()} - {new Date(shop.subscripe?.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* إحصائيات */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard 
                                icon={<MdInventory />}
                                title="المنتجات"
                                value={products.length}
                                color="blue"
                            />
                            <StatCard 
                                icon={<FaShoppingCart />}
                                title="الطلبات"
                                value={orders.length}
                                color="green"
                            />
                            <StatCard 
                                icon={<MdLocalOffer />}
                                title="العروض"
                                value={offers.filter(offer => offer.isActive).length}
                                color="purple"
                            />
                            <StatCard 
                                icon={<FaCalendarAlt />}
                                title="إجمالي المبيعات"
                                value={`${orders.reduce((sum, order) => sum + order.total, 0)} شيكل`}
                                color="yellow"
                            />
                        </div>

                        {/* التبويبات */}
                        <div>
                            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
                                <TabButton id="overview" label="نظرة عامة" icon={<HiOutlineClipboardList />} isActive={activeTab === 'overview'} />
                                <TabButton id="products" label="المنتجات" icon={<MdInventory />} isActive={activeTab === 'products'} />
                                <TabButton id="orders" label="الطلبات" icon={<FaShoppingCart />} isActive={activeTab === 'orders'} />
                                <TabButton id="offers" label="العروض" icon={<MdLocalOffer />} isActive={activeTab === 'offers'} />
                            </div>

                            {/* محتوى التبويبات */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">نظرة عامة</h3>
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div>
                                                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">آخر المنتجات</h4>
                                                <div className="space-y-3">
                                                    {products.slice(0, 3).map((product) => (
                                                        <div key={product._id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600">
                                                            <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{product.price} شيكل</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">آخر الطلبات</h4>
                                                <div className="space-y-3">
                                                    {orders.slice(0, 3).map((order) => (
                                                        <div key={order._id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-medium text-gray-900 dark:text-white">#{order.orderNumber}</p>
                                                                <span className="text-sm font-medium text-green-600">{order.total} شيكل</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer.name}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'products' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">المنتجات ({products.length})</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {products.map((product) => (
                                                <div key={product._id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                                                    <img src={product.images[0]} alt={product.name} className="mb-3 h-32 w-full rounded object-cover" />
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category.name}</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="font-bold text-brand-600">{product.price} شيكل</span>
                                                        <span className={`text-sm ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                            {product.isActive ? 'متاح' : 'غير متاح'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">المخزون: {product.stock}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">الطلبات ({orders.length})</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-200 dark:border-gray-600">
                                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">رقم الطلب</th>
                                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">العميل</th>
                                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">الإجمالي</th>
                                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">الحالة</th>
                                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">التاريخ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map((order) => (
                                                        <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700">
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">#{order.orderNumber}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                <div>
                                                                    <p>{order.customer.name}</p>
                                                                    <p className="text-xs">{order.customer.phone}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{order.total} شيكل</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'offers' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">العروض ({offers.length})</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {offers.map((offer) => (
                                                <div key={offer._id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 dark:text-white">{offer.title}</h4>
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{offer.description}</p>
                                                        </div>
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                            offer.isActive 
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                        }`}>
                                                            {offer.isActive ? 'نشط' : 'غير نشط'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-lg font-bold text-brand-600">
                                                                {offer.discount}{offer.discountType === 'percentage' ? '%' : ' شيكل'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">متجر غير موجود</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">لم يتم العثور على المتجر المطلوب</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShopDetails
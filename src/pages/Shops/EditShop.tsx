import React, { useEffect, useState } from 'react'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { useNavigate, useParams } from 'react-router'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import Label from '../../components/form/Label'
import Select from '../../components/form/Select'
import TextArea from '../../components/form/input/TextArea'

// Icons
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import { MdStore } from 'react-icons/md'

interface Category {
  _id: string;
  name: string;
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  limits: {
    products: number;
    offers: number;
  }
}

interface Address {
  _id: string;
  country: string;
  city: string;
  governorate: string;
  area: string;
}

interface ShopData {
  name: string;
  phoneNumber: string;
  ownerName: string;
  ownerId: string;
  type: string;
  description: string;
  category: string[];
  address: {
    addressId: string;
    details: string;
  };
  subscripe: {
    type: string;
  };
  logo?: File | string;
}

const EditShop = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [governorates, setGovernorates] = useState<Set<string>>(new Set());
  const [areas, setAreas] = useState<Address[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  const [formData, setFormData] = useState<ShopData>({
    name: '',
    phoneNumber: '',
    ownerName: '',
    ownerId: '',
    type: '',
    description: '',
    category: [],
    address: {
      addressId: '',
      details: ''
    },
    subscripe: {
      type: ''
    }
  });

  useEffect(() => {
    if (!shopId) return;
    fetchInitialData();
  }, [shopId]);

  useEffect(() => {
    if (selectedGovernorate) {
      const areasList = addresses
        .filter((address: { governorate: string }) => address.governorate === selectedGovernorate);
      setAreas(areasList);
    } else {
      setAreas([]);
    }
  }, [selectedGovernorate, addresses]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch shop data
      const shopRes = await axiosInstance.get(`/admin/shop/${shopId}`);
      const shopData = shopRes.data;
      
      setFormData({
        name: shopData.name || '',
        phoneNumber: shopData.phoneNumber || '',
        ownerName: shopData.ownerName || '',
        ownerId: shopData.ownerId || '',
        type: shopData.type || '',
        description: shopData.description || '',
        category: shopData.category?.map((cat: any) => cat._id) || [],
        address: {
          addressId: shopData.address?.addressId?._id || '',
          details: shopData.address?.details || ''
        },
        subscripe: {
          type: shopData.subscripe?.type?._id || ''
        }
      });
      
      setLogoPreview(shopData.logo || '');

      // Fetch categories
      const categoriesRes = await axiosInstance.get('/admin/shop-category');
      setCategories(categoriesRes.data);

      // Fetch subscription plans
      const plansRes = await axiosInstance.get('/owner/subscription-plan');
      setSubscriptionPlans(plansRes.data);

      // Fetch addresses
      const addressesRes = await axiosInstance.get('/user/shippingAddresses');
      setAddresses(addressesRes.data);
      setGovernorates(new Set(addressesRes.data.map((address: { governorate: string }) => address.governorate)));
      
      // Set initial governorate and areas if address exists
      if (shopData.address?.addressId?.governorate) {
        setSelectedGovernorate(shopData.address.addressId.governorate);
        const filteredAreas = addressesRes.data.filter((address: { governorate: string }) => 
          address.governorate === shopData.address.addressId.governorate
        );
        setAreas(filteredAreas);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ShopData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGovernorateChange = (governorate: string) => {
    setSelectedGovernorate(governorate);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        addressId: '' // Reset address when governorate changes
      }
    }));
  };

  const handleAddressChange = (addressId: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        addressId
      }
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter(id => id !== categoryId)
        : [...prev.category, categoryId]
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      
      // Add basic fields
      submitData.append('name', formData.name);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('ownerName', formData.ownerName);
      submitData.append('ownerId', formData.ownerId);
      submitData.append('type', formData.type);
      submitData.append('description', formData.description);
      
      // Add categories
      formData.category.forEach(catId => {
        submitData.append('category[]', catId);
      });
      
      // Add address
      submitData.append('address.addressId', formData.address.addressId);
      submitData.append('address.details', formData.address.details);
      
      // Add subscription
      submitData.append('subscripe.type', formData.subscripe.type);
      
      // Add logo if changed
      if (formData.logo instanceof File) {
        submitData.append('logo', formData.logo);
      }

      await axiosInstance.put(`/admin/shop/${shopId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('تم تحديث المتجر بنجاح');
      navigate(`/shops/${shopId}`);
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error('حدث خطأ أثناء تحديث المتجر');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageMeta title="تعديل المتجر" description="صفحة تعديل بيانات المتجر" />
        <PageBreadcrumb pageTitle="تعديل المتجر" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta title="تعديل المتجر" description="صفحة تعديل بيانات المتجr" />
      <PageBreadcrumb pageTitle="تعديل المتجر" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل بيانات المتجر</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
            العودة
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* معلومات المتجر الأساسية */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              <MdStore className="mb-1 inline-block" /> معلومات المتجر الأساسية
            </h2>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">اسم المتجر</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">اسم المالك</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">هوية المالك</label>
                <input
                  type="text"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">نوع المتجر</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">اختر نوع المتجر</option>
                  <option value="individual">فردي</option>
                  <option value="company">شركة</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">وصف المتجر</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="اكتب وصفاً مختصراً عن المتجر..."
              />
            </div>
          </div>

          {/* شعار المتجر */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">شعار المتجر</h2>
            
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              <div className="flex-shrink-0">
                <div className="h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <MdStore size={32} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  رفع شعار جديد (اختياري)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-2 text-sm text-gray-500">
                  الحد الأقصى لحجم الملف: 5MB. الصيغ المدعومة: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* الفئات */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">فئات المتجر</h2>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.category.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* العنوان */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              <svg className="ml-2 inline h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              العنوان
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  المحافظة <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={Array.from(governorates).map((gov) => ({ value: gov, label: gov }))}
                  placeholder="اختر المحافظة"
                  defaultValue={selectedGovernorate}
                  onChange={(e: string) => {
                    handleGovernorateChange(e);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  المنطقة <span className="text-red-500">*</span>
                </Label>
                <Select
                  key={areas.length} // Force re-render when areas change
                  defaultValue={formData.address.addressId}
                  options={Array.from(areas).map((area) => ({ value: area._id, label: area.area }))}
                  placeholder="اختر المنطقة"
                  onChange={(e: string) => {
                    handleAddressChange(e);
                  }}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>
                  التفاصيل <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  value={formData.address.details}
                  className="resize-none w-full"
                  rows={3}
                  placeholder="ضع العنوان بالتفصيل (رقم البناية، الشارع، المعالم القريبة...)"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      details: e
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* خطة الاشتراك */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              <svg className="ml-2 inline h-5 w-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              خطة الاشتراك
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptionPlans.map((plan, index) => (
                <div
                  key={plan._id}
                  className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                    formData.subscripe.type === plan._id
                      ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-brand-100 shadow-lg scale-105 dark:from-brand-900/30 dark:to-brand-800/20'
                      : 'border-gray-200 hover:border-brand-300 hover:shadow-md dark:border-gray-600 dark:hover:border-brand-500'
                  }`}
                >
                  {/* Badge for popular plan */}
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        الأكثر شيوعاً
                      </span>
                    </div>
                  )}
                  
                  <label className="cursor-pointer block">
                    <input
                      type="radio"
                      name="subscripe.type"
                      value={plan._id}
                      checked={formData.subscripe.type === plan._id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    
                    {/* Plan Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">{plan.price}</span>
                        <span className="text-sm text-gray-500 mr-1">شيكل</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 inline-block">
                        لمدة {plan.duration} {plan.duration === 1 ? 'شهر' : 'أشهر'}
                      </p>
                    </div>

                    {/* Plan Features */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">عدد المنتجات</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {plan.limits.products === -1 ? 'غير محدود' : plan.limits.products}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">عدد العروض</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {plan.limits.offers === -1 ? 'غير محدود' : plan.limits.offers}
                        </span>
                      </div>
                      
                      {/* Features List */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <ul className="space-y-2">
                            {plan.features.slice(0, 3).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <svg className="w-3 h-3 text-green-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                                +{plan.features.length - 3} ميزة إضافية
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {formData.subscripe.type === plan._id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
            
            {/* Plan Comparison Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">ملاحظة مهمة</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    يمكنك تغيير خطة الاشتراك في أي وقت. سيتم تطبيق التغييرات في دورة الفوترة التالية.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditShop

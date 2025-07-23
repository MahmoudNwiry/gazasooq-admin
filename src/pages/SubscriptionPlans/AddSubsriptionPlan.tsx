import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import Input from '../../components/form/input/InputField'
import Label from '../../components/form/Label'
import TextArea from '../../components/form/input/TextArea'
import Select from '../../components/form/Select'
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'
import { SimpleLoader } from '../../components/common'
import { SubscriptionPlanSchema } from '../../utils/validations'
import { useNavigate } from 'react-router'
import { FaSave, FaArrowLeft, FaCrown, FaCheck } from 'react-icons/fa'

const defaultData = {
  name: '',
  price: 0,
  duration: 'شهري',
  features: '',
  limits: {
    products: 0,
    offers: 0
  }
}

export default function AddSubsriptionPlan() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState(defaultData.name);
  const [price, setPrice] = useState(defaultData.price);
  const [duration, setDuration] = useState(defaultData.duration);
  const [features, setFeatures] = useState(defaultData.features);
  const [allowedProducts, setAllowedProducts] = useState<number>(defaultData.limits.products);
  const [allowedOffers, setAllowedOffers] = useState<number>(defaultData.limits.offers);

  const sendData = async () => {
    if (!name.trim()) {
      toast.error('اسم الخطة مطلوب');
      return;
    }
    if (price <= 0) {
      toast.error('السعر يجب أن يكون أكبر من صفر');
      return;
    }
    if (!duration.trim()) {
      toast.error('المدة مطلوبة');
      return;
    }
    if (!features.trim()) {
      toast.error('الميزات مطلوبة');
      return;
    }

    const featuresArr = features.split(',').map(f => f.trim()).filter(f => f);
    setLoading(true);
    
    try {
      const body = {
        name, 
        price, 
        duration, 
        features: featuresArr,
        limits: {
          products: allowedProducts,
          offers: allowedOffers
        }
      }
      
      const validationResult = SubscriptionPlanSchema.safeParse({...body, features});
      
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message, {
          duration: 3000,
        });
        return;
      }

      const response = await axiosInstance.post('/owner/subscription-plan', body);

      if (response.status === 201) {
        toast.success("تم إضافة خطة الإشتراك بنجاح");
        
        // Reset form
        setName(defaultData.name);
        setPrice(defaultData.price);
        setDuration(defaultData.duration);
        setFeatures(defaultData.features);
        setAllowedProducts(defaultData.limits.products);
        setAllowedOffers(defaultData.limits.offers);
        
        // Navigate back to plans list
        setTimeout(() => {
          navigate('/subscription-plans');
        }, 1500);
      }
    }
    catch(error: any) {
      if (error.response?.data?.errors?.[0]) {
        toast.error(error.response.data.errors[0]);
      } else if (error.response?.data?.message?.[0]) {
        toast.error(error.response.data.message[0]);
      } else {
        toast.error("حدث خطأ أثناء إضافة خطة الإشتراك");
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <PageMeta
        title="إضافة خطة اشتراك جديدة - سوق إكسبرس"
        description="إضافة خطة اشتراك جديدة للنظام"
      />
      <PageBreadcrumb pageTitle="اضافة خطة اشتراك جديدة" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FaCrown className="text-brand-500" />
              إضافة خطة اشتراك جديدة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">املأ البيانات التالية لإنشاء خطة اشتراك جديدة</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
            العودة
          </button>
        </div>

        <form className='max-w-4xl mx-auto space-y-8' onSubmit={(e) => {
          e.preventDefault()
          sendData();
        }}>
          
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  اسم الاشتراك <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الخطة الأساسية"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>
                  المدة <span className="text-error-500">*</span>
                </Label>
                <Select 
                  options={[
                    {label: 'يومي', value: 'يومي'}, 
                    {label: 'إسبوعي', value: 'إسبوعي'}, 
                    {label: 'شهري', value: 'شهري'}, 
                    {label: 'سنوي', value: 'سنوي'}
                  ]}
                  onChange={(value) => setDuration(value)}
                  placeholder="اختر المدة"
                  className="mt-2"
                />
              </div>

              <div className="md:col-span-2">
                <Label>
                  السعر (بالشيكل) <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.valueAsNumber || 0)}
                  placeholder="مثال: 50"
                  min="1"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaCheck className="text-green-500" />
              مميزات الخطة
            </h3>
            
            <div>
              <Label>
                مميزات الخطة <span className="text-error-500">*</span>
              </Label>
              <TextArea 
                rows={4} 
                className='resize-y mt-2' 
                placeholder='مثال: إنشاء متجر إلكتروني, إدارة المنتجات, تقارير مفصلة&#10;ملاحظة: يرجى فصل كل ميزة بفاصلة'
                value={features}
                onChange={(e) => setFeatures(e)}
              /> 
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                اكتب المميزات مفصولة بفواصل (,)
              </p>
            </div>
          </div>

          {/* Limits */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              حدود الاستخدام
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  عدد المنتجات المسموحة <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={allowedProducts}
                  onChange={(e) => setAllowedProducts(e.target.valueAsNumber || 0)}
                  placeholder="مثال: 100 (أو -1 لغير محدود)"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ضع -1 للعدد غير المحدود
                </p>
              </div>
              
              <div>
                <Label>
                  عدد العروض المتاحة <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={allowedOffers}
                  onChange={(e) => setAllowedOffers(e.target.valueAsNumber || 0)}
                  placeholder="مثال: 10 (أو -1 لغير محدود)"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ضع -1 للعدد غير المحدود
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="min-w-[120px] bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-xl p-4 px-6 font-semibold transition-all duration-200 border border-gray-300 dark:border-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`min-w-[200px] bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl p-4 px-8 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <SimpleLoader size="sm" color="white" />
                  جارٍ الإضافة...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaSave />
                  إضافة الخطة
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

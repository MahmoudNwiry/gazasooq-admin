import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import Input from '../../components/form/input/InputField'
import Label from '../../components/form/Label'
import TextArea from '../../components/form/input/TextArea'
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import Select from '../../components/form/Select'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import { SubscriptionPlanSchema } from '../../utils/validations'

const defaultData = {
  name : '',
  price: 0,
  duration: 'شهري',
  features: '',
  limits: {
    products: 0,
    offers: 0
  }
}

export default function AddSubsriptionPlan() {

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState(defaultData.name);
  const [price, setPrice] = useState(defaultData.price);
  const [duration, setDuration] = useState(defaultData.duration);
  const [features, setFeatures] = useState(defaultData.features);
  const [allowedProducts, setAllowedProducts] = useState<number>(defaultData.limits.products);
  const [allowedOffers, setAllowedOffers] = useState<number>(defaultData.limits.offers);

  const sendData = async () => {

    const featuresArr = features.split(',');
      setLoading(true);
    try {
      
      const body = {
        name, 
        price, 
        duration, 
        features,
        limits : {
          products: allowedProducts,
          offers: allowedOffers
        }
      }
      
      const validationResult = SubscriptionPlanSchema.safeParse(body);
      
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message, {
          duration: 3000,});
          return;
        }
        

      const response = axiosInstance.post(
        '/owner/subscription-plan',
        {...body, features: featuresArr},
      );

      if((await response).status == 201) {
        toast.success("تم إضافة خطة الإشتراك بنجاح");
        setName(defaultData.name);
        setPrice(defaultData.price);
        setDuration(defaultData.duration);
        setFeatures(defaultData.features);
        setAllowedProducts(defaultData.limits.products);
        setAllowedOffers(defaultData.limits.offers);
      }
    }
    catch(error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.errors?.[0]
      ) {
        toast.error((error as any).response.data.errors[0]);
      }
      else if (typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.message?.[0]) {
        toast.error((error as any).response.data.message[0]);
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
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="اضافة خطة اشتراك جديدة" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : null
        }
        <form className='flex flex-col gap-3' onSubmit={(e) => {
          e.preventDefault()
          sendData();
        }}>
          <div>
            <Label>
                 اسم الاشتراك <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ضع اسماً للاشتراك"
            />
          </div>
          <div>
            <Label>
              المدة  <span className="text-error-500">*</span>{" "}
            </Label>
            <Select 
              options={[{label : 'سنوي', value : 'سنوي'}, {label : 'شهري', value : 'شهري'}, {label : 'إسبوعي', value : 'إسبوعي'}, {label : 'يومي', value : 'يومي'}]}
              onChange={(e) => setDuration(e)}
            />
          </div>
          <div>
            <Label>
              السعر <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              placeholder="ضع السعر المناسب للاشتراك والمدة"
            />
          </div>
          <div>
            <Label>
              مميزات <span className="text-error-500">*</span>{" "}
            </Label>
            <TextArea 
              rows={3} 
              className='resize-y' 
              placeholder='اكتب هنا جميع المميزات مع ضرورة وضع بينهم فواصل'
              value={features}
              onChange={(e) => setFeatures(e)}
            /> 
          </div>
          <h4 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>الحدود</h4>
           <div>
            <Label>
              عدد المنتجات المسموحة <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
              type="number"
              value={allowedProducts}
              onChange={(e) => setAllowedProducts(e.target.valueAsNumber)}
            />
            </div>
           <div>
            <Label>
              عدد العروض المتاحة شهريا <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
              type="number"
              value={allowedOffers}
              onChange={(e) => setAllowedOffers(e.target.valueAsNumber)}
            />
          </div>
          <div className="max-w-[400px] mt-8 mx-auto">
            <input
              type="submit"
              value="إضافة"
              className="bg-brand-500 w-full text-white rounded-lg p-3 px-8 cursor-pointer transition hover:bg-brand-700"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

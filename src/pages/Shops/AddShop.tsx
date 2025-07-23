import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Select from "../../components/form/Select";
import MultiSelect from "../../components/form/MultiSelect";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from 'react-hot-toast';
import { ShopSchema } from "../../utils/validations";
import Loading from "../../components/common/Loading";

type MultiSelectType = { text: string; value: string; }
type AddressType = { governorate: string; area: string; _id: string;[key: string]: any };
type SubscriptionPlan = { _id: string, name: string, price: number, duration: "يومي" | "شهري" | "إسبوعي" | "سنوي", features: string[], limits: { products: number, offers: number } };
type SelectedPlanType = { type: string, startDate: string, endDate: string, status: 'active' | 'expired' | 'canceld' }


export default function AddShop() {

  const [loading, setLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<MultiSelectType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [shopName, setShopName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [subscriptionPlans, setSubScriptionPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanType>({ type: '', startDate: '', endDate: '', status: 'expired' });

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [governorates, setGovernorates] = useState<Set<string>>(new Set());
  const [areas, setAreas] = useState<AddressType[]>([]);

  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<string>("");


  useEffect(() => {
    axiosInstance('/admin/shop-category')
      .then((response) => {
        const catResArr: MultiSelectType[] = [];
        response.data.forEach((category: { name: string; _id: string }) => {
          catResArr.push({ text: category.name, value: category._id });
        });
        setCategories(catResArr);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("حدث خطأ أثناء تحميل الأقسام، يرجى المحاولة مرة أخرى");
      });


    axiosInstance('/owner/subscription-plan')
      .then((response) => {
        setSubScriptionPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subscription plans:", error);
        toast.error("حدث خطأ أثناء تحميل خطط الاشتراك، يرجى المحاولة مرة أخرى");
      });


    axiosInstance('/user/shippingAddresses')
      .then((response) => {
        setAddresses(response.data);
        setGovernorates(new Set(response.data.map((address: { governorate: string }) => address.governorate)));
      })
      .catch((error) => {
        console.error("Error fetching shippingAddresses:", error);
        toast.error("حدث خطأ أثناء تحميل عناوين الشحن، يرجى المحاولة مرة أخرى");
      });

  }, []);


  useEffect(() => {
    if (selectedGovernorate) {
      const areasList = addresses
        .filter((address: { governorate: string }) => address.governorate === selectedGovernorate)
      setAreas(areasList);
    } else {
      setAreas([]);
    }
  }
    , [selectedGovernorate, addresses]);

  useEffect(() => {
    setSelectedAddress(areas[0]?._id || "");
  }, [areas])


  const addPlan = (id: string, duration: string) => {
    const plan = subscriptionPlans.find((plan) => plan._id === id);
    if (plan) {
      switch (duration) {
        case "يومي":
          setSelectedPlan({
            type: id,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
            status: 'active'
          });
          break;
        case "إسبوعي":
          setSelectedPlan({
            type: id,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
            status: 'active'
          });
          break;
        case "شهري":
          setSelectedPlan({
            type: id,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            status: 'active'
          });
          break;
        case "سنوي":
          setSelectedPlan({
            type: id,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: 'active'
          });
          break;
      }
    }
  }

  const sendData = async () => {
    try {
      setLoading(true);
      const body = {
        name: shopName,
        phoneNumber: phoneNumber,
        password: password,
        ownerName: ownerName,
        ownerId: ownerId,
        type: selectedType,
        description: description,
        address: {
          addressId: selectedAddress,
          details: addressDetails,
        },
        category: selectedCategories,
        subscripe: {
          type: selectedPlan.type,
          startDate: selectedPlan.startDate,
          endDate: selectedPlan.endDate,
          status: selectedPlan.status,
        }
      }

      const validationResult = ShopSchema.safeParse({...body, confirmPassword: confirmPassword});

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message, {
          duration: 3000,});
        return;
      }

      const res = await axiosInstance.post('/admin/shop', body);
      if (res.status === 200) {
        toast.success("تم إضافة المتجر بنجاح");
        setShopName("");
        setPhoneNumber("");
        setOwnerName("");
        setOwnerId("");
        setPassword("");
        setConfirmPassword("");
        setDescription("");
        setSelectedCategories([]);
        setSelectedType("");
        setSelectedPlan({ type: '', startDate: '', endDate: '', status: 'expired' });
      } else {
        toast.error("حدث خطأ أثناء إضافة المتجر، يرجى المحاولة مرة أخرى");
        console.error("Error adding shop:", res.data);
      }

    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("حدث خطأ أثناء إضافة المتجر، يرجى المحاولة مرة أخرى");
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
      <PageBreadcrumb pageTitle="المتاجر" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {loading && <Loading />}
        
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              إضافة متجر جديد
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              قم بملء المعلومات المطلوبة لإضافة متجر جديد إلى النظام
            </p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            sendData();
          }} className="space-y-8">
            
            {/* معلومات المتجر الأساسية */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                معلومات المتجر الأساسية
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    اسم المتجر <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="ضع اسم المتجر هنا"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="ضع رقم الهاتف هنا"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    اسم المالك <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="ضع اسم المالك هنا"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    رقم الهوية <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="ضع رقم الهوية الخاص بالمالك هنا"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <MultiSelect
                    label={<Label>
                      القسم <span className="text-red-500">*</span>
                    </Label>}
                    options={categories}
                    onChange={(e: string[]) => setSelectedCategories(e)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    نوع المتجر <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    onChange={(e: string) => setSelectedType(e)} 
                    options={[
                      { value: 'متجر طبيعي', label: 'متجر طبيعي' }, 
                      { value: 'متجر الكتروني', label: 'متجر الكتروني' }
                    ]} 
                    placeholder="اختر نوع المتجر" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>
                    وصف مختصر <span className="text-red-500">*</span>
                  </Label>
                  <TextArea
                    value={description}
                    className="resize-none w-full"
                    rows={4}
                    placeholder="ضع وصفا مناسب ومختصر للمتجر"
                    onChange={(e) => setDescription(e)}
                  />
                </div>
              </div>
            </div>

            {/* كلمات المرور */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                بيانات تسجيل الدخول
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="ضع كلمة المرور الخاصة بالمتجر هنا"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {/* معلومات العنوان */}
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
                    onChange={(e: string) => {
                      setSelectedGovernorate(e);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    المنطقة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={areas.length} // Force re-render when areas change
                    defaultValue={areas.length > 0 ? areas[0]._id : ''}
                    options={Array.from(areas).map((area) => ({ value: area._id, label: area.area }))}
                    placeholder="اختر المنطقة"
                    onChange={(e: string) => {
                      setSelectedAddress(e);
                    }}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>
                    التفاصيل <span className="text-red-500">*</span>
                  </Label>
                  <TextArea
                    value={addressDetails}
                    className="resize-none w-full"
                    rows={3}
                    placeholder="ضع العنوان بالتفصيل (رقم البناية، الشارع، المعالم القريبة...)"
                    onChange={(e) => setAddressDetails(e)}
                  />
                </div>
              </div>
            </div>
            {/* خطط الاشتراك */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                <svg className="ml-2 inline h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                خطة الاشتراك
              </h4>
              {subscriptionPlans.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
                        plan._id === selectedPlan.type 
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                      }`}
                      onClick={() => addPlan(plan._id, plan.duration)}
                    >
                      {plan._id === selectedPlan.type && (
                        <div className="absolute -top-2 -right-2 rounded-full bg-brand-500 p-1">
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                          {plan.name}
                        </h5>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                            {plan.price}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">شيكل</span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">/ {plan.duration}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المميزات:</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg className="ml-2 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {plan.limits && (
                          <div className="border-t border-gray-200 pt-3 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحدود:</p>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                المنتجات: {plan.limits.products}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                العروض: {plan.limits.offers}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">لا توجد خطط اشتراك متاحة</p>
                </div>
              )}
            </div>

            {/* زر الإرسال */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
              >
                {loading ? (
                  <>
                    <svg className="ml-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة المتجر
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

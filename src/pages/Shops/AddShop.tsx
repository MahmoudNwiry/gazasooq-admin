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
type SubscriptionPlan = { _id: string, name: string, price: number, duration: "يومي" | "شهري" | "إسبوعي" | "سنوي", features: string[] };
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
      <div className=" relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : null
        }
        <div className="w-full">
          <div className="flex flex-row items-center justify-between">
            <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              إضافة متجر جديد
            </h3>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            sendData();
          }}>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <Label>
                  اسم المتجر <span className="text-error-500">*</span>{" "}
                </Label>
                <Input placeholder="ضع اسم المتجر هنا"
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  رقم الهاتف <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="ضع رقم الهاتف هنا"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  اسم المالك <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="ضع اسم المالك هنا"
                  onChange={(e) => setOwnerName(e.target.value)}
                />

              </div>
              <div>
                <Label>
                  رقم الهوية <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="ضع رقم الهوية الخاص بالمالك هنا"
                  onChange={(e) => setOwnerId(e.target.value)}
                />
              </div>
              <div>
                <MultiSelect
                  label={<Label>
                    القسم <span className="text-error-500">*</span>{" "}
                  </Label>}
                  options={categories}
                  onChange={(e: string[]) => setSelectedCategories(e)}
                />
              </div>
              <div>
                <Label>
                  نوع المتجر <span className="text-error-500">*</span>{" "}
                </Label>
                <Select onChange={(e: string) => setSelectedType(e)} options={[{ value: 'متجر طبيعي', label: 'متجر طبيعي' }, { value: 'متجر الكتروني', label: 'متجر الكتروني' }]} placeholder="اختر نوع المتجر" />

              </div>
              <div className="grid row-start-3 row-end-5">
                <Label>
                  وصف مختصر <span className="text-error-500">*</span>{" "}
                </Label>
                <TextArea
                  value={description}
                  className="resize-none"
                  rows={6}
                  placeholder="ضع وصفا مناسب  ومختصر"
                  onChange={(e) => setDescription(e)}
                ></TextArea>
              </div>
              <div>
                <Label>
                  كلمة المرور <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="password"
                  placeholder="ضع كلمة المرور الخاصة بالمتجر هنا"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  تأكيد كلمة المرور <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <h4 className="mt-8 mb-4 font-semibold text-gray-800 text-theme-lg dark:text-white/90 sm:text-xl">
                العنوان
              </h4>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <Label>
                    المحافظة <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select
                    options={Array.from(governorates).map((gov) => ({ value: gov, label: gov }))}
                    placeholder="اختر المحافظة"
                    onChange={(e: string) => {
                      setSelectedGovernorate(e);
                    }}
                  />
                </div>
                <div>
                  <Label>
                    المنطقة <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select
                    defaultValue={areas.length > 0 ? areas[0]._id : ''}
                    options={Array.from(areas).map((area) => ({ value: area._id, label: area.area }))}
                    placeholder="اختر المحافظة"
                    onChange={(e: string) => {
                      setSelectedAddress(e);
                    }}
                  />
                </div>
                <div className="col-start-1 col-end-3">
                  <Label>
                    التفاصيل <span className="text-error-500">*</span>{" "}
                  </Label>
                  <TextArea
                    value={addressDetails}
                    className="resize-none"
                    rows={3}
                    placeholder="ضع العنوان بالتفصيل"
                    onChange={(e) => setAddressDetails(e)}
                  ></TextArea>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mt-8 mb-4 font-semibold text-gray-800 text-theme-lg dark:text-white/90 sm:text-xl">
                خطة الاشتراك
              </h4>
              <div className="grid grid-cols-3 gap-3 items-center">
                {
                  subscriptionPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`border-2 p-4 cursor-pointer rounded-lg ${plan._id === selectedPlan.type ? 'border-brand-500' : null}`}
                      onClick={() => addPlan(plan._id, plan.duration)}
                    >
                      <h5 className="font-semibold text-gray-800 dark:text-white/90">{
                        plan.name
                      }</h5>
                      <p className="text-gray-600 dark:text-white/70">السعر: {plan.price} شيكل</p>
                      <p className="text-gray-600 dark:text-white/70">المدة:
                        {plan.duration}
                      </p>
                      <p className="text-gray-600 dark:text-white/70 font-semibold">المميزات:</p>
                      <ul className="list-disc pl-5">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-gray-600 dark:text-white/70 list-none">{feature}</li>
                        ))}
                      </ul>
                    </div>)
                  )}
              </div>
            </div>
            <div className="max-w-[400px] mt-8 mx-auto">
              <input
                type="submit"
                value="إضافة"
                className="bg-brand-500 w-full text-white rounded-lg p-3 cursor-pointer transition hover:bg-brand-700"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

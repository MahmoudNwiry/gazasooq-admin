import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import PageMeta from "../../components/common/PageMeta"
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useStore";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { set } from "zod";
import Loading from "../../components/common/Loading";

interface planTypes {
  _id : string;
  name : string;
  price : number;
  duration : number;
  features : string[];
}

const SubscriptionPlansPage = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const {userdata} = useUserStore();
  const [plans, setPlans] = useState<planTypes[]>([]);

  useEffect(()=>{
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          '/owner/subscription-plan', 
          {headers : {'authorization' : `Bearer ${userdata?.token}`}}
        );

        setPlans(response.data);        

      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        setPlans([]);
        toast.error("حدث خطأ أثناء جلب خطط الإشتراك");
      } finally {
        setLoading(false);
      }
    }
    getData();

  },[]);


  const deletePlan = async (id : string) => {
    console.log(id);
  }

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="خطط الإشتراك" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : null
        }
        <Link to='add' className="bg-brand-500 py-2 px-3 text-white rounded-lg shadow block w-fit">
          إضافة خطة
        </Link>
        <div className="flex flex-wrap gap-3 mt-3">
          {
            plans.length > 0 ?
            plans.map(plan => (
              <div key={plan._id} className="w-[32%] bg-gray-100 shadow-lg border dark:bg-white/[0.03] p-4 rounded-xl">
                <h2 className="text-gray-900 dark:text-gray-100 text-[1.4rem] font-vazirmatn font-extrabold mb-3">{plan.name}</h2>
                <p className="text-gray-800 dark:text-gray-200 text-[1rem] font-vazirmatn font-semibold">{plan.price} شيكل</p>
                <p className="text-gray-800 dark:text-gray-200 text-[1rem] font-vazirmatn font-semibold">{plan.duration} يوم</p>
                <div className="h-[.9px] bg-gray-400 my-2 opacity-50" />
                <div>
                  <h4 className="text-gray-800 dark:text-gray-200 text-[1.1rem] font-vazirmatn font-semibold">المميزات</h4>
                  <div>
                  {
                    plan.features.map((feature, index) => (
                      <p key={index} className="text-gray-900 dark:text-gray-100">{feature}</p>
                    ))
                  }
                  </div>
                </div>
                <div className="mt-3">
                  <Link to={`edit/${plan._id}`} className="bg-blue-500 py-2 px-3 text-white rounded-lg shadow block w-full text-center">تعديل</Link>
                  <Button 
                    className="bg-error-600 py-1 mt-2 text-center w-full" 
                    onClick={() => deletePlan(plan._id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))
            : <Alert variant="info" title="لا يوجد خطط" message="لا يوجد خطط يرجى اضافة خطة " />
          }
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlansPage
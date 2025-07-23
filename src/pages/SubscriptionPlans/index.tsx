import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import PageMeta from "../../components/common/PageMeta"
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useStore";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { SimpleLoader } from "../../components/common";

interface planTypes {
  _id : string;
  name : string;
  price : number;
  duration : string;
  features : string[];
  limits: {
    products: number;
    offers: number;
  }
}

const SubscriptionPlansPage = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [planToDelete, setPlanToDelete] = useState<planTypes | null>(null);
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


  const deletePlan = async (id: string) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/owner/subscription-plan/${id}`, {
        headers: { 'authorization': `Bearer ${userdata?.token}` }
      });
      
      setPlans(prev => prev.filter(plan => plan._id !== id));
      toast.success("تم حذف الخطة بنجاح");
      setShowDeleteModal(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("حدث خطأ أثناء حذف الخطة");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (plan: planTypes) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <PageMeta
        title="خطط الاشتراك - سوق إكسبرس"
        description="إدارة خطط الاشتراك المتاحة في النظام"
      />
      <PageBreadcrumb pageTitle="خطط الإشتراك" />
      <div className="relative min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">خطط الاشتراك</h1>
            <p className="text-gray-600 dark:text-gray-400">إدارة وتنظيم خطط الاشتراك المتاحة</p>
          </div>
          <Link 
            to='add' 
            className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 py-3 px-6 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة خطة جديدة
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <SimpleLoader size="lg" color="brand" text="جارٍ تحميل الخطط..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {
              plans.length > 0 ?
              plans.map(plan => (
                <div key={plan._id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">شيكل</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="bg-gradient-to-r from-brand-100 to-brand-200 dark:from-brand-800/30 dark:to-brand-700/30 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full text-sm font-medium">
                        {plan.duration}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6" />

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      المميزات
                    </h4>
                    <div className="space-y-2">
                      {
                        plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      حدود الاستخدام
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {plan.limits?.products === -1 ? '∞' : plan.limits?.products || 0}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">منتجات</div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {plan.limits?.offers === -1 ? '∞' : plan.limits?.offers || 0}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">عروض</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link 
                      to={`edit/${plan._id}`} 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 px-4 text-white rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      تعديل الخطة
                    </Link>
                    <Button 
                      className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 text-center w-full rounded-xl shadow-md transition-all duration-200 hover:shadow-lg ${deletingId === plan._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={() => handleDeleteClick(plan)}
                      disabled={deletingId === plan._id}
                    >
                      {deletingId === plan._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <SimpleLoader size="sm" color="white" />
                          جارٍ الحذف...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          حذف الخطة
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ))
              : (
                <div className="col-span-full">
                  <Alert 
                    variant="info" 
                    title="لا توجد خطط اشتراك" 
                    message="لم يتم العثور على أي خطط اشتراك. يرجى إضافة خطة جديدة للبدء." 
                  />
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && planToDelete && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && deletingId !== planToDelete._id) {
              setShowDeleteModal(false);
              setPlanToDelete(null);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                تأكيد الحذف
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                هل أنت متأكد من حذف خطة "<span className="font-semibold text-red-600 dark:text-red-400">{planToDelete.name}</span>"؟ 
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPlanToDelete(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl transition-colors font-medium min-w-[100px]"
                  disabled={deletingId === planToDelete._id}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => deletePlan(planToDelete._id)}
                  disabled={deletingId === planToDelete._id}
                  className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors font-medium min-w-[120px] ${deletingId === planToDelete._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {deletingId === planToDelete._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <SimpleLoader size="sm" color="white" />
                      جارٍ الحذف...
                    </div>
                  ) : (
                    'نعم، احذف'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPlansPage
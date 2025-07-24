import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import axiosInstance from "../utils/axiosInstance";
import { ShopCategorySchema } from "../utils/validations";
import toast from "react-hot-toast";
import { SimpleLoader } from "../components/common";
import { FaPlus, FaEdit, FaTrash, FaStore, FaSave, FaTimes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

interface Categories {
  name: string;
  _id: string;
}

export default function ShopCategories() {
    const [loading, setLoading] = useState<boolean>(false);
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [addName, setAddName] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [confirmSelectedCategoryName, setConfirmSelectedCategoryName] = useState<string>('');
    const [categories, setCategories] = useState<Categories[]>([]);

    const modalCloseHandel = () => {
        setAddModalOpen(false);
        setUpdateModalOpen(false);
        setDeleteModalOpen(false);
        setConfirmSelectedCategoryName('');
        setAddName('');
        setSelectedCategoryName('');
    };

    const updateModalHandler = (id: string, name: string) => {
        setSelectedCategoryId(id);
        setSelectedCategoryName(name);
        setUpdateModalOpen(true);
    };

    const deleteModalHandler = (category: Categories) => {
        setSelectedCategoryId(category._id);
        setSelectedCategoryName(category.name);
        setDeleteModalOpen(true);
    };

    const sendAddData = async () => {
        try {
            setLoading(true);
            const validationResult = ShopCategorySchema.safeParse({ name: addName });

            if (!validationResult.success) {
                toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
                setLoading(false);
                return;
            }

            const response = await axiosInstance.post(
                "/admin/shop-category",
                validationResult.data
            );

            if (response.status === 201) {
                toast.success("تمت إضافة القسم بنجاح");
                setAddName('');
                modalCloseHandel();
                getRefresh();
            } else {
                toast.error("حدث خطأ أثناء إضافة القسم");
            }
        } catch (error: any) {
            console.error("Error adding category:", error);
            toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة القسم");
        } finally {
            setLoading(false);
        }
    };

    const updateData = async () => {
        try {
            setLoading(true);
            const validationResult = ShopCategorySchema.safeParse({ name: selectedCategoryName });

            if (!validationResult.success) {
                toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
                setLoading(false);
                return;
            }

            const response = await axiosInstance.post(
                `/admin/shop-category/${selectedCategoryId}`,
                validationResult.data
            );

            if (response.status === 200) {
                toast.success("تم تحديث القسم بنجاح");
                modalCloseHandel();
                getRefresh();
            } else {
                toast.error("حدث خطأ أثناء تحديث القسم");
            }
        } catch (error: any) {
            console.error("Error updating category:", error);
            toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث القسم");
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async () => {
        if (confirmSelectedCategoryName !== selectedCategoryName) {
            toast.error("يرجى كتابة اسم القسم بشكل صحيح للتأكيد");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.delete(
                `/admin/shop-category/${selectedCategoryId}`
            );

            if (response.status === 200) {
                toast.success("تم حذف القسم بنجاح");
                modalCloseHandel();
                getRefresh();
            } else {
                toast.error("حدث خطأ أثناء حذف القسم");
            }
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error(error.response?.data?.message || "حدث خطأ أثناء حذف القسم");
        } finally {
            setLoading(false);
        }
    };

    const getRefresh = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/admin/shop-category");
            console.log("Shop categories response:", response);
            if (response.status === 200) {
                // تحقق من بنية البيانات
                const data = response.data.data || response.data;
                console.log("Categories data:", data);
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("حدث خطأ أثناء جلب البيانات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRefresh();
    }, []);

    return (
        <div>
            <PageMeta title="أقسام المتاجر" description="إدارة وتصنيف أقسام المتاجر" />
            <PageBreadcrumb pageTitle="أقسام المتاجر" />
            
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                {loading ? (
                    <SimpleLoader />
                ) : (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                    <FaStore className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">أقسام المتاجر</h1>
                                    <p className="text-gray-600 dark:text-gray-400">إدارة وتصنيف المتاجر</p>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setAddModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <FaPlus className="text-sm" />
                                إضافة قسم جديد
                            </button>
                        </div>

                        {/* Categories Grid */}
                        {categories.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl inline-block">
                                    <MdCategory className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">لا توجد أقسام</h3>
                                    <p className="text-gray-500 dark:text-gray-400">ابدأ بإضافة أول قسم للمتاجر</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                <MdCategory className="text-3xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">قسم المتاجر</p>
                                            </div>
                                            
                                            <div className="flex gap-2 w-full">
                                                <button
                                                    onClick={() => updateModalHandler(category._id, category.name)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-all duration-200"
                                                >
                                                    <FaEdit className="text-sm" />
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => deleteModalHandler(category)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-all duration-200"
                                                >
                                                    <FaTrash className="text-sm" />
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Add Modal */}
                <Modal isOpen={addModalOpen} onClose={modalCloseHandel} className="max-w-md z-[9999]">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <FaPlus className="text-white text-lg" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة قسم جديد</h3>
                        </div>
                        
                        <form className="space-y-6">
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                                    اسم القسم <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="أدخل اسم القسم"
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={modalCloseHandel}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                                >
                                    <FaTimes className="text-sm" />
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={sendAddData}
                                    disabled={!addName.trim() || loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    <FaSave className="text-sm" />
                                    {loading ? "جاري الإضافة..." : "إضافة"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Update Modal */}
                <Modal isOpen={updateModalOpen} onClose={modalCloseHandel} className="max-w-md z-[9999]">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <FaEdit className="text-white text-lg" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل القسم</h3>
                        </div>
                        
                        <form className="space-y-6">
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                                    اسم القسم <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="أدخل اسم القسم"
                                    value={selectedCategoryName}
                                    onChange={(e) => setSelectedCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={modalCloseHandel}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                                >
                                    <FaTimes className="text-sm" />
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={updateData}
                                    disabled={!selectedCategoryName.trim() || loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    <FaSave className="text-sm" />
                                    {loading ? "جاري التحديث..." : "حفظ التغييرات"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Delete Modal */}
                <Modal isOpen={deleteModalOpen} onClose={modalCloseHandel} className="max-w-md z-[9999]">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <FaTrash className="text-white text-lg" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">تأكيد الحذف</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <p className="text-red-800 dark:text-red-300 font-medium">
                                    هل أنت متأكد من حذف القسم "{selectedCategoryName}"؟
                                </p>
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                    لا يمكن التراجع عن هذا الإجراء.
                                </p>
                            </div>
                            
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                                    اكتب "{selectedCategoryName}" للتأكيد <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder={`اكتب "${selectedCategoryName}"`}
                                    value={confirmSelectedCategoryName}
                                    onChange={(e) => setConfirmSelectedCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={modalCloseHandel}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                                >
                                    <FaTimes className="text-sm" />
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteData}
                                    disabled={confirmSelectedCategoryName !== selectedCategoryName || loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    <FaTrash className="text-sm" />
                                    {loading ? "جاري الحذف..." : "حذف نهائياً"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

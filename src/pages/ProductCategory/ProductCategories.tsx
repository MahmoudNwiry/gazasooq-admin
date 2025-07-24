import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../utils/axiosInstance";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ProductCategorySchema } from "../../utils/validations";
import { SimpleLoader } from "../../components/common";
import { FaPlus, FaBoxOpen, FaSave, FaTimes, FaImage, FaEye } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

interface category {
  _id: string;
  name: string;
  image: string;
  imageUrl: string;
}

export default function ProductsCategories() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<category[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [addName, setAddName] = useState<string>('');
  const [addImage, setAddImage] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/category');
      console.log("Product categories response:", response);
      const data = response.data.data || response.data;
      console.log("Product categories data:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  }, []);

  const addModalCloseHandel = () => {
    setAddModalOpen(false);
    setAddName('');
    setAddImage(null);
  };

  const sendAddData = async () => {
    setLoading(true);
    try {
      if (!addImage) {
        toast.error("يرجى اختيار صورة للقسم");
        setLoading(false);
        return;
      }

      if (!addName.trim()) {
        toast.error("يرجى إدخال اسم القسم");
        setLoading(false);
        return;
      }

      const validationResult = ProductCategorySchema.safeParse({ name: addName, image: addImage });

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      toast.loading("جاري إضافة القسم...", { id: "add-category" });

      const imageName = `public/category/main/${addImage.name}-${Date.now()}`;

      const response = await axiosInstance.post(`/admin/category`, {
        name: addName,
        image: imageName
      });

      if (response.status === 201) {
        const res = await axiosInstance('/s3-url', {
          params: {
            fileName: imageName,
            fileType: addImage.type,
          },
        });

        const { uploadUrl } = res.data;

        await axios.put(uploadUrl, addImage, {
          headers: {
            'Content-Type': addImage.type,
          },
        });

        setAddName('');
        setAddImage(null);
        fetchCategories();
        addModalCloseHandel();
        toast.success("تم إضافة القسم بنجاح", { id: "add-category" });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("حدث خطأ أثناء إضافة القسم", { id: "add-category" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="أقسام المنتجات" description="إدارة وتصنيف أقسام المنتجات" />
      <PageBreadcrumb pageTitle="أقسام المنتجات" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {loading ? (
          <SimpleLoader />
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                  <FaBoxOpen className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">أقسام المنتجات</h1>
                  <p className="text-gray-600 dark:text-gray-400">إدارة وتصنيف المنتجات</p>
                </div>
              </div>
              
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                  <p className="text-gray-500 dark:text-gray-400">ابدأ بإضافة أول قسم للمنتجات</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`${category._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaEye className="text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg">
                          <MdCategory className="text-lg text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">قسم المنتجات</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Modal */}
        <Modal isOpen={addModalOpen} onClose={addModalCloseHandel} className="max-w-lg z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  صورة القسم <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAddImage(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Image Preview */}
              {addImage && (
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">معاينة الصورة</Label>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <img
                      src={URL.createObjectURL(addImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addModalCloseHandel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={sendAddData}
                  disabled={!addName.trim() || !addImage || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  {loading ? "جاري الإضافة..." : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

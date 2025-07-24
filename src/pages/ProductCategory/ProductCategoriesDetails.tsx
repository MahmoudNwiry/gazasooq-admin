import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import axios from "axios";
import toast from "react-hot-toast";
import { ProductCategorySchema } from "../../utils/validations";
import { SimpleLoader } from "../../components/common";
import { 
  FaPlus, 
  FaEdit,
  FaTrash,
  FaBoxOpen, 
  FaSave, 
  FaTimes, 
  FaArrowLeft
} from "react-icons/fa";
import { MdCategory, MdSubdirectoryArrowRight } from "react-icons/md";

interface CategoryDetails {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  imageUrl?: string;
  mainCategory?: string;
  newImage?: File;
}

interface SubCategoryDetails {
  _id?: string;
  id?: string;
  name: string;
  image?: File | string | null;
  imageUrl?: string;
  categoryId?: {
    _id: string;
    name: string;
    image: string;
    imageUrl: string;
  };
  mainCategory?: string;
  newImage?: File;
}

const initialSubCategory: SubCategoryDetails = {
  name: "",
  image: null,
  mainCategory: "",
};

export default function ProductCategoriesDetails() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  console.log("Component rendered with categoryId:", categoryId);
  console.log("CategoryId type:", typeof categoryId);

  const [loading, setLoading] = useState<boolean>(false);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [subCategory, setSubCategory] = useState<CategoryDetails[]>([]);
  const [newSubCategory, setNewSubCategory] = useState<SubCategoryDetails>(initialSubCategory);

  // Modal states
  const [openAddSCModel, setOpenAddSCModel] = useState(false);
  const [openUpdateCModel, setOpenUpdateCModel] = useState(false);
  const [openUpdateSCModel, setOpenUpdateSCModel] = useState(false);
  const [openDeleteCModel, setOpenDeleteCModel] = useState(false);
  const [openDeleteSCModel, setOpenDeleteSCModel] = useState(false);

  // Edit states
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [confirmCategoryName, setConfirmCategoryName] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryDetails | null>(null);
  const [confirmSelectedSubCategoryName, setConfirmSelectedSubCategoryName] = useState('');

  const handelModelsClose = () => {
    setOpenAddSCModel(false);
    setOpenUpdateCModel(false);
    setOpenUpdateSCModel(false);
    setOpenDeleteCModel(false);
    setOpenDeleteSCModel(false);
    setNewSubCategory(initialSubCategory);
    setCategoryName(categoryDetails?.name || '');
    setCategoryImage(null);
    setConfirmCategoryName('');
    setSelectedSubCategory(null);
    setConfirmSelectedSubCategoryName('');
  };

  const fetchCategoryDetails = async () => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/category/${categoryId}`);
      const category = response.data;
      setCategoryDetails(category);
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("حدث خطأ أثناء جلب تفاصيل القسم");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    if (!categoryId) {
      console.log("No categoryId provided for sub-categories");
      return;
    }
    
    
    try {
      const response = await axiosInstance.get(`/admin/category/${categoryId}/sub-category`);
      
      // تجربة طرق مختلفة للوصول للبيانات
      let data = [];
      if (response.data.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.subcategories) {
        data = response.data.subcategories;
      } else {
        console.log("Unknown data structure:", response.data);
      }
      
      setSubCategory(data);
      
      
    } catch (error: any) {
      console.error("Error fetching sub-categories:", error);
      console.error("Error details:", error.response?.data);
      toast.error("حدث خطأ أثناء جلب الأقسام الفرعية");
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
      fetchSubCategories();
    } else {
      console.log("No categoryId found in useEffect");
    }
  }, [categoryId]);

  const addSubCategory = async () => {
    try {
      setLoading(true);
      
      if (!newSubCategory.image || !(newSubCategory.image instanceof File)) {
        toast.error("يرجى اختيار صورة للقسم الفرعي");
        return;
      }
      
      if (!newSubCategory.name.trim()) {
        toast.error("يرجى إدخال اسم القسم الفرعي");
        return;
      }

      const validationResult = ProductCategorySchema.safeParse({ 
        name: newSubCategory.name, 
        image: newSubCategory.image 
      });
      
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message);
        return;
      }

      toast.loading("جاري إضافة القسم الفرعي...", { id: "add-sub-category" });

      const imageName = `public/category/sub/${newSubCategory.image.name}-${Date.now()}`;
      
      const response = await axiosInstance.post(`/admin/sub-category`, {
        name: newSubCategory.name,
        image: imageName,
        mainCategory: categoryId
      });

      if (response.status === 201) {
        const res = await axiosInstance('/s3-url', {
          params: {
            fileName: imageName,
            fileType: newSubCategory.image.type,
          },
        });

        const { uploadUrl } = res.data;
        
        await axios.put(uploadUrl, newSubCategory.image, {
          headers: {
            'Content-Type': newSubCategory.image.type,
          },
        });

        setNewSubCategory(initialSubCategory);
        fetchSubCategories();
        handelModelsClose();
        toast.success("تم إضافة القسم الفرعي بنجاح", { id: "add-sub-category" });
      }
    } catch (error) {
      console.error("Error adding sub-category:", error);
      toast.error("حدث خطأ أثناء إضافة القسم الفرعي", { id: "add-sub-category" });
    } finally {
      setLoading(false);
    }
  };

  // Update Category function
  const updateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("يرجى إدخال اسم القسم");
      return;
    }

    try {
      setLoading(true);
      toast.loading("جاري تحديث القسم...", { id: "update-category" });

      let imageName = categoryDetails?.image;
      
      if (categoryImage) {
        imageName = `public/category/${categoryImage.name}-${Date.now()}`;
        
        const res = await axiosInstance('/s3-url', {
          params: {
            fileName: imageName,
            fileType: categoryImage.type,
          },
        });

        const { uploadUrl } = res.data;
        
        await axios.put(uploadUrl, categoryImage, {
          headers: {
            'Content-Type': categoryImage.type,
          },
        });
      }

      const response = await axiosInstance.put(`/admin/category/${categoryId}`, {
        name: categoryName,
        image: imageName
      });

      if (response.status === 200) {
        fetchCategoryDetails();
        handelModelsClose();
        toast.success("تم تحديث القسم بنجاح", { id: "update-category" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("حدث خطأ أثناء تحديث القسم", { id: "update-category" });
    } finally {
      setLoading(false);
    }
  };

  // Delete Category function
  const deleteCategory = async () => {
    if (confirmCategoryName !== categoryDetails?.name) {
      toast.error("يرجى كتابة اسم القسم بشكل صحيح للتأكيد");
      return;
    }

    try {
      setLoading(true);
      toast.loading("جاري حذف القسم...", { id: "delete-category" });

      const response = await axiosInstance.delete(`/admin/category/${categoryId}`);

      if (response.status === 200) {
        toast.success("تم حذف القسم بنجاح", { id: "delete-category" });
        navigate("/product-category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ أثناء حذف القسم", { id: "delete-category" });
    } finally {
      setLoading(false);
    }
  };

  // Update SubCategory function
  const updateSubCategory = async () => {
    if (!selectedSubCategory?.name?.trim()) {
      toast.error("يرجى إدخال اسم القسم الفرعي");
      return;
    }

    try {
      setLoading(true);
      toast.loading("جاري تحديث القسم الفرعي...", { id: "update-subcategory" });

      let imageName = selectedSubCategory.image;
      
      if (selectedSubCategory.newImage) {
        imageName = `public/category/sub/${selectedSubCategory.newImage.name}-${Date.now()}`;
        
        const res = await axiosInstance('/s3-url', {
          params: {
            fileName: imageName,
            fileType: selectedSubCategory.newImage.type,
          },
        });

        const { uploadUrl } = res.data;
        
        await axios.put(uploadUrl, selectedSubCategory.newImage, {
          headers: {
            'Content-Type': selectedSubCategory.newImage.type,
          },
        });
      }

      const response = await axiosInstance.put(`/admin/sub-category/${selectedSubCategory._id}`, {
        name: selectedSubCategory.name,
        image: imageName
      });

      if (response.status === 200) {
        fetchSubCategories();
        handelModelsClose();
        toast.success("تم تحديث القسم الفرعي بنجاح", { id: "update-subcategory" });
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("حدث خطأ أثناء تحديث القسم الفرعي", { id: "update-subcategory" });
    } finally {
      setLoading(false);
    }
  };

  // Delete SubCategory function
  const deleteSubCategory = async () => {
    if (confirmSelectedSubCategoryName !== selectedSubCategory?.name) {
      toast.error("يرجى كتابة اسم القسم الفرعي بشكل صحيح للتأكيد");
      return;
    }

    try {
      setLoading(true);
      toast.loading("جاري حذف القسم الفرعي...", { id: "delete-subcategory" });

      const response = await axiosInstance.delete(`/admin/sub-category/${selectedSubCategory?._id}`);

      if (response.status === 200) {
        fetchSubCategories();
        handelModelsClose();
        toast.success("تم حذف القسم الفرعي بنجاح", { id: "delete-subcategory" });
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("حدث خطأ أثناء حذف القسم الفرعي", { id: "delete-subcategory" });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categoryDetails) {
    return (
      <div>
        <PageMeta title="تفاصيل القسم" description="تفاصيل وإدارة القسم والأقسام الفرعية" />
        <PageBreadcrumb pageTitle="تفاصيل القسم" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <SimpleLoader />
        </div>
      </div>
    );
  }

  if (!categoryDetails) {
    return (
      <div>
        <PageMeta title="القسم غير موجود" description="القسم المطلوب غير موجود" />
        <PageBreadcrumb pageTitle="القسم غير موجود" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="text-center py-16">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl inline-block">
              <FaBoxOpen className="text-6xl text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">القسم غير موجود</h3>
              <p className="text-red-500 dark:text-red-400 mb-4">لم يتم العثور على القسم المطلوب</p>
              <button
                onClick={() => navigate('/products-category')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mx-auto"
              >
                <FaArrowLeft />
                العودة للأقسام
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta title={`تفاصيل ${categoryDetails.name}`} description="تفاصيل وإدارة القسم والأقسام الفرعية" />
      <PageBreadcrumb pageTitle={`تفاصيل ${categoryDetails.name}`} />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/products-category')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <FaArrowLeft />
              العودة للأقسام
            </button>
          </div>

          {/* Category Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="relative h-48 md:h-64">
              <img
                src={categoryDetails.imageUrl}
                alt={categoryDetails.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{categoryDetails.name}</h1>
                    <p className="text-white/80 flex items-center gap-2">
                      <MdCategory />
                      قسم رئيسي
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCategoryName(categoryDetails.name);
                        setOpenUpdateCModel(true);
                      }}
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setOpenDeleteCModel(true)}
                      className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Categories Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <MdSubdirectoryArrowRight className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">الأقسام الفرعية</h2>
                  <p className="text-gray-600 dark:text-gray-400">إدارة الأقسام الفرعية لـ {categoryDetails.name}</p>
                </div>
              </div>
              
              <button
                onClick={() => setOpenAddSCModel(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaPlus className="text-sm" />
                إضافة قسم فرعي
              </button>
            </div>

            {/* Sub Categories Grid */}
            {subCategory.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl inline-block">
                  <MdSubdirectoryArrowRight className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">لا توجد أقسام فرعية</h3>
                  <p className="text-gray-500 dark:text-gray-400">ابدأ بإضافة أول قسم فرعي</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subCategory.map((subCat) => (
                  <div
                    key={subCat._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={subCat.imageUrl}
                        alt={subCat.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {subCat.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">قسم فرعي</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubCategory(subCat);
                            setOpenUpdateSCModel(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-all duration-200"
                        >
                          <FaEdit className="text-sm" />
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubCategory(subCat);
                            setOpenDeleteSCModel(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-all duration-200"
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
        </div>

        {/* Add Sub Category Modal */}
        <Modal isOpen={openAddSCModel} onClose={handelModelsClose} className="max-w-lg z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <FaPlus className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة قسم فرعي جديد</h3>
            </div>
            
            <form className="space-y-6">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  اسم القسم الفرعي <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="أدخل اسم القسم الفرعي"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  صورة القسم الفرعي <span className="text-red-500">*</span>
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewSubCategory({ ...newSubCategory, image: e.target.files[0] });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              {/* Image Preview */}
              {newSubCategory.image && newSubCategory.image instanceof File && (
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">معاينة الصورة</Label>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <img
                      src={URL.createObjectURL(newSubCategory.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handelModelsClose}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={addSubCategory}
                  disabled={!newSubCategory.name.trim() || !newSubCategory.image || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  {loading ? "جاري الإضافة..." : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Update Category Modal */}
        <Modal isOpen={openUpdateCModel} onClose={handelModelsClose} className="max-w-lg z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FaEdit className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل القسم الرئيسي</h3>
            </div>
            
            <form className="space-y-6">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  اسم القسم <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="أدخل اسم القسم"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  صورة القسم (اختياري)
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCategoryImage(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Image Preview */}
              {categoryImage && (
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">معاينة الصورة الجديدة</Label>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <img
                      src={URL.createObjectURL(categoryImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handelModelsClose}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={updateCategory}
                  disabled={!categoryName.trim() || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  {loading ? "جاري التحديث..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Delete Category Modal */}
        <Modal isOpen={openDeleteCModel} onClose={handelModelsClose} className="max-w-md z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500 rounded-lg">
                <FaTrash className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">حذف القسم الرئيسي</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-300 font-medium">
                  هل أنت متأكد من حذف القسم "{categoryDetails?.name}"؟
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  سيتم حذف جميع الأقسام الفرعية أيضاً. لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  اكتب "{categoryDetails?.name}" للتأكيد <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder={`اكتب "${categoryDetails?.name}"`}
                  value={confirmCategoryName}
                  onChange={(e) => setConfirmCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handelModelsClose}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={deleteCategory}
                  disabled={confirmCategoryName !== categoryDetails?.name || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <FaTrash className="text-sm" />
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Update SubCategory Modal */}
        <Modal isOpen={openUpdateSCModel} onClose={handelModelsClose} className="max-w-lg z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                <FaEdit className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل القسم الفرعي</h3>
            </div>
            
            <form className="space-y-6">
              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  اسم القسم الفرعي <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="أدخل اسم القسم الفرعي"
                  value={selectedSubCategory?.name || ''}
                  onChange={(e) => setSelectedSubCategory(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  صورة القسم الفرعي (اختياري)
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedSubCategory(prev => 
                        prev ? { ...prev, newImage: e.target.files![0] } : null
                      );
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              {/* Current Image */}
              {selectedSubCategory?.image && !selectedSubCategory?.newImage && (
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">الصورة الحالية</Label>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={selectedSubCategory.imageUrl}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {selectedSubCategory?.newImage && (
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">معاينة الصورة الجديدة</Label>
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <img
                      src={URL.createObjectURL(selectedSubCategory.newImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handelModelsClose}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={updateSubCategory}
                  disabled={!selectedSubCategory?.name?.trim() || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-sm" />
                  {loading ? "جاري التحديث..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Delete SubCategory Modal */}
        <Modal isOpen={openDeleteSCModel} onClose={handelModelsClose} className="max-w-md z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500 rounded-lg">
                <FaTrash className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">حذف القسم الفرعي</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-300 font-medium">
                  هل أنت متأكد من حذف القسم الفرعي "{selectedSubCategory?.name}"؟
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
              
              <div>
                <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                  اكتب "{selectedSubCategory?.name}" للتأكيد <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder={`اكتب "${selectedSubCategory?.name}"`}
                  value={confirmSelectedSubCategoryName}
                  onChange={(e) => setConfirmSelectedSubCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handelModelsClose}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={deleteSubCategory}
                  disabled={confirmSelectedSubCategoryName !== selectedSubCategory?.name || loading}
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

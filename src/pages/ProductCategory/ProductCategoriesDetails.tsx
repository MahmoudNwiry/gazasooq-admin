import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { ProductCategorySchema, ProductCategoryUpdateSchema } from "../../utils/validations";
import Loading from "../../components/common/Loading";

interface CategoryDetails {
  _id: string;
  name: string;
  image: string;
  imageUrl?: string;
}

interface SubCategoryDetails {
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
}

const initialSubCategory: SubCategoryDetails = {
  name: "",
  image: null,
  mainCategory: "",
};

export default function ProductCategoriesDetails() {

  const { categoryId } = useParams();
  const nativgate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [blockRequests, setBlockRequests] = useState<boolean>(false);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [confirmCategoryName, setConfirmCategoryName] = useState<string>('');
  const [subCategory, setSubCategory] = useState<CategoryDetails[]>([]);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryname, setCategoryName] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState<CategoryDetails | null>(null);
  const [selectedSubCategoryImage, setSelectedSubCategoryImage] = useState<File | null>(null);
  const [confirmSelectedSubCategoryName, setConfirmSelectedSubCategoryName] = useState<string>('');
  const [newSubCategory, setNewSubCategory] = useState<SubCategoryDetails>(initialSubCategory);

  const [openUpdateCModel, setOpenUpdateCModel] = useState(false);
  const [openAddSCModel, setOpenAddSCModel] = useState(false);
  const [openUpdateSCModel, setOpenUpdateSCModel] = useState(false);
  const [openDeleteCModel, setOpenDeleteCModel] = useState(false);
  const [openDeleteSCModel, setOpenDeleteSCModel] = useState(false);

  const handelModelsClose = () => {
    setOpenUpdateCModel(false);
    setOpenAddSCModel(false);
    setOpenUpdateSCModel(false);
    setOpenDeleteCModel(false);
    setOpenDeleteSCModel(false);
    setSelectedSubCategory(null);
    setSelectedSubCategoryImage(null);
    setCategoryName(categoryDetails?.name || '');
    setCategoryImage(null);
    setConfirmCategoryName('');
    setConfirmSelectedSubCategoryName('');
  }

  const sendSCData = async () => {
    setLoading(true);
    setBlockRequests(true);
    try {
      if (!newSubCategory.image || !(newSubCategory.image instanceof File)) {
        toast.error("يرجى اختيار صورة للقسم الفرعي");
        return;
      }
      if (!newSubCategory.name.trim()) {
        toast.error("يرجى إدخال اسم القسم الفرعي");
        return;
      }

      const validationResult = ProductCategorySchema.safeParse({ name: newSubCategory.name, image: newSubCategory.image });
      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        toast.error(firstError.message, {
          duration: 3000,
        });
        return;
      }

      toast.loading("جاري إضافة القسم الفرعي...", {
        id: "Add-sub-category",
        duration: 600000,
      });

      const imageName = `public/category/sub/${newSubCategory.image.name}-${Date.now()}`


      const res = await axiosInstance.post('/admin/sub-category',
        {
          name: newSubCategory.name,
          image: imageName,
          mainCategory: categoryDetails?._id
        }
      )

      if (res.status === 201) {
        const imgRes = await axiosInstance('/s3-url', {
          params: {
            fileName: imageName,
            fileType: newSubCategory.image.type,
          },
        });
        const { uploadUrl } = imgRes.data;
        console.log(uploadUrl);

        await axios.put(uploadUrl, newSubCategory.image, {
          headers: {
            'Content-Type': newSubCategory.image.type,
          }
        })
          .then(() => {
            toast.success("تم إضافة القسم الفرعي بنجاح", {
              id: "Add-sub-category",
              duration: 3000
            });
          })
          .catch((error) => {
            console.error("Error adding category:", error);
            toast.error("حدث خطأ أثناء رفع صورة القسم", {
              id: "add-category",
              duration: 3000,
            });
          })
          .finally(() => {
            setNewSubCategory(initialSubCategory);
            fetchSubCategories();
            handelModelsClose();
          });
      }
      else {
        console.error("Failed to add sub-category");
        toast.error("فشل في إضافة القسم الفرعي", {
          id: "Add-sub-category",
          duration: 3000,
        });
      }

    } catch (error) {
      console.error("Error adding sub-category:", error);
      toast.error("حدث خطأ أثناء إضافة القسم الفرعي", {
        id: "Add-sub-category",
        duration: 3000,
      });
    }
    finally {
      setLoading(false);
      setBlockRequests(false);
    }
  }
  const updateSCData = async () => {
    setBlockRequests(true);
    if (selectedSubCategory) {
      try {
        if (!selectedSubCategory.name.trim()) {
          toast.error("يرجى إدخال اسم القسم الفرعي");
          return;
        }

        if (!selectedSubCategoryImage && !selectedSubCategory.image) {
          toast.error("يرجى اختيار صورة للقسم الفرعي");
          return;
        }

        const validationResult = ProductCategorySchema.safeParse({ name: selectedSubCategory.name, image: selectedSubCategoryImage });
        if (!validationResult.success) {
          const firstError = validationResult.error.issues[0];
          toast.error(firstError.message, {
            duration: 3000,
          });
          return;
        }

        toast.loading("جاري تحديث القسم الفرعي...", {
          id: "update-sub-category",
          duration: 600000,
        });

        if (selectedSubCategoryImage instanceof File) {
          const imgRes = await axiosInstance('/s3-url', {
            params: {
              fileName: selectedSubCategory.image,
              fileType: selectedSubCategoryImage.type,
            },
          });
          const { uploadUrl } = imgRes.data;

          await axios.put(uploadUrl, selectedSubCategoryImage, {
            headers: {
              'Content-Type': selectedSubCategoryImage.type,
            }
          }).catch((error) => {
            console.error("Error updating sub-category image:", error);
            toast.error("حدث خطأ أثناء رفع صورة القسم الفرعي", {
              id: "update-sub-category",
              duration: 3000,
            });
            return;
          })
        }

        const res = await axiosInstance.put(`/admin/sub-category/${selectedSubCategory._id}`,
          {
            name: selectedSubCategory.name,
            image: selectedSubCategory.image
          }
        )

        if (res.status === 200) {
          setSelectedSubCategory(null);
          setSelectedSubCategoryImage(null);
          fetchSubCategories();
          handelModelsClose();
          toast.success("تم تحديث القسم الفرعي بنجاح", {
            id: "update-sub-category",
            duration: 3000,
          });
        }
        else {
          console.error("Failed to update sub-category");
          toast.error("فشل في تحديث القسم الفرعي", {
            id: "update-sub-category",
            duration: 3000,
          });
        }

      } catch (error) {
        console.error("Error updating sub-category:", error);
        toast.error("حدث خطأ أثناء تحديث القسم الفرعي", {
          id: "update-sub-category",
          duration: 3000,
        });
      }
      finally {
        setBlockRequests(false);
      }
    }
    else {
      toast.error("لا يوجد قسم فرعي محدد للتحديث");
      setBlockRequests(false);
      return;
    }
  }

  const updateCData = async () => {
    setBlockRequests(true);
    if (categoryDetails) {
      try {
        if (!categoryname.trim()) {
          toast.error("يرجى إدخال اسم القسم");
          return;
        }

        if (!categoryImage && !categoryDetails.image) {
          toast.error("يرجى اختيار صورة للقسم");
          return;
        }

        const validationResult = ProductCategoryUpdateSchema.safeParse({ name: categoryname, image: categoryImage });
        if (!validationResult.success) {
          const firstError = validationResult.error.issues[0];
          toast.error(firstError.message, {
            duration: 3000,
          });
          return;
        }

        toast.loading("جاري تحديث القسم...", {
          id: "update-category",
          duration: 60000,
        });

        if (categoryImage) {
          const res = await axiosInstance('/s3-url', {
            params: {
              fileName: categoryDetails.image,
              fileType: categoryImage.type,
            },
          });
          const { uploadUrl } = res.data;
          await axios.put(uploadUrl, categoryImage, {
            headers: {
              'Content-Type': categoryImage.type,
            }
          })
            .then(() => {
              toast.success("تم تحديث صورة القسم بنجاح", {
                duration: 3000,
              });
            })
            .catch((error) => {
              console.error(error);
              toast.error("فشل تحديث صورة القسم", {
                duration: 3000,
              });
              return;
            });
        }


        const updateResult = await axiosInstance.put(`/admin/category/${categoryDetails._id}`,
          {
            name: categoryname,
            image: categoryDetails.image
          }
        );

        if (updateResult.status === 200) {
          console.log("Category updated successfully");
          fetchCategoryDetails();
          handelModelsClose();
          toast.success("تم تحديث القسم بنجاح", {
            id: "update-category",
            duration: 3000,
          });
        } else {
          console.error("Failed to update category");
          toast.error("فشل في تحديث القسم", {
            id: "update-category",
            duration: 3000,
          });
        }
        if (categoryImage) {
          setCategoryDetails({ ...categoryDetails, image: URL.createObjectURL(categoryImage) });
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء تحديث القسم", {
          id: "update-category",
          duration: 3000,
        });
      } finally {
        setBlockRequests(false);
      }
    }
    else {
      toast.error("لا يوجد قسم محدد للتحديث");
      setBlockRequests(false);
      return;
    }
  }

  const deleteCategory = async () => {
    if (categoryDetails && confirmCategoryName === categoryDetails.name) {
      setBlockRequests(true);
      toast.loading("جاري حذف القسم...", {
        id: "delete-category",
        duration: 60000,
      });
      try {
        const response = await axiosInstance.delete(`/admin/category/${categoryDetails._id}`);
        if (response.status === 200) {
          toast.success("تم حذف القسم بنجاح", {
            id: "delete-category",
            duration: 3000,
          });
          nativgate('/products-category');
        } else {
          console.error("Failed to delete category");
          toast.error("فشل في حذف القسم", {
            id: "delete-category",
            duration: 3000,
          });
        }
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            console.error(axiosError.response.data.message);
            toast.error(axiosError.response.data.message, {
              id: "delete-category",
              duration: 3000,
            });
          } else {
            toast.error("حدث خطأ أثناء حذف القسم", {
              id: "delete-category",
              duration: 3000,
            });
          }
        } else {
          toast.error("حدث خطأ أثناء حذف القسم", {
            id: "delete-category",
            duration: 3000,
          });
        }
        console.error(error);
      } finally {
        setBlockRequests(false);
      }
    } else {
      toast.error("يرجى إدخال اسم القسم بشكل صحيح لتأكيد الحذف");
    }
  }

  const deleteSubCategory = async (subCategoryId: string) => {
    if (selectedSubCategory && confirmSelectedSubCategoryName === selectedSubCategory.name) {
      setBlockRequests(true);
      toast.loading("جاري حذف القسم الفرعي...", {
        id: "delete-sub-category",
        duration: 60000,
      });
      try {
        const response = await axiosInstance.delete(`/admin/sub-category/${subCategoryId}`);
        if (response.status === 200) {
          toast.success("تم حذف القسم الفرعي بنجاح", {
            id: "delete-sub-category",
            duration: 3000,
          });
          fetchSubCategories();
          handelModelsClose();
        } else {
          console.error("Failed to delete sub-category");
          toast.error("فشل في حذف القسم الفرعي", {
            id: "delete-sub-category",
            duration: 3000,
          });
        }
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            console.error(axiosError.response.data.message);
            toast.error(axiosError.response.data.message, {
              id: "delete-sub-category",
              duration: 3000,
            });
          } else {
            toast.error("حدث خطأ أثناء حذف القسم الفرعي", {
              id: "delete-sub-category",
              duration: 3000,
            });
          }
        } else {
          toast.error("حدث خطأ أثناء حذف القسم الفرعي", {
            id: "delete-sub-category",
            duration: 3000,
          });
        }
        console.error(error);
      } finally {
        setBlockRequests(false);
      }
    } else {
      toast.error("يرجى إدخال اسم القسم الفرعي بشكل صحيح لتأكيد الحذف");
    }
  }

  const fetchCategoryDetails = async () => {
    try {
      const response = await axiosInstance.get(`/admin/category/${categoryId}`);
      // Handle the response data
      setCategoryDetails(response.data);
      setCategoryName(response.data.name);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get(`/admin/category/${categoryId}/sub-category`);
      setSubCategory(response.data);
    }
    catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    // Fetch category details using categoryId
    if (categoryId) {
      fetchCategoryDetails();
      fetchSubCategories();
    }
  }, [categoryId])


  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="تفاصيل القسم" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : (
            <>
              <div>
                <button
                  onClick={() => setOpenAddSCModel(true)}
                  className="mb-4 ml-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                  disabled={blockRequests}
                >
                  إضافة قسم فرعي
                </button>
                <button
                  onClick={() => setOpenUpdateCModel(true)}
                  className="mb-4 ml-2  px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={blockRequests}
                >
                  تحديث القسم
                </button>
                <button
                  className="mb-4 ml-2 px-4 py-2 bg-transparent border border-error-500 text-error-500 rounded-lg hover:bg-error-600 hover:text-white transition-all duration-300"
                  onClick={() => setOpenDeleteCModel(true)}
                  disabled={blockRequests}
                >
                  حذف القسم
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">{categoryDetails?.name}</h2>
              <img src={categoryDetails?.imageUrl} alt={categoryDetails?.name} className="w-32 h-32 object-cover mb-4 rounded-xl" />

              <h3 className="text-xl font-semibold mb-2 dark:text-white">الأقسام الفرعية</h3>
              {subCategory.length > 0 ? (
                <ul>
                  {subCategory.map((sub) => (
                    <li key={sub._id} className="mb-2 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-100/10">
                      <div className="flex items-center gap-3">
                        <img src={sub.imageUrl} alt={sub.name} className="w-16 h-16 object-cover mr-4 rounded-lg" />
                        <span className="text-lg font-medium dark:text-white">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setOpenUpdateSCModel(true); setSelectedSubCategory(sub) }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                          disabled={blockRequests}
                        >
                          تحديث
                        </button>
                        <button
                          onClick={() => { setSelectedSubCategory(sub); setOpenDeleteSCModel(true) }}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          disabled={blockRequests}
                        >
                          حذف
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>لا يوجد أقسام فرعية.</p>
              )}
              <Modal
                isOpen={openUpdateCModel}
                onClose={handelModelsClose}
                className="max-w-96 p-3 shadow"
              >
                <h2>تحديث القسم</h2>
                <div>
                  <Label>
                    اسم القسم  <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="text"
                    placeholder="ضع اسم القسم الفرعي هنا"
                    value={categoryname}
                    onChange={(e) => {
                      if (categoryDetails) {
                        setCategoryName(e.target.value);
                      }
                    }}
                  />
                  <div className="mt-3">
                    <Label>
                      صورة القسم  <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="file"
                      placeholder="ضع رابط الصورة هنا"
                      onChange={(e) => setCategoryImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    />
                  </div>
                  <div className="mt-2 w-48 h-48 bg-gray-100 rounded-lg mx-auto">
                    <img
                      src={
                        categoryImage
                          ? (categoryImage instanceof File
                            ? URL.createObjectURL(categoryImage)
                            : categoryImage)
                          : categoryDetails?.imageUrl || "sad"
                      }
                      alt={newSubCategory.name}
                      className="w-48 h-48 object-cover mb-4 rounded-xl"
                    />

                  </div>
                  <Button variant="primary" onClick={updateCData} disabled={blockRequests} className="block w-full mt-3">إضافة</Button>
                </div>
              </Modal>


              <Modal
                isOpen={openAddSCModel}
                onClose={handelModelsClose}
                className="max-w-96 p-3 shadow"
              >
                <h2>إضافة قسم فرعي</h2>
                <div>
                  <Label>
                    اسم القسم الفرعي <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="text"
                    placeholder="ضع اسم القسم الفرعي هنا"
                    value={newSubCategory?.name}
                    onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  />
                  <div className="mt-3">
                    <Label>
                      صورة القسم الفرعي <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="file"
                      placeholder="ضع رابط الصورة هنا"
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, image: e.target.files && e.target.files[0] ? e.target.files[0] : null })}
                    />
                  </div>
                  <div className="mt-2 w-48 h-48 bg-gray-100 rounded-lg mx-auto">
                    {
                      newSubCategory.image && newSubCategory.image instanceof File ? (
                        <img
                          src={URL.createObjectURL(newSubCategory.image)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : null
                    }

                  </div>
                  <Button variant="primary" onClick={sendSCData} disabled={blockRequests} className="block w-full mt-3">إضافة</Button>
                </div>
              </Modal>


              <Modal
                isOpen={openUpdateSCModel}
                onClose={handelModelsClose}
                className="max-w-96 p-3 shadow"
              >
                <h2>تحديث قسم فرعي</h2>
                {selectedSubCategory && (
                  <div>
                    <Label>
                      اسم القسم الفرعي <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      placeholder="ضع اسم القسم الفرعي هنا"
                      value={selectedSubCategory.name}
                      onChange={(e) => setSelectedSubCategory({ ...selectedSubCategory, name: e.target.value })}
                    />
                    <div className="mt-3">
                      <Label>
                        صورة القسم الفرعي <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="file"
                        placeholder="ضع رابط الصورة هنا"
                        onChange={(e) => setSelectedSubCategoryImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      />
                    </div>
                    <div className="mt-2 w-48 h-48 bg-gray-100 rounded-lg mx-auto">
                      <img src={(selectedSubCategoryImage instanceof File && selectedSubCategoryImage) ? URL.createObjectURL(selectedSubCategoryImage) : selectedSubCategory.imageUrl} alt={selectedSubCategory.name} className="w-48 h-48 object-cover mb-4 rounded-xl" />
                    </div>
                    <Button variant="primary" onClick={updateSCData} disabled={blockRequests} className="block w-full mt-3">حفظ</Button>
                  </div>
                )}
              </Modal>

              <Modal
                isOpen={openDeleteCModel}
                onClose={handelModelsClose}
                className="max-w-96 p-3 shadow"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">هل تريد حذف القسم الرئيسي "{categoryDetails?.name}" </h3>
                  <div>
                    <Label>
                      قم بكتابة  <span className="font-bold"> {categoryDetails?.name} </span>  لتأكيد الحذف
                    </Label>
                    <Input
                      type="text"
                      placeholder="اكتب هنا"
                      value={confirmCategoryName}
                      onChange={(e) => setConfirmCategoryName(e.target.value)}
                    />
                    <Button variant="primary" onClick={deleteCategory} disabled={confirmCategoryName !== categoryDetails?.name || blockRequests} className="block w-full mt-3">حذف</Button>
                  </div>
                </div>
              </Modal>

              <Modal
                isOpen={openDeleteSCModel}
                onClose={handelModelsClose}
                className="max-w-96 p-3 shadow"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">هل تريد حذف القسم الفرعي "{selectedSubCategory?.name}" </h3>
                  <div>
                    <Label>
                      قم بكتابة  <span className="font-bold"> {selectedSubCategory?.name} </span>  لتأكيد الحذف
                    </Label>
                    <Input
                      type="text"
                      placeholder="اكتب هنا"
                      value={confirmSelectedSubCategoryName}
                      onChange={(e) => setConfirmSelectedSubCategoryName(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={() => selectedSubCategory && deleteSubCategory(selectedSubCategory._id)}
                      className="block w-full mt-3"
                      disabled={!selectedSubCategory?._id || confirmSelectedSubCategoryName !== selectedSubCategory.name || blockRequests}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )
        }
      </div>
    </div>
  );
}

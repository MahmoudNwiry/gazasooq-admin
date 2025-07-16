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

  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [subCategory, setSubCategory] = useState<CategoryDetails[]>([]);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryname, setCategoryName] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState<CategoryDetails | null>(null);
  const [selectedSubCategoryImage, setSelectedSubCategoryImage] = useState<File | null>(null);
  const [newSubCategory, setNewSubCategory] = useState<SubCategoryDetails>(initialSubCategory);
  
  const [openUpdateCModel, setOpenUpdateCModel] = useState(false);
  const [openAddSCModel, setOpenAddSCModel] = useState(false);
  const [openUpdateSCModel, setOpenUpdateSCModel] = useState(false);

  const handelModelsClose = () => {
    setOpenUpdateCModel(false);
    setOpenAddSCModel(false);
    setOpenUpdateSCModel(false);
    setSelectedSubCategory(null);
    setSelectedSubCategoryImage(null);
    setCategoryName(categoryDetails?.name || '');
  }

  const sendSCData = async () => {
    if (newSubCategory.image instanceof File && newSubCategory.name !== "") {
      try {
        const imageName = `public/category/sub/${newSubCategory.image.name}-${Date.now()}`
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
            }).catch((error) => {
              console.error(error);
            })

            const res = await axiosInstance.post('/admin/sub-category',
              {
                name : newSubCategory.name,
                image : imageName,
                mainCategory : categoryDetails?._id
              }
            )

            if(res.status === 201) {
              setNewSubCategory(initialSubCategory);
              fetchSubCategories();
              handelModelsClose();
            }
            else {
              console.error('Failed to create new Sub Category');
            }

      } catch (error) {
        console.error(error);
      }
    }
  }
  const updateSCData = async () => {
    if (selectedSubCategory) {
      try {
        if(selectedSubCategoryImage instanceof File) {
          const imgRes = await axiosInstance('/s3-url', {
                    params: {
                      fileName: selectedSubCategory.image,
                      fileType: selectedSubCategoryImage.type,
                    },
              });
              const { uploadUrl } = imgRes.data;
              console.log(uploadUrl);
              
              await axios.put(uploadUrl, selectedSubCategoryImage, {
                headers: {
                  'Content-Type': selectedSubCategoryImage.type,
                }
              }).catch((error) => {
                console.error(error);
              })
        }

        const res = await axiosInstance.put(`/admin/sub-category/${selectedSubCategory._id}`,
          {
            name : selectedSubCategory.name,
            image : selectedSubCategory.image
          }
        )

        if(res.status === 200) {
          setSelectedSubCategory(null);
          setSelectedSubCategoryImage(null);
          fetchSubCategories();
          handelModelsClose();
        }
        else {
          console.error('Failed to update Sub Category');
        }

      } catch (error) {
        console.error(error);
      }
    }
  }
  const updateCData = async () => {
    if (categoryDetails) {
      try {

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
        } else {
          console.error("Failed to update category");
        }
        // Optionally, you can refetch the category details after updating
        if (categoryImage) {
          setCategoryDetails({ ...categoryDetails, image: URL.createObjectURL(categoryImage) });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const deleteCategory = async () => {
    if (categoryDetails) {
      try {
        const response = await axiosInstance.delete(`/admin/category/${categoryDetails._id}`);
        if (response.status === 200) {
          nativgate('/products-category');
        } else {
          console.error("Failed to delete category");
        }
      } catch (error: any) {
        if(error?.response?.data?.message) {
          console.error(error.response.data.message);
        }
        console.error(error);
      }
    }
  }

  const deleteSubCategory = async (subCategoryId: string) => {
    try {
      const response = await axiosInstance.delete(`/admin/sub-category/${subCategoryId}`);
      if (response.status === 200) {
        fetchSubCategories();
      } else {
        console.error("Failed to delete sub-category");
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        console.error(error.response.data.message);
      }
      console.error(error);
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
    if(categoryId) {
      fetchCategoryDetails();
      fetchSubCategories();
    }

  },[])


  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="تفاصيل القسم" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div>
          <button
            onClick={() => setOpenAddSCModel(true)}
            className="mb-4 ml-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            إضافة قسم فرعي
          </button>
          <button
            onClick={() => setOpenUpdateCModel(true)}
            className="mb-4 ml-2  px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            تحديث القسم
          </button>
          <button
            className="mb-4 ml-2 px-4 py-2 bg-transparent border border-error-500 text-error-500 rounded-lg hover:bg-error-600 hover:text-white transition-all duration-300"
            onClick={deleteCategory}
          >
            حذف القسم
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">{categoryDetails?.name}</h2>
        <img src={categoryDetails?.imageUrl} alt={categoryDetails?.name} className="w-32 h-32 object-cover mb-4 rounded-xl" />

        <h3 className="text-xl font-semibold mb-2">الأقسام الفرعية</h3>
        {subCategory.length > 0 ? (
          <ul>
            {subCategory.map((sub) => (
              <li key={sub._id} className="mb-2 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <img src={sub.imageUrl} alt={sub.name} className="w-16 h-16 object-cover mr-4 rounded-lg" />
                  <span className="text-lg font-medium">{sub.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {setOpenUpdateSCModel(true);setSelectedSubCategory(sub)}}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                  >
                    تحديث
                  </button>
                  <button
                    onClick={() => deleteSubCategory(sub._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
      </div>

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
              <Button variant="primary" onClick={updateCData} className="block w-full mt-3">إضافة</Button>
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
                onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value})}
              />
              <div className="mt-3">
                <Label>
                  صورة القسم الفرعي <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="file"
                  placeholder="ضع رابط الصورة هنا"
                  onChange={(e) => setNewSubCategory({...newSubCategory, image : e.target.files && e.target.files[0] ? e.target.files[0] : null})}
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
              <Button variant="primary" onClick={sendSCData} className="block w-full mt-3">إضافة</Button>
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
                onChange={(e) => setSelectedSubCategory({...selectedSubCategory, name: e.target.value})}
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
                <img src={selectedSubCategoryImage? URL.createObjectURL(selectedSubCategoryImage) : selectedSubCategory.image} alt={selectedSubCategory.name} className="w-48 h-48 object-cover mb-4 rounded-xl" />
              </div>
              <Button variant="primary" onClick={updateSCData} className="block w-full mt-3">حفظ</Button>
            </div>
          )}
        </Modal>



    </div>
  );
}

import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../utils/axiosInstance";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import axios from "axios";
import { useNavigate } from "react-router";

interface category {
  _id: string;
  name: string;
  image: string;
  imageUrl: string;
}

export default function ProductsCategories(){

  const nativgate = useNavigate();
  const [categories, setCategories] = useState<category[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [addName, setAddName] = useState<string>('');
  const [addImage, setAddImage] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/category');
      setCategories(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {

    fetchCategories();
  },[])

   const addModalCloseHandel = () => {
        setAddModalOpen(false);
    }

    const sendAddData = async () => {
        try {

          if (!addImage) {
            console.error("No image selected");
            return;
          }

          const imageName = `public/category/main/${addImage.name}-${Date.now()}`;

          const response = await axiosInstance.post(
            `/admin/category`, 
            {
              name: addName,
              image: imageName
            }
          )

          if(response.status === 201) {
            const res = await axiosInstance('/s3-url', {
              params: {
                fileName: imageName,
                fileType: addImage.type,
              },
            });
            
            const { uploadUrl } = res.data;
            
            // رفع الصورة لـ S3
            await axios.put(uploadUrl, addImage, {
              headers: {
                'Content-Type': addImage.type,
              },
            }).then(() => {
              setAddName('');
              setAddImage(null)
              fetchCategories();
              addModalCloseHandel()
            })
            .catch((error) => {
              console.error("Error uploading image:", error)
            });
          }
        }
        catch (error) {
          console.log(error);
        }
    }

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="أقسام المنتجات" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <Button variant="primary" onClick={() => setAddModalOpen(true)} >
              أضافة قسم
          </Button>

          <Modal isOpen={addModalOpen} onClose={addModalCloseHandel} className="max-w-96 p-3 shadow">
            <div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">إضافة قسم جديد</h3>
                <div>
                    <div>
                      <Label>
                          اسم القسم <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                          type="text"
                          placeholder="ضع اسم القسم هنا"
                          value={addName}
                          onChange={(e) => setAddName(e.target.value)}
                      />
                    </div>
                    <div className="mt-3"></div>
                      <Label>
                          صورة القسم <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAddImage(e.target.files[0]);
                            }
                          }}
                      />
                    </div>
                    <div className="mt-2 w-48 h-48 bg-gray-100 rounded-lg mx-auto">
                      {addImage && (
                        <img
                          src={URL.createObjectURL(addImage)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <Button variant="primary" onClick={sendAddData} className="block w-full mt-3">إضافة</Button>
                </div>
          </Modal>



          {
            categories.length > 0 ? (
              <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {nativgate(`${category._id}`)}}
                  >
                    <img src={category.imageUrl} alt={category.name} className="w-full object-cover rounded-lg dark:text-white" />
                    <h3 className="mt-2 text-lg font-semibold dark:text-white">{category.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">لا توجد أقسام متاحة</p>
            )
          }
        </div>
      </div>
  );
}

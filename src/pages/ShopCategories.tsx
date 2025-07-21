import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import axiosInstance from "../utils/axiosInstance";
import { ShopCategorySchema } from "../utils/validations";
import toast from "react-hot-toast";
import Loading from "../components/common/Loading";
import axios from "axios";

interface Categories {
  name : string;
  _id : string
}

export default function ShopCategories() {

    const [loading, setLoading] = useState<boolean>(false)
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [addName, setAddName] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [confirmSelectedCategoryName, setConfirmSelectedCategoryName] = useState<string>('');


    const [categories, setCategories] = useState<Categories[]>([])

    const modalCloseHandel = () => {
        setAddModalOpen(false);
        setUpdateModalOpen(false);
        setDeleteModalOpen(false);
    }

    const sendAddData = async () => {
        try {
          setLoading(true);
          const validationResult = ShopCategorySchema.safeParse({name : addName});
      
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0];
            toast.error(firstError.message, {
              duration: 3000,});
            return;
          }

          const response = await axiosInstance.post(
            `/admin/shop-category`, 
            {name: addName}
          )

          if(response.status === 201) {
            setAddName('');
            modalCloseHandel();
            getRefresh();
            toast.success("تم اضافة القسم بنجاح", {duration : 3000})
          }
        }
        catch (error) {
          toast.error("حدث خطأ! يرجى المحاولة مرة أخرى", {duration : 3000})
        } 
        finally {
          setLoading(false);
        }
    }

    const updateData = async () => {
        try {
          setLoading(true);
          const validationResult = ShopCategorySchema.safeParse({name : selectedCategoryName});
          console.log(selectedCategoryName);
          
          if (!validationResult.success) {
            const firstError = validationResult.error.issues[0];
            toast.error(firstError.message, {
              duration: 3000,});
            return;
          }

          const response = await axiosInstance.post(
            `/admin/shop-category/${selectedCategoryId}`, 
            {name: selectedCategoryName}
          )

          if(response.status === 201) {
            setAddName('');
            modalCloseHandel();
            getRefresh();
            toast.success("تم تعديل القسم بنجاح", {duration : 3000})
          }
        }
        catch (error) {
          toast.error("حدث خطأ! يرجى المحاولة مرة أخرى", {duration : 3000})
        } 
        finally {
          setLoading(false);
        }
    }

    const deleteData = async () => {
      try {
        setLoading(true);
        if(confirmSelectedCategoryName !== selectedCategoryName) {
          toast.error("الرجاء كتابة اسم القسم لتأكيد الحذف", {duration : 3000})
          return;
        }
        const response = await axiosInstance.delete(
          `/admin/shop-category/${selectedCategoryId}`
        )

        if(response.status === 200) {
          setSelectedCategoryId('');
          setSelectedCategoryName('');
          setConfirmSelectedCategoryName('');
          modalCloseHandel();
          getRefresh();
          toast.success("تم حذف القسم بنجاح", {duration : 3000})
        }
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            toast.error("لا يمكن حذف هذا القسم لانه يحتوي على متاجر", {duration : 3000})
            return;
          }
          else if (error.response?.status === 404) {
            toast.error("القسم غير موجود", {duration : 3000})
            return;
          }
        }
        else {
          toast.error("حدث خطأ! يرجى المحاولة مرة أخرى", {duration : 3000})
        }
      } 
      finally {
        setLoading(false);
      }
    }

    const getRefresh = async () => {
      try {
        const response = await axiosInstance.get(`/user/shopCategory`);
        setCategories(response.data)
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
      const getData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/shopCategory`);
        setCategories(response.data)
      } catch (error) {
        toast.error("حدث خطأ أثناء التحميل يرجى اعادة تحميل الصفحة مرة اخرى")
      } finally {
        setLoading(false);
      }
    }
    getData();
    },[])

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="أقسام المتاجر" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          loading ? <Loading /> : (
            <>
        <Button variant="primary" onClick={() => setAddModalOpen(true)} >
            أضافة قسم
        </Button>

        <Modal isOpen={addModalOpen} onClose={modalCloseHandel} className="max-w-96 p-3 shadow z-0">
            <div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">إضافة قسم جديد</h3>
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
                    <Button variant="primary" onClick={sendAddData} className="block w-full mt-3">اضافة</Button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={updateModalOpen} onClose={modalCloseHandel} className="max-w-96 p-3 shadow">
            <div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">تعديل قسم </h3>
                <div>
                    <Label>
                        اسم القسم <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                        type="text"
                        placeholder="ضع اسم القسم هنا"
                        value={selectedCategoryName}
                        onChange={(e) => setSelectedCategoryName(e.target.value)}
                        />
                    <Button variant="primary" onClick={updateData} className="block w-full mt-3">حفظ</Button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={deleteModalOpen} onClose={modalCloseHandel} className="max-w-96 p-3 shadow">
            <div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">هل تريد حذف القسم {selectedCategoryName} </h3>
                <div>
                    <Label>
                        قم بكتابة  <span className="font-bold"> {selectedCategoryName} </span>  لتأكيد الحذف
                    </Label>
                    <Input
                        type="text"
                        placeholder="ضع اسم القسم هنا"
                        value={confirmSelectedCategoryName}
                        onChange={(e) => setConfirmSelectedCategoryName(e.target.value)}
                        />
                    <Button variant="primary" onClick={deleteData} className="block w-full mt-3">حذف</Button>
                </div>
            </div>
        </Modal>


        <Table className=" dark:border-white mt-4 rounded shadow overflow-hidden">
          <TableHeader className="bg-gray-500 border-2 border-gray-500 dark:bg-gray-700">
            <TableRow className="border-b-2 border-gray-400 dark:border-gray-700">
              <TableCell className="text-center p-2 font-semibold text-white">الاسم</TableCell>
              <TableCell className="text-center p-2 font-semibold text-white">تحكم</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              categories.map(category => (
                <TableRow className="border-b-2 border-gray-400 dark:border-gray-700">
                  <TableCell className="text-center p-2 text-gray-dark dark:text-white">{category.name}</TableCell>
                  <TableCell className="text-center p-2">
                    <div className="flex gap-2 items-center justify-center">
                      <button 
                        className="bg-indigo-400 text-white px-2 py-1 transition rounded hover:bg-indigo-700"
                        onClick={() => {setSelectedCategoryId(category._id); setSelectedCategoryName(category.name); setUpdateModalOpen(true); }}
                        >تعديل</button>
                      <button 
                        className="bg-error-600 text-white px-2 py-1 transition rounded hover:bg-error-800"
                        onClick={() => {setSelectedCategoryId(category._id); setSelectedCategoryName(category.name); setDeleteModalOpen(true); }}
                        >حذف</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        </>
      )}
      </div>
    </div>
  );
}

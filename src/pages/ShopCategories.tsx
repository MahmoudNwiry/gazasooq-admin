import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import axios from "axios";
import { useUserStore } from "../store/useStore";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";

interface Categories {
  name : string;
  _id : string
}

export default function ShopCategories() {

    const {userdata} = useUserStore();
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [addName, setAddName] = useState<string>('');

    const [categories, setCategories] = useState<Categories[]>([])

    const addModalCloseHandel = () => {
        setAddModalOpen(false);
    }

    const sendAddData = async () => {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/admin/shop-category`, 
            {name: addName},
            {headers : {'authorization' : `Bearer ${userdata?.token}`}}
          )

          if(response.status === 201) {
            setAddName('');
            addModalCloseHandel();
          }
        }
        catch (error) {
          console.log(error);
        }
    }

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/shopCategory`, {headers : {'authorization' : `Bearer ${userdata?.token}`}});
          setCategories(response.data)
        } catch (error) {
          console.log(error);
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
        <Button variant="primary" onClick={() => setAddModalOpen(true)} >
            أضافة قسم
        </Button>

        <Modal isOpen={addModalOpen} onClose={addModalCloseHandel} className="max-w-96 p-3 shadow">
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
                    <Button variant="primary" onClick={sendAddData} className="block w-full mt-3">إضافة</Button>
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
                      <button className="bg-indigo-400 text-white px-2 py-1 transition rounded hover:bg-indigo-700">تعديل</button>
                      <button className="bg-error-600 text-white px-2 py-1 transition rounded hover:bg-error-800">حذف</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

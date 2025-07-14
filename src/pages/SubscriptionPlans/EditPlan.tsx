import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Alert from "../../components/ui/alert/Alert";
import { useUserStore } from "../../store/useStore";
import axios from "axios";
import { useParams } from "react-router";
import axiosInstance from "../../utils/axiosInstance";

const defaultData = {
  name : '',
  price: 0,
  duration: 0,
  features: '',
  alert : {
    type : 'none',
    message : '',
  }
}

export default function EditPlan() {

    const {spid} = useParams();

    const {userdata} = useUserStore();
    
    const [name, setName] = useState(defaultData.name);
    const [price, setPrice] = useState(defaultData.price);
    const [duration, setDuration] = useState(defaultData.duration);
    const [features, setFeatures] = useState(defaultData.features);
    const [alertType, setAlertType] = useState(defaultData.alert.type);
    const [alertMessage, setAlertMessage] = useState(defaultData.alert.message);


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get(`/owner/subscription-plan/${spid}`)

        setName(response.data.name)
        setPrice(response.data.price)
        setDuration(response.data.duration)
        setFeatures(response.data.features.join(','))
      } catch (error) {
        console.log(error); 
      }
    }
    getData();

  }, [spid])


    const sendData = async () => {

    const featuresArr = features.split(',');

    try {
      const response = await axiosInstance.put(
        `/owner/subscription-plan/${spid}`,
        {
          name, 
          price, 
          duration, 
          features: featuresArr
        }
      );

      if(response.status === 200){

        setName(defaultData.name);
        setPrice(defaultData.price);
        setDuration(defaultData.duration);
        setFeatures(defaultData.features);

        setAlertMessage((await response).data.message)
        setAlertType('success');
        
        setTimeout(()=>{
          setAlertMessage(defaultData.alert.message)
          setAlertType(defaultData.alert.type);
        }, 5000)
      }
    }
    catch(error) {
      setAlertMessage('فشل في تعديل الخطة! حاول مجددا')
      setAlertType('error');
        
      setTimeout(()=>{
        setAlertMessage(defaultData.alert.message)
        setAlertType(defaultData.alert.type);
      }, 5000)
    }
  }

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="تعديل خطة" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {
          alertType === "success" 
          ? <Alert variant='success' message={alertMessage} title='نجح' />
          : alertType === "error" 
          ? <Alert variant='error' message={alertMessage} title='فشل' />
          : null
        }
        <form className='flex flex-col gap-3' onSubmit={(e) => {
          e.preventDefault()
          sendData();
        }}>
          <div>
            <Label>
                 اسم الاشتراك <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ضع اسماً للاشتراك"
            />
          </div>
          <div>
            <Label>
              المدة بالايام <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.valueAsNumber)}
            placeholder="ضع المدة هنا بالايام"
            min='1'
            />
          </div>
          <div>
            <Label>
              السعر <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              placeholder="ضع السعر المناسب بباشتراك والمدة"
              min='1'
            />
          </div>
          <div>
            <Label>
              مميزات <span className="text-error-500">*</span>{" "}
            </Label>
            <TextArea 
              rows={3} 
              className='resize-y' 
              placeholder='اكتب هنا جميع المميزات مع ضرورة وضع بينهم فواصل'
              value={features}
              onChange={(e) => setFeatures(e)}
            /> 
          </div>
          <div className="max-w-[400px] mt-8 mx-auto">
            <input
              type="submit"
              value="تعديل"
              className="bg-brand-500 w-full text-white rounded-lg p-3 px-8 cursor-pointer transition hover:bg-brand-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

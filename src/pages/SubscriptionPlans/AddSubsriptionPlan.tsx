import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import Input from '../../components/form/input/InputField'
import Label from '../../components/form/Label'
import TextArea from '../../components/form/input/TextArea'
import { useState } from 'react'
import axios from 'axios'
import { useUserStore } from '../../store/useStore'
import Alert from '../../components/ui/alert/Alert'

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

export default function AddSubsriptionPlan() {

  const {userdata} = useUserStore();

  const [name, setName] = useState(defaultData.name);
  const [price, setPrice] = useState(defaultData.price);
  const [duration, setDuration] = useState(defaultData.duration);
  const [features, setFeatures] = useState(defaultData.features);
  const [alertType, setAlertType] = useState(defaultData.alert.type);
  const [alertMessage, setAlertMessage] = useState(defaultData.alert.message);

  const sendData = async () => {

    const featuresArr = features.split(',');

    try {
      const response = axios.post(
        'http://localhost:5000/api/owner/subscription-plan',
        {
          name, 
          price, 
          duration, 
          features: featuresArr
        },
        {
          headers : {'authorization' : `Bearer ${userdata?.token}`}
        }
      );

      if((await response).status == 201) {

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
      setAlertMessage('فشل في اضافة الخطة! حاول مجددا')
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
      <PageBreadcrumb pageTitle="اضافة خطة اشتراك جديدة" />
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
              value="إضافة"
              className="bg-brand-500 w-full text-white rounded-lg p-3 px-8 cursor-pointer transition hover:bg-brand-700"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

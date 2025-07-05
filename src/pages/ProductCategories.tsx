import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import axios from "axios";
import { useUserStore } from "../store/useStore";

export default function ProductsCategories(){

    const {userdata} = useUserStore();

    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);

    const uploadFile = async () => {
    if (!image) return;

    // طلب Signed URL من السيرفر
    const res = await axios.get('http://localhost:5000/api/s3-url', {
      params: {
        fileName: `shops/${userdata?.id}/${image.name}-${userdata?.id}`,
        fileType: image.type,
      },
    });

    const { uploadUrl } = res.data;

    // رفع الصورة لـ S3
    await axios.put(uploadUrl, image, {
      headers: {
        'Content-Type': image.type,
      },
    });
    

    const getRes = await axios.get('http://localhost:5000/api/s3/view-url', {
      params: { fileName: `shops/${userdata?.id}/${image.name}-${userdata?.id}`}
    });

    const imageUrl = getRes.data.url;
    setImageURL(imageUrl)
    
  };


  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="أقسام المنتجات" />
        {
            image && <img src={URL.createObjectURL(image)} width={200} />
        }
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) setImage(file);
          }}
        />
        <Button onClick={uploadFile}>ارسال</Button>
        {
          imageURL && <img src={imageURL} />
        }
      </div>
  );
}

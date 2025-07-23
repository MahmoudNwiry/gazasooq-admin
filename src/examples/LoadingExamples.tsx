import React from 'react';
import { LoadingScreen, SimpleLoader } from '../components/common';

// مثال على استخدامات مختلفة لكمبوننتات التحميل

const LoadingExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      {/* 1. شاشة التحميل الكاملة - الوضع الافتراضي */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">شاشة التحميل الكاملة - الوضع الافتراضي</h3>
        <div className="h-96">
          <LoadingScreen />
        </div>
      </div>

      {/* 2. شاشة التحميل البسيطة */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">شاشة التحميل البسيطة</h3>
        <div className="h-64">
          <LoadingScreen 
            theme="minimal"
            title="تحميل البيانات"
            subtitle="الرجاء الانتظار..."
          />
        </div>
      </div>

      {/* 3. شاشة التحميل بدون شريط التقدم */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">بدون شريط التقدم</h3>
        <div className="h-64">
          <LoadingScreen 
            showProgress={false}
            title="معالجة الطلب"
            subtitle="جارٍ المعالجة..."
          />
        </div>
      </div>

      {/* 4. شاشة التحميل بدون النقاط */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">بدون النقاط المتحركة</h3>
        <div className="h-64">
          <LoadingScreen 
            showDots={false}
            title="تحديث البيانات"
            subtitle="جارٍ التحديث..."
          />
        </div>
      </div>

      {/* 5. مؤشرات التحميل البسيطة */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">مؤشرات التحميل البسيطة</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span>صغير:</span>
            <SimpleLoader size="sm" text="تحميل..." />
          </div>
          <div className="flex items-center gap-4">
            <span>متوسط:</span>
            <SimpleLoader size="md" text="معالجة..." />
          </div>
          <div className="flex items-center gap-4">
            <span>كبير:</span>
            <SimpleLoader size="lg" text="جارٍ الحفظ..." />
          </div>
          <div className="flex items-center gap-4">
            <span>أبيض:</span>
            <div className="bg-brand-500 p-2 rounded">
              <SimpleLoader color="white" text="إرسال..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingExamples;

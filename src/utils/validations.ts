import { z } from "zod";

export const ShopSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون على الأقل 3 أحرف"),
    phoneNumber: z.string().regex(/^(059|056)\d{7}$/, "رقم الهاتف يجب أن يبدأ بـ 059 أو 056 ويحتوي على 10 أرقام فقط"),
    ownerName: z.string().min(3, "اسم المالك يجب أن يكون على الأقل 3 أحرف"),
    ownerId: z.string().regex(/^\d{9}$/, "رقم هوية المالك يجب أن يحتوي على 9 أرقام فقط"),
    category: z.array(z.string()).min(1, "يرجى اختيار فئة واحدة على الأقل من الأقسام"),
    type: z.enum(["متجر طبيعي", "متجر الكتروني"], {message: "يرجى اختيار نوع المتجر بشكل صحيح"}),
    description: z.string().min(0, "الوصف يجب أن يكون على الأقل 10 أحرف"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    confirmPassword: z.string('يجب ان يكون نصا').min(8, "تأكيد كلمة المرور يجب أن يكون على الأقل 8 أحرف"),
    address: z.object({
        addressId: z.string().min(1, "يرجى اختيار عنوان"),
        details: z.string().min(5, "تفاصيل العنوان يجب أن تكون على الأقل 5 أحرف"),
    }),
    subscripe: z.object({
        type: z.string().regex(/^[a-f\d]{24}$/i, "نوع الاشتراك يجب أن يكون صالح"),
        startDate: z.string(),
        endDate: z.string(),
        status: z.enum(["active", "expired", "canceled"], {message: "يرجى اختيار حالة الاشتراك بشكل صحيح"}),
    }),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "يجب أن تتطابق كلمة المرور مع التأكيد",
        path: ["confirmPassword"],
    }
);

export const SubscriptionPlanSchema = z.object({
    name: z.string().min(3, "اسم الخطة يجب أن يكون على الأقل 3 أحرف"),
    duration: z.enum(["يومي", "إسبوعي", "شهري", "سنوي"], {message: "يرجى اختيار مدة الاشتراك بشكل صحيح"}),
    price: z.number().min(1, "السعر يجب أن يكون أكبر من 0"),
    features: z.string().min(1, "الميزات يجب أن تكون على الأقل 1 حرف").transform((val) => val.split(',').map(feature => feature.trim())),
    limits: z.object({
        products: z.number().min(0, "عدد المنتجات المسموحة يجب أن يكون 0 أو أكثر"),
        offers: z.number().min(0, "عدد العروض المتاحة يجب أن يكون 0 أو أكثر"),
    })
}).refine(
    (data) => data.features.length > 0,
    {
        message: "يجب أن تحتوي الخطة على ميزة واحدة على الأقل",
        path: ["features"],
    }
);

export const SubscriptionPlanUpdateSchema = z.object({
    name: z.string().min(3, "اسم الخطة يجب أن يكون على الأقل 3 أحرف").optional(),
    duration: z.enum(["يومي", "إسبوعي", "شهري", "سنوي"], {message: "يرجى اختيار مدة الاشتراك بشكل صحيح"}).optional(),
    price: z.number().min(1, "السعر يجب أن يكون أكبر من 0").optional(),
    features: z.string().min(1, "الميزات يجب أن تكون على الأقل 1 حرف").transform((val) => val.split(',').map(feature => feature.trim())).optional(),
    limits: z.object({
        products: z.number().min(0, "عدد المنتجات المسموحة يجب أن يكون 0 أو أكثر").optional(),
        offers: z.number().min(0, "عدد العروض المتاحة يجب أن يكون 0 أو أكثر").optional(),
    }).optional()
}).refine(
    (data) => data.features && data.features.length > 0,
    {
        message: "يجب أن تحتوي الخطة على ميزة واحدة على الأقل",
        path: ["features"],
    }
);

export const ShopCategorySchema = z.object({
    name: z.string().min(3, "اسم القسم يجب أن يحتوي على على الأقل 3 أحرف"),
})

export const ProductCategorySchema = z.object({
    name: z.string().min(3, "اسم القسم يجب أن يحتوي على على الأقل 3 أحرف"),
    image: z.instanceof(File).refine(file => file.size > 0, "يرجى اختيار صورة للقسم"),
}).refine(
    (data) => data.image && data.image.size > 0,
    {
        message: "يرجى اختيار صورة للقسم",
        path: ["image"],
    }
);

export const ProductCategoryUpdateSchema = z.object({
    name: z.string().min(3, "اسم القسم يجب أن يحتوي على على الأقل 3 أحرف").optional(),
    image: z.union([
        z.instanceof(File).refine(file => file.size > 0, "يرجى اختيار صورة للقسم"),
        z.string().min(1, "يرجى اختيار صورة للقسم")
    ]).optional(),
}).refine(
    (data) => !data.image || 
        (typeof data.image === "string" && data.image.length > 0) ||
        (data.image instanceof File && data.image.size > 0),
    {
        message: "يرجى اختيار صورة للقسم",
        path: ["image"],
    }
);
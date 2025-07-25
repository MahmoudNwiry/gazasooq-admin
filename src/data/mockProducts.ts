// Mock data for products
export interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  price?: number; // إضافة في السعر إذا كان هذا المتغير يؤثر على السعر
  stock: number;
  sku: string;
  images?: string[]; // صور خاصة بهذا المتغير
  isDefault?: boolean;
  hexColor?: string; // للألوان
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'mm' | 'inch';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb';
  };
}

export interface ProductAttribute {
  _id: string;
  name: string;
  type: 'color' | 'size' | 'weight' | 'material' | 'dimension' | 'capacity' | 'other';
  displayName: string;
  isRequired: boolean;
  variants: ProductVariant[];
}

// تركيبة المتغيرات - ربط المتغيرات ببعضها البعض
export interface VariantCombination {
  _id: string;
  name: string; // مثل: "أحمر - حجم كبير"
  attributeValues: {
    attributeId: string; // معرف الخاصية
    variantId: string;   // معرف المتغير
  }[];
  price: number; // السعر النهائي لهذه التركيبة
  stock: number;
  sku: string;
  images?: string[];
  isAvailable: boolean;
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb';
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'mm' | 'inch';
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // السعر الأساسي
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  shop: {
    _id: string;
    name: string;
    logo: string;
  };
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
  attributes?: ProductAttribute[]; // الخصائص المختلفة للمنتج
  variantCombinations?: VariantCombination[]; // تركيبات المتغيرات المتاحة
  tags: string[];
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    _id: "1",
    name: "آيفون 15 برو",
    description: "أحدث إصدار من آيفون مع كاميرا متطورة ومعالج A17 Pro وشاشة Super Retina XDR بحجم 6.1 بوصة",
    price: 4999,
    originalPrice: 5299,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=400",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400"
    ],
    category: {
      _id: "electronics",
      name: "إلكترونيات"
    },
    subCategory: {
      _id: "smartphones",
      name: "هواتف ذكية"
    },
    shop: {
      _id: "shop1",
      name: "متجر التقنية الحديثة",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
    },
    stock: 25,
    sku: "IP15P-001",
    isActive: true,
    isFeatured: true,
    hasVariants: true,
    attributes: [
      {
        _id: "color-attr-1",
        name: "color",
        type: "color" as const,
        displayName: "اللون",
        isRequired: true,
        variants: [
          {
            _id: "color-titanium",
            name: "تيتانيوم طبيعي",
            value: "#8C7853",
            stock: 8,
            sku: "IP15P-001-TIT",
            isDefault: true
          },
          {
            _id: "color-blue",
            name: "تيتانيوم أزرق",
            value: "#374151",
            stock: 10,
            sku: "IP15P-001-BLU"
          },
          {
            _id: "color-white",
            name: "تيتانيوم أبيض",
            value: "#F3F4F6",
            stock: 7,
            sku: "IP15P-001-WHT"
          }
        ]
      },
      {
        _id: "storage-attr-1",
        name: "storage",
        type: "capacity" as const,
        displayName: "مساحة التخزين",
        isRequired: true,
        variants: [
          {
            _id: "storage-128",
            name: "128 جيجابايت",
            value: "128GB",
            stock: 15,
            sku: "IP15P-128",
            isDefault: true
          },
          {
            _id: "storage-256",
            name: "256 جيجابايت", 
            value: "256GB",
            price: 300,
            stock: 8,
            sku: "IP15P-256"
          },
          {
            _id: "storage-512",
            name: "512 جيجابايت",
            value: "512GB", 
            price: 700,
            stock: 2,
            sku: "IP15P-512"
          }
        ]
      }
    ],
    tags: ["آيفون", "أبل", "هاتف ذكي", "كاميرا"],
    views: 1250,
    sales: 45,
    rating: 4.8,
    reviewCount: 124,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z"
  },
  {
    _id: "2",
    name: "سامسونج جالكسي S24 Ultra",
    description: "هاتف ذكي متميز مع قلم S Pen وكاميرا 200 ميجابكسل وشاشة Dynamic AMOLED 2X",
    price: 4200,
    originalPrice: 4500,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=400"
    ],
    category: {
      _id: "electronics",
      name: "إلكترونيات"
    },
    subCategory: {
      _id: "smartphones",
      name: "هواتف ذكية"
    },
    shop: {
      _id: "shop2",
      name: "موبايل برو",
      logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100"
    },
    stock: 18,
    sku: "SGS24U-001",
    isActive: true,
    isFeatured: true,
    hasVariants: false,
    tags: ["سامسونج", "أندرويد", "هاتف ذكي", "قلم"],
    views: 980,
    sales: 32,
    rating: 4.7,
    reviewCount: 89,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-22T11:20:00Z"
  },
  {
    _id: "3",
    name: "لابتوب Dell XPS 13",
    description: "لابتوب نحيف وخفيف مع معالج Intel Core i7 الجيل الثالث عشر وذاكرة 16GB RAM وشاشة 4K",
    price: 6500,
    originalPrice: 7000,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"
    ],
    category: {
      _id: "electronics",
      name: "إلكترونيات"
    },
    subCategory: {
      _id: "laptops",
      name: "لابتوبات"
    },
    shop: {
      _id: "shop3",
      name: "تك هب",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100"
    },
    stock: 12,
    sku: "DXS13-001",
    isActive: true,
    isFeatured: true,
    hasVariants: false,
    tags: ["لابتوب", "ديل", "كمبيوتر محمول", "4K"],
    views: 756,
    sales: 18,
    rating: 4.6,
    reviewCount: 45,
    createdAt: "2024-01-20T15:45:00Z",
    updatedAt: "2024-01-25T16:30:00Z"
  },
  {
    _id: "4",
    name: "قميص قطني كلاسيكي",
    description: "قميص رجالي من القطن الخالص بتصميم كلاسيكي أنيق ومتوفر بألوان متعددة",
    price: 120,
    originalPrice: 150,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400"
    ],
    category: {
      _id: "clothing",
      name: "ملابس"
    },
    subCategory: {
      _id: "mens-shirts",
      name: "قمصان رجالية"
    },
    shop: {
      _id: "shop4",
      name: "أزياء العصر",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"
    },
    stock: 35,
    sku: "CS-001",
    isActive: true,
    isFeatured: false,
    hasVariants: true,
    attributes: [
      {
        _id: "size-attr-1",
        name: "size",
        type: "size" as const,
        displayName: "المقاس",
        isRequired: true,
        variants: [
          {
            _id: "size-s",
            name: "صغير",
            value: "S",
            stock: 12,
            sku: "CS-001-S"
          },
          {
            _id: "size-m",
            name: "متوسط",
            value: "M",
            stock: 15,
            sku: "CS-001-M",
            isDefault: true
          },
          {
            _id: "size-l",
            name: "كبير",
            value: "L",
            stock: 8,
            sku: "CS-001-L"
          }
        ]
      },
      {
        _id: "shirt-color-attr",
        name: "color",
        type: "color" as const,
        displayName: "اللون",
        isRequired: true,
        variants: [
          {
            _id: "shirt-white",
            name: "أبيض",
            value: "#FFFFFF",
            stock: 20,
            sku: "CS-001-WHT",
            isDefault: true
          },
          {
            _id: "shirt-blue",
            name: "أزرق",
            value: "#1E40AF",
            stock: 10,
            sku: "CS-001-BLU"
          },
          {
            _id: "shirt-black",
            name: "أسود",
            value: "#000000",
            stock: 5,
            sku: "CS-001-BLK"
          }
        ]
      }
    ],
    tags: ["قميص", "رجالي", "قطن", "كلاسيكي"],
    views: 543,
    sales: 67,
    rating: 4.4,
    reviewCount: 23,
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-28T10:15:00Z"
  },
  {
    _id: "5",
    name: "ساعة ذكية Apple Watch Series 9",
    description: "ساعة ذكية متطورة مع مستشعرات صحية متقدمة وشاشة Always-On Retina",
    price: 1800,
    originalPrice: 2000,
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400"
    ],
    category: {
      _id: "electronics",
      name: "إلكترونيات"
    },
    subCategory: {
      _id: "smartwatches",
      name: "ساعات ذكية"
    },
    shop: {
      _id: "shop1",
      name: "متجر التقنية الحديثة",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
    },
    stock: 22,
    sku: "AWS9-001",
    isActive: true,
    isFeatured: true,
    hasVariants: false,
    tags: ["ساعة ذكية", "أبل", "صحة", "رياضة"],
    views: 892,
    sales: 41,
    rating: 4.9,
    reviewCount: 156,
    createdAt: "2024-01-14T08:30:00Z",
    updatedAt: "2024-01-26T13:45:00Z"
  },
  {
    _id: "6",
    name: "سماعات Sony WH-1000XM5",
    description: "سماعات لاسلكية بخاصية إلغاء الضوضاء الرائدة في الصناعة وجودة صوت عالية",
    price: 1200,
    originalPrice: 1350,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"
    ],
    category: {
      _id: "electronics",
      name: "إلكترونيات"
    },
    subCategory: {
      _id: "headphones",
      name: "سماعات"
    },
    shop: {
      _id: "shop5",
      name: "الصوت المثالي",
      logo: "https://images.unsplash.com/photo-1493020258366-be3ead61c493?w=100"
    },
    stock: 16,
    sku: "SWH1000XM5-001",
    isActive: true,
    isFeatured: true,
    hasVariants: false,
    tags: ["سماعات", "سوني", "لاسلكي", "إلغاء ضوضاء"],
    views: 687,
    sales: 29,
    rating: 4.8,
    reviewCount: 78,
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-24T09:30:00Z"
  },
  {
    _id: "7",
    name: "حذاء رياضي Nike Air Max",
    description: "حذاء رياضي مريح ومتين مع تقنية Air Max للراحة القصوى أثناء التمرين",
    price: 450,
    originalPrice: 500,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400"
    ],
    category: {
      _id: "shoes",
      name: "أحذية"
    },
    subCategory: {
      _id: "sports-shoes",
      name: "أحذية رياضية"
    },
    shop: {
      _id: "shop6",
      name: "سبورت بلس",
      logo: "https://images.unsplash.com/photo-1594736797933-d0d3965f1d9d?w=100"
    },
    stock: 28,
    sku: "NAM-001",
    isActive: true,
    isFeatured: false,
    hasVariants: true,
    attributes: [
      {
        _id: "shoe-size-attr",
        name: "size",
        type: "size" as const,
        displayName: "المقاس",
        isRequired: true,
        variants: [
          {
            _id: "shoe-size-40",
            name: "40",
            value: "40",
            stock: 5,
            sku: "NAM-001-40"
          },
          {
            _id: "shoe-size-41",
            name: "41",
            value: "41",
            stock: 8,
            sku: "NAM-001-41",
            isDefault: true
          },
          {
            _id: "shoe-size-42",
            name: "42",
            value: "42",
            stock: 10,
            sku: "NAM-001-42"
          },
          {
            _id: "shoe-size-43",
            name: "43",
            value: "43",
            stock: 5,
            sku: "NAM-001-43"
          }
        ]
      }
    ],
    tags: ["حذاء رياضي", "نايك", "جري", "تمرين"],
    views: 456,
    sales: 52,
    rating: 4.5,
    reviewCount: 34,
    createdAt: "2024-01-10T11:45:00Z",
    updatedAt: "2024-01-27T15:20:00Z"
  },
  {
    _id: "8",
    name: "كتاب تعلم البرمجة",
    description: "دليل شامل لتعلم البرمجة من الصفر حتى الاحتراف مع أمثلة عملية ومشاريع تطبيقية",
    price: 85,
    originalPrice: 100,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
    ],
    category: {
      _id: "books",
      name: "كتب"
    },
    subCategory: {
      _id: "programming",
      name: "برمجة"
    },
    shop: {
      _id: "shop7",
      name: "مكتبة العلوم",
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    stock: 50,
    sku: "BK-PROG-001",
    isActive: true,
    isFeatured: false,
    hasVariants: false,
    tags: ["كتاب", "برمجة", "تعليم", "تطوير"],
    views: 234,
    sales: 15,
    rating: 4.3,
    reviewCount: 12,
    createdAt: "2024-01-08T16:30:00Z",
    updatedAt: "2024-01-23T12:45:00Z"
  },
  {
    _id: "9",
    name: "مكيف هواء LG Smart",
    description: "مكيف هواء ذكي بتقنية WiFi والتحكم عن بعد مع توفير في الطاقة وتبريد سريع",
    price: 2800,
    originalPrice: 3200,
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    ],
    category: {
      _id: "appliances",
      name: "أجهزة كهربائية"
    },
    subCategory: {
      _id: "air-conditioners",
      name: "مكيفات هواء"
    },
    shop: {
      _id: "shop8",
      name: "الأجهزة الذكية",
      logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100"
    },
    stock: 8,
    sku: "LG-AC-001",
    isActive: true,
    isFeatured: true,
    hasVariants: false,
    tags: ["مكيف هواء", "إل جي", "ذكي", "توفير طاقة"],
    views: 345,
    sales: 7,
    rating: 4.6,
    reviewCount: 21,
    createdAt: "2024-01-22T10:15:00Z",
    updatedAt: "2024-01-29T14:00:00Z"
  },
  {
    _id: "10",
    name: "طاولة مكتب خشبية",
    description: "طاولة مكتب أنيقة من الخشب الطبيعي مع أدراج تخزين ومساحة واسعة للعمل",
    price: 850,
    originalPrice: 950,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=400"
    ],
    category: {
      _id: "furniture",
      name: "أثاث"
    },
    subCategory: {
      _id: "office-furniture",
      name: "أثاث مكتبي"
    },
    shop: {
      _id: "shop9",
      name: "أثاث العصر",
      logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100"
    },
    stock: 15,
    sku: "WD-DESK-001",
    isActive: true,
    isFeatured: false,
    hasVariants: false,
    tags: ["طاولة مكتب", "خشب", "أثاث", "مكتب"],
    views: 198,
    sales: 12,
    rating: 4.2,
    reviewCount: 8,
    createdAt: "2024-01-05T13:20:00Z",
    updatedAt: "2024-01-25T11:30:00Z"
  },
  {
    _id: "11",
    name: "صندوق تخزين خشبي فاخر",
    description: "صندوق تخزين أنيق من الخشب الطبيعي متوفر بأحجام وأوزان مختلفة لتناسب احتياجاتك المختلفة",
    price: 250,
    originalPrice: 300,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
    ],
    category: {
      _id: "furniture",
      name: "أثاث"
    },
    subCategory: {
      _id: "storage",
      name: "تخزين"
    },
    shop: {
      _id: "shop9",
      name: "أثاث العصر",
      logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100"
    },
    stock: 40,
    sku: "WSB-001",
    isActive: true,
    isFeatured: true,
    hasVariants: true,
    attributes: [
      {
        _id: "dimension-attr-1",
        name: "dimension",
        type: "dimension" as const,
        displayName: "الأبعاد",
        isRequired: true,
        variants: [
          {
            _id: "dim-small",
            name: "صغير",
            value: "30x20x15 سم",
            stock: 15,
            sku: "WSB-001-S",
            isDefault: true
          },
          {
            _id: "dim-medium",
            name: "متوسط",
            value: "50x35x25 سم",
            price: 50,
            stock: 18,
            sku: "WSB-001-M"
          },
          {
            _id: "dim-large",
            name: "كبير",
            value: "70x50x35 سم",
            price: 100,
            stock: 7,
            sku: "WSB-001-L"
          }
        ]
      },
      {
        _id: "weight-attr-1",
        name: "weight",
        type: "weight" as const,
        displayName: "الوزن",
        isRequired: false,
        variants: [
          {
            _id: "weight-light",
            name: "خفيف",
            value: "2-3 كجم",
            stock: 20,
            sku: "WSB-001-LT",
            isDefault: true
          },
          {
            _id: "weight-medium",
            name: "متوسط",
            value: "4-5 كجم",
            price: 25,
            stock: 15,
            sku: "WSB-001-MD"
          },
          {
            _id: "weight-heavy",
            name: "ثقيل",
            value: "6-8 كجم",
            price: 50,
            stock: 5,
            sku: "WSB-001-HV"
          }
        ]
      },
      {
        _id: "material-attr-1",
        name: "material",
        type: "material" as const,
        displayName: "نوع الخشب",
        isRequired: true,
        variants: [
          {
            _id: "wood-pine",
            name: "خشب الصنوبر",
            value: "صنوبر طبيعي",
            stock: 20,
            sku: "WSB-001-PINE",
            isDefault: true
          },
          {
            _id: "wood-oak",
            name: "خشب البلوط",
            value: "بلوط فاخر",
            price: 75,
            stock: 12,
            sku: "WSB-001-OAK"
          },
          {
            _id: "wood-mahogany",
            name: "خشب الماهوجني",
            value: "ماهوجني أصلي",
            price: 150,
            stock: 8,
            sku: "WSB-001-MAH"
          }
        ]
      }
    ],
    tags: ["صندوق تخزين", "خشب", "أثاث", "تنظيم", "فاخر"],
    views: 320,
    sales: 28,
    rating: 4.6,
    reviewCount: 15,
    createdAt: "2024-01-30T16:45:00Z",
    updatedAt: "2024-02-05T09:30:00Z"
  },
  {
    _id: "12",
    name: "حقيبة ظهر رياضية",
    description: "حقيبة ظهر عملية ومقاومة للماء مع تصميم عصري متوفرة بألوان متنوعة",
    price: 180,
    originalPrice: 220,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400"
    ],
    category: {
      _id: "accessories",
      name: "إكسسوارات"
    },
    subCategory: {
      _id: "bags",
      name: "حقائب"
    },
    shop: {
      _id: "shop6",
      name: "سبورت بلس",
      logo: "https://images.unsplash.com/photo-1594736797933-d0d3965f1d9d?w=100"
    },
    stock: 45,
    sku: "SPB-001",
    isActive: true,
    isFeatured: false,
    hasVariants: true,
    attributes: [
      {
        _id: "bag-color-attr",
        name: "color",
        type: "color" as const,
        displayName: "اللون",
        isRequired: true,
        variants: [
          {
            _id: "bag-black",
            name: "أسود",
            value: "#000000",
            stock: 15,
            sku: "SPB-001-BLK",
            isDefault: true
          },
          {
            _id: "bag-navy",
            name: "كحلي",
            value: "#1a365d",
            stock: 12,
            sku: "SPB-001-NVY"
          },
          {
            _id: "bag-red",
            name: "أحمر",
            value: "#e53e3e",
            stock: 8,
            sku: "SPB-001-RED"
          },
          {
            _id: "bag-green",
            name: "أخضر",
            value: "#38a169",
            stock: 10,
            sku: "SPB-001-GRN"
          }
        ]
      }
    ],
    tags: ["حقيبة ظهر", "رياضية", "مقاومة للماء", "عملية"],
    views: 280,
    sales: 35,
    rating: 4.3,
    reviewCount: 22,
    createdAt: "2024-02-01T11:20:00Z",
    updatedAt: "2024-02-10T14:15:00Z"
  },
  {
    _id: "13",
    name: "تيشيرت رياضي متطور",
    description: "تيشيرت رياضي مصنوع من أقمشة تقنية متطورة مع تهوية ممتازة ومقاومة للعرق، كل لون له أحجام وأوزان مختلفة",
    price: 120,
    originalPrice: 150,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      "https://images.unsplash.com/photo-1556821840-3a9c6dcb408d?w=400"
    ],
    category: {
      _id: "clothing",
      name: "ملابس"
    },
    subCategory: {
      _id: "sportswear",
      name: "ملابس رياضية"
    },
    shop: {
      _id: "shop4",
      name: "أزياء العصر",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"
    },
    stock: 75,
    sku: "TSH-ADV-001",
    isActive: true,
    isFeatured: true,
    hasVariants: true,
    attributes: [
      {
        _id: "tshirt-color-attr",
        name: "color",
        type: "color" as const,
        displayName: "اللون",
        isRequired: true,
        variants: [
          {
            _id: "tshirt-red",
            name: "أحمر رياضي",
            value: "#dc2626",
            stock: 25,
            sku: "TSH-RED",
            hexColor: "#dc2626",
            isDefault: true
          },
          {
            _id: "tshirt-blue",
            name: "أزرق بحري",
            value: "#1e40af",
            stock: 30,
            sku: "TSH-BLU",
            hexColor: "#1e40af"
          },
          {
            _id: "tshirt-black",
            name: "أسود كلاسيكي",
            value: "#111827",
            stock: 20,
            sku: "TSH-BLK",
            hexColor: "#111827"
          }
        ]
      },
      {
        _id: "tshirt-size-attr",
        name: "size",
        type: "size" as const,
        displayName: "المقاس",
        isRequired: true,
        variants: [
          {
            _id: "tshirt-small",
            name: "صغير (S)",
            value: "S",
            stock: 15,
            sku: "TSH-S",
            dimensions: {
              length: 65,
              width: 45,
              height: 1,
              unit: "cm"
            }
          },
          {
            _id: "tshirt-medium",
            name: "متوسط (M)",
            value: "M",
            stock: 25,
            sku: "TSH-M",
            dimensions: {
              length: 70,
              width: 50,
              height: 1,
              unit: "cm"
            }
          },
          {
            _id: "tshirt-large",
            name: "كبير (L)",
            value: "L",
            stock: 20,
            sku: "TSH-L",
            dimensions: {
              length: 75,
              width: 55,
              height: 1,
              unit: "cm"
            }
          },
          {
            _id: "tshirt-xlarge",
            name: "كبير جداً (XL)",
            value: "XL",
            stock: 15,
            sku: "TSH-XL",
            dimensions: {
              length: 80,
              width: 60,
              height: 1,
              unit: "cm"
            }
          }
        ]
      },
      {
        _id: "tshirt-weight-attr",
        name: "weight",
        type: "weight" as const,
        displayName: "وزن القماش",
        isRequired: false,
        variants: [
          {
            _id: "tshirt-light",
            name: "خفيف (150 جم)",
            value: "light",
            stock: 35,
            sku: "TSH-LIGHT",
            weight: {
              value: 150,
              unit: "g"
            }
          },
          {
            _id: "tshirt-medium-weight",
            name: "متوسط (200 جم)",
            value: "medium",
            stock: 25,
            sku: "TSH-MED",
            weight: {
              value: 200,
              unit: "g"
            },
            price: 15
          },
          {
            _id: "tshirt-heavy",
            name: "ثقيل (250 جم)",
            value: "heavy",
            stock: 15,
            sku: "TSH-HVY",
            weight: {
              value: 250,
              unit: "g"
            },
            price: 25
          }
        ]
      }
    ],
    variantCombinations: [
      // الأحمر مع أحجام مختلفة ووزن خفيف
      {
        _id: "comb-red-s-light",
        name: "أحمر - صغير - خفيف",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-red" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-small" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-light" }
        ],
        price: 120,
        stock: 8,
        sku: "TSH-RED-S-LIGHT",
        isAvailable: true,
        weight: { value: 150, unit: "g" },
        dimensions: { length: 65, width: 45, height: 1, unit: "cm" }
      },
      {
        _id: "comb-red-m-light",
        name: "أحمر - متوسط - خفيف",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-red" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-medium" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-light" }
        ],
        price: 120,
        stock: 12,
        sku: "TSH-RED-M-LIGHT",
        isAvailable: true,
        weight: { value: 150, unit: "g" },
        dimensions: { length: 70, width: 50, height: 1, unit: "cm" }
      },
      {
        _id: "comb-red-l-medium",
        name: "أحمر - كبير - متوسط",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-red" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-large" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-medium-weight" }
        ],
        price: 135, // 120 + 15 للوزن المتوسط
        stock: 5,
        sku: "TSH-RED-L-MED",
        isAvailable: true,
        weight: { value: 200, unit: "g" },
        dimensions: { length: 75, width: 55, height: 1, unit: "cm" }
      },
      // الأزرق مع تركيبات مختلفة
      {
        _id: "comb-blue-s-light",
        name: "أزرق - صغير - خفيف",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-blue" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-small" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-light" }
        ],
        price: 120,
        stock: 10,
        sku: "TSH-BLU-S-LIGHT",
        isAvailable: true,
        weight: { value: 150, unit: "g" },
        dimensions: { length: 65, width: 45, height: 1, unit: "cm" }
      },
      {
        _id: "comb-blue-xl-heavy",
        name: "أزرق - كبير جداً - ثقيل",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-blue" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-xlarge" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-heavy" }
        ],
        price: 145, // 120 + 25 للوزن الثقيل
        stock: 7,
        sku: "TSH-BLU-XL-HVY",
        isAvailable: true,
        weight: { value: 250, unit: "g" },
        dimensions: { length: 80, width: 60, height: 1, unit: "cm" }
      },
      // الأسود مع تركيبات محددة
      {
        _id: "comb-black-m-medium",
        name: "أسود - متوسط - متوسط",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-black" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-medium" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-medium-weight" }
        ],
        price: 135,
        stock: 15,
        sku: "TSH-BLK-M-MED",
        isAvailable: true,
        weight: { value: 200, unit: "g" },
        dimensions: { length: 70, width: 50, height: 1, unit: "cm" }
      },
      {
        _id: "comb-black-l-heavy",
        name: "أسود - كبير - ثقيل",
        attributeValues: [
          { attributeId: "tshirt-color-attr", variantId: "tshirt-black" },
          { attributeId: "tshirt-size-attr", variantId: "tshirt-large" },
          { attributeId: "tshirt-weight-attr", variantId: "tshirt-heavy" }
        ],
        price: 145,
        stock: 5,
        sku: "TSH-BLK-L-HVY",
        isAvailable: true,
        weight: { value: 250, unit: "g" },
        dimensions: { length: 75, width: 55, height: 1, unit: "cm" }
      }
    ],
    tags: ["تيشيرت", "رياضي", "تقني", "مريح", "تهوية"],
    views: 456,
    sales: 67,
    rating: 4.6,
    reviewCount: 34,
    createdAt: "2024-02-15T09:30:00Z",
    updatedAt: "2024-02-20T16:45:00Z"
  }
];

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  FaSave, 
  FaTimes, 
  FaImage, 
  FaPlus, 
  FaTrash,
  FaTags,
  FaStar,
  FaBoxOpen,
  FaCogs,
  FaLayerGroup,
  FaRulerCombined,
  FaWeight,
  FaRuler,
  FaCube,
  FaToggleOn,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { MdInventory, MdColorLens } from 'react-icons/md';
import { FaMicrochip } from 'react-icons/fa6';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import toast from 'react-hot-toast';

// Types & Interfaces
interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  mainCategory: string;
}

interface Shop {
  _id: string;
  name: string;
  logo: string;
}

interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku: string;
  images?: File[];
  isDefault?: boolean;
  hexColor?: string;
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

interface ProductAttribute {
  _id: string;
  name: string;
  type: 'color' | 'size' | 'weight' | 'material' | 'dimension' | 'capacity' | 'other';
  displayName: string;
  isRequired: boolean;
  variants: ProductVariant[];
}

interface VariantCombination {
  _id: string;
  name: string;
  attributeValues: {
    attributeId: string;
    variantId: string;
  }[];
  price: number;
  stock: number;
  sku: string;
  images?: File[];
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

interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  category: string;
  subCategory: string;
  shop: string;
  images: File[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
  attributes: ProductAttribute[];
  variantCombinations: VariantCombination[];
}

const initialFormData: ProductForm = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  sku: '',
  category: '',
  subCategory: '',
  shop: '',
  images: [],
  tags: [],
  isActive: true,
  isFeatured: false,
  hasVariants: false,
  attributes: [],
  variantCombinations: []
};

const attributeTypes = [
  { value: 'color', label: 'لون', icon: MdColorLens },
  { value: 'size', label: 'حجم', icon: FaRulerCombined },
  { value: 'weight', label: 'وزن', icon: FaWeight },
  { value: 'material', label: 'مادة', icon: FaCube },
  { value: 'dimension', label: 'أبعاد', icon: FaRuler },
  { value: 'capacity', label: 'سعة', icon: FaMicrochip },
  { value: 'other', label: 'أخرى', icon: FaCogs }
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [newTag, setNewTag] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Variants & Attributes State
  const [showVariantsSection, setShowVariantsSection] = useState(false);
  const [showCombinationsSection, setShowCombinationsSection] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState<Partial<ProductAttribute>>({
    name: '',
    type: 'color',
    displayName: '',
    isRequired: false,
    variants: []
  });
  const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariant>>({
    name: '',
    value: '',
    stock: 0,
    sku: '',
    isDefault: false
  });
  
  // Auto-generate SKU
  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  useEffect(() => {
    fetchCategories();
    fetchShops();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(sub => sub.mainCategory === formData.category);
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
    setFormData(prev => ({ ...prev, subCategory: '' }));
  }, [formData.category, subCategories]);

  // Auto-generate SKU when name changes
  useEffect(() => {
    if (formData.name && !formData.sku) {
      setFormData(prev => ({ ...prev, sku: generateSKU() }));
    }
  }, [formData.name]);

  const fetchCategories = async () => {
    try {
      // Mock data for demo
      setCategories([
        { _id: 'electronics', name: 'إلكترونيات' },
        { _id: 'clothing', name: 'ملابس' },
        { _id: 'shoes', name: 'أحذية' },
        { _id: 'books', name: 'كتب' },
        { _id: 'appliances', name: 'أجهزة كهربائية' },
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء تحميل الأقسام');
    }
  };

  const fetchSubCategories = async () => {
    try {
      // Mock data for demo
      setSubCategories([
        { _id: 'smartphones', name: 'هواتف ذكية', mainCategory: 'electronics' },
        { _id: 'laptops', name: 'لابتوب', mainCategory: 'electronics' },
        { _id: 'shirts', name: 'قمصان', mainCategory: 'clothing' },
        { _id: 'pants', name: 'بناطيل', mainCategory: 'clothing' },
      ]);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchShops = async () => {
    try {
      // Mock data for demo
      setShops([
        { _id: 'shop1', name: 'متجر التقنية الحديثة', logo: '' },
        { _id: 'shop2', name: 'موبايل برو', logo: '' },
        { _id: 'shop3', name: 'تك هب', logo: '' },
      ]);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('حدث خطأ أثناء تحميل المتاجر');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 5;
    
    if (formData.images.length + files.length > maxImages) {
      toast.error(`يمكن رفع حد أقصى ${maxImages} صور`);
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData(prev => ({ ...prev, images: newImages }));

    // Create previews
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  // Variants Management
  const addVariantToAttribute = () => {
    if (!currentVariant.name || !currentVariant.value) {
      toast.error('يرجى ملء جميع الحقول المطلوبة للمتغير');
      return;
    }

    const newVariant: ProductVariant = {
      _id: Date.now().toString(),
      name: currentVariant.name!,
      value: currentVariant.value!,
      price: currentVariant.price || 0,
      stock: currentVariant.stock || 0,
      sku: currentVariant.sku || generateSKU(),
      isDefault: currentVariant.isDefault || false,
      hexColor: currentVariant.hexColor,
      dimensions: currentVariant.dimensions,
      weight: currentVariant.weight
    };

    setCurrentAttribute(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant]
    }));

    setCurrentVariant({
      name: '',
      value: '',
      stock: 0,
      sku: '',
      isDefault: false
    });
  };

  const removeVariantFromAttribute = (variantId: string) => {
    setCurrentAttribute(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v._id !== variantId) || []
    }));
  };

  const addAttributeToProduct = () => {
    if (!currentAttribute.name || !currentAttribute.displayName || !currentAttribute.variants?.length) {
      toast.error('يرجى ملء جميع بيانات الخاصية وإضافة متغير واحد على الأقل');
      return;
    }

    const newAttribute: ProductAttribute = {
      _id: Date.now().toString(),
      name: currentAttribute.name!,
      type: currentAttribute.type!,
      displayName: currentAttribute.displayName!,
      isRequired: currentAttribute.isRequired || false,
      variants: currentAttribute.variants!
    };

    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute],
      hasVariants: true
    }));

    setCurrentAttribute({
      name: '',
      type: 'color',
      displayName: '',
      isRequired: false,
      variants: []
    });

    toast.success('تم إضافة الخاصية بنجاح');
  };

  const removeAttributeFromProduct = (attributeId: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(attr => attr._id !== attributeId),
      hasVariants: prev.attributes.length > 1
    }));
  };

  // Generate variant combinations
  const generateVariantCombinations = () => {
    if (formData.attributes.length < 2) {
      toast.error('يجب أن يكون لديك خاصيتان على الأقل لإنشاء التركيبات');
      return;
    }

    const combinations: VariantCombination[] = [];
    
    const generateCombos = (attributeIndex: number, currentCombo: any[]) => {
      if (attributeIndex === formData.attributes.length) {
        const combo: VariantCombination = {
          _id: Date.now().toString() + Math.random(),
          name: currentCombo.map(c => c.variant.name).join(' - '),
          attributeValues: currentCombo.map(c => ({
            attributeId: c.attribute._id,
            variantId: c.variant._id
          })),
          price: formData.price,
          stock: 0,
          sku: generateSKU(),
          isAvailable: true
        };
        combinations.push(combo);
        return;
      }

      const attribute = formData.attributes[attributeIndex];
      attribute.variants.forEach(variant => {
        generateCombos(attributeIndex + 1, [...currentCombo, { attribute, variant }]);
      });
    };

    generateCombos(0, []);
    
    setFormData(prev => ({
      ...prev,
      variantCombinations: combinations
    }));

    toast.success(`تم إنشاء ${combinations.length} تركيبة`);
  };

  const updateCombination = (combinationId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variantCombinations: prev.variantCombinations.map(combo =>
        combo._id === combinationId ? { ...combo, [field]: value } : combo
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category || !formData.shop) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('يرجى رفع صورة واحدة على الأقل');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('تم إنشاء المنتج بنجاح');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('حدث خطأ أثناء إنشاء المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="إضافة منتج جديد" description="إضافة منتج جديد للمنصة" />
      <PageBreadcrumb pageTitle="إضافة منتج جديد" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaArrowLeft className="ml-2 w-4 h-4" />
                  العودة للمنتجات
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FaBoxOpen className="text-2xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة منتج جديد</h1>
                    <p className="text-gray-600 dark:text-gray-400">إنشاء منتج جديد مع جميع الخصائص والمتغيرات</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="ml-2 w-4 h-4" />
                  إلغاء
                </button>
                <button
                  type="submit"
                  form="product-form"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaSave className="ml-2 w-4 h-4" />
                  )}
                  {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaInfoCircle className="ml-2 text-blue-500" />
                  المعلومات الأساسية
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم المنتج <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المنتج"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رمز المنتج (SKU) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="سيتم إنشاؤه تلقائياً"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف المنتج <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="وصف تفصيلي للمنتج..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الفئة الرئيسية <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subCategory">الفئة الفرعية</Label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={!formData.category}
                    >
                      <option value="">اختر الفئة الفرعية</option>
                      {filteredSubCategories.map(subCategory => (
                        <option key={subCategory._id} value={subCategory._id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="shop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المتجر <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="shop"
                      name="shop"
                      value={formData.shop}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">اختر المتجر</option>
                      {shops.map(shop => (
                        <option key={shop._id} value={shop._id}>
                          {shop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MdInventory className="ml-2 text-green-500" />
                  التسعير والمخزون
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      السعر (ش.ج) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step={0.01}
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">السعر الأصلي (ش.ج)</Label>
                    <input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step={0.01}
                      min="0"
                      value={formData.originalPrice || ''}
                      onChange={handleInputChange}
                      placeholder="السعر قبل الخصم"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الكمية في المخزون <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {formData.originalPrice && formData.originalPrice > formData.price && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaTags className="text-green-500 ml-2" />
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        خصم {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaImage className="ml-2 text-purple-500" />
                  صور المنتج
                </h2>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        اضغط لرفع الصور أو اسحبها هنا
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG أو JPEG (حد أقصى 5 صور)
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaTags className="ml-2 text-red-500" />
                  العلامات والكلمات المفتاحية
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="أضف علامة..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Variants */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaCogs className="ml-2 text-orange-500" />
                    خصائص ومتغيرات المنتج
                  </h2>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="hasVariants"
                        checked={formData.hasVariants}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        هذا المنتج له متغيرات
                      </span>
                    </label>
                    {formData.hasVariants && (
                      <button
                        type="button"
                        onClick={() => setShowVariantsSection(!showVariantsSection)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        {showVariantsSection ? <FaEyeSlash /> : <FaEye />}
                        {showVariantsSection ? 'إخفاء' : 'إظهار'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {formData.hasVariants && showVariantsSection && (
                <div className="p-6 space-y-6">
                  {/* Add New Attribute */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">إضافة خاصية جديدة</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor="attributeName">اسم الخاصية</Label>
                        <Input
                          id="attributeName"
                          value={currentAttribute.name || ''}
                          onChange={(e) => setCurrentAttribute(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثل: color, size..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="attributeDisplayName">الاسم المعروض</Label>
                        <Input
                          id="attributeDisplayName"
                          value={currentAttribute.displayName || ''}
                          onChange={(e) => setCurrentAttribute(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="مثل: اللون، الحجم..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="attributeType">نوع الخاصية</Label>
                        <select
                          id="attributeType"
                          value={currentAttribute.type}
                          onChange={(e) => setCurrentAttribute(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          {attributeTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentAttribute.isRequired || false}
                            onChange={(e) => setCurrentAttribute(prev => ({ ...prev, isRequired: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">مطلوب</span>
                        </label>
                      </div>
                    </div>

                    {/* Add Variants to Current Attribute */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">إضافة متغيرات للخاصية</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                        <div>
                          <Label htmlFor="variantName">اسم المتغير</Label>
                          <Input
                            id="variantName"
                            value={currentVariant.name || ''}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="أحمر، كبير..."
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="variantValue">القيمة</Label>
                          <Input
                            id="variantValue"
                            value={currentVariant.value || ''}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="#ff0000، XL..."
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="variantStock">المخزون</Label>
                          <Input
                            id="variantStock"
                            type="number"
                            value={currentVariant.stock || 0}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="variantPrice">سعر إضافي</Label>
                          <input
                            id="variantPrice"
                            type="number"
                            step={0.01}
                            value={currentVariant.price || ''}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="variantSku">SKU</Label>
                          <Input
                            id="variantSku"
                            value={currentVariant.sku || ''}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, sku: e.target.value }))}
                            placeholder="سيتم إنشاؤه تلقائياً"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={addVariantToAttribute}
                            className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Color Picker for Color Type */}
                      {currentAttribute.type === 'color' && (
                        <div className="mb-3">
                          <Label htmlFor="variantColor">لون المتغير</Label>
                          <input
                            id="variantColor"
                            type="color"
                            value={currentVariant.hexColor || '#000000'}
                            onChange={(e) => setCurrentVariant(prev => ({ ...prev, hexColor: e.target.value }))}
                            className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                        </div>
                      )}

                      {/* Show Current Attribute Variants */}
                      {currentAttribute.variants && currentAttribute.variants.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">متغيرات الخاصية الحالية:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {currentAttribute.variants.map((variant) => (
                              <div key={variant._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  {currentAttribute.type === 'color' && (
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: variant.hexColor || variant.value }}
                                    ></div>
                                  )}
                                  <span className="text-sm font-medium">{variant.name}</span>
                                  <span className="text-xs text-gray-500">({variant.stock})</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeVariantFromAttribute(variant._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={addAttributeToProduct}
                      disabled={!currentAttribute.name || !currentAttribute.displayName || !currentAttribute.variants?.length}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      إضافة الخاصية للمنتج
                    </button>
                  </div>

                  {/* Display Product Attributes */}
                  {formData.attributes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white">خصائص المنتج</h3>
                      
                      {formData.attributes.map((attribute) => (
                        <div key={attribute._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                              {(() => {
                                const attributeType = attributeTypes.find(type => type.value === attribute.type);
                                const IconComponent = attributeType?.icon || FaCogs;
                                return <IconComponent className="ml-2 text-blue-500" />;
                              })()}
                              {attribute.displayName}
                              {attribute.isRequired && <span className="text-red-500 mr-1">*</span>}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeAttributeFromProduct(attribute._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {attribute.variants.map((variant) => (
                              <div key={variant._id} className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-1">
                                  {attribute.type === 'color' && (
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: variant.hexColor || variant.value }}
                                    ></div>
                                  )}
                                  <span className="text-sm font-medium">{variant.name}</span>
                                  {variant.isDefault && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">افتراضي</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <div>المخزون: {variant.stock}</div>
                                  <div>SKU: {variant.sku}</div>
                                  {variant.price && <div>سعر إضافي: +{variant.price}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Generate Combinations Button */}
                      {formData.attributes.length >= 2 && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setShowCombinationsSection(!showCombinationsSection)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <FaLayerGroup />
                            {showCombinationsSection ? 'إخفاء التركيبات' : 'إدارة التركيبات المتقدمة'}
                            {showCombinationsSection ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Variant Combinations Section */}
                  {showCombinationsSection && formData.attributes.length >= 2 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                          <FaLayerGroup className="ml-2 text-purple-500" />
                          التركيبات المتقدمة
                        </h3>
                        <button
                          type="button"
                          onClick={generateVariantCombinations}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          إنشاء التركيبات تلقائياً
                        </button>
                      </div>

                      {formData.variantCombinations.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            تم إنشاء {formData.variantCombinations.length} تركيبة. يمكنك تعديل السعر والمخزون لكل تركيبة:
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.variantCombinations.map((combination) => (
                              <div key={combination._id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                <h4 className="font-medium text-sm mb-2">{combination.name}</h4>
                                
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <label className="text-xs text-gray-500">السعر</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={combination.price}
                                      onChange={(e) => updateCombination(combination._id, 'price', parseFloat(e.target.value) || 0)}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500">المخزون</label>
                                    <input
                                      type="number"
                                      value={combination.stock}
                                      onChange={(e) => updateCombination(combination._id, 'stock', parseInt(e.target.value) || 0)}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mb-2">
                                  <label className="text-xs text-gray-500">SKU</label>
                                  <input
                                    type="text"
                                    value={combination.sku}
                                    onChange={(e) => updateCombination(combination._id, 'sku', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <label className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={combination.isAvailable}
                                    onChange={(e) => updateCombination(combination._id, 'isAvailable', e.target.checked)}
                                    className="w-3 h-3"
                                  />
                                  متاح للبيع
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaCogs className="ml-2 text-gray-500" />
                  إعدادات المنتج
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FaToggleOn className="text-green-500 ml-3 text-xl" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">حالة المنتج</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">تفعيل أو إلغاء تفعيل المنتج</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 ml-3 text-xl" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">منتج مميز</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">إظهار في قسم المنتجات المميزة</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

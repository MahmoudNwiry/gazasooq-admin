import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  FaSave, 
  FaTimes, 
  FaImage, 
  FaPlus, 
  FaTags,
  FaStar,
  FaBoxOpen,
  FaCogs,
  FaToggleOn,
  FaInfoCircle,
  FaArrowLeft,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaPalette,
  FaRulerCombined
} from 'react-icons/fa';
import { MdInventory, MdColorLens } from 'react-icons/md';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Label from '../../components/form/Label';
import { mockProducts, type Product } from '../../data/mockProducts';
import toast from 'react-hot-toast';

// Types & Interfaces
interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku: string;
  isDefault?: boolean;
  hexColor?: string;
}

interface ProductAttribute {
  _id: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'other';
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
  isAvailable: boolean;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
  category: string;
  subCategory: string;
  shop: string;
  existingImages: string[];
  newImages: File[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
  attributes: ProductAttribute[];
  variantCombinations: VariantCombination[];
}

const categories = [
  { _id: 'electronics', name: 'إلكترونيات' },
  { _id: 'clothing', name: 'ملابس' },
  { _id: 'home', name: 'منزل ومطبخ' },
  { _id: 'books', name: 'كتب' },
  { _id: 'beauty', name: 'جمال وعناية' },
  { _id: 'sports', name: 'رياضة' },
  { _id: 'toys', name: 'ألعاب' },
  { _id: 'automotive', name: 'سيارات' }
];

const subCategories = [
  { _id: 'smartphones', name: 'هواتف ذكية', mainCategory: 'electronics' },
  { _id: 'laptops', name: 'لابتوب', mainCategory: 'electronics' },
  { _id: 'tablets', name: 'أجهزة لوحية', mainCategory: 'electronics' },
  { _id: 'mens-clothing', name: 'ملابس رجالية', mainCategory: 'clothing' },
  { _id: 'womens-clothing', name: 'ملابس نسائية', mainCategory: 'clothing' },
  { _id: 'kitchen', name: 'مطبخ', mainCategory: 'home' },
  { _id: 'bedroom', name: 'غرفة نوم', mainCategory: 'home' }
];

const shops = [
  { _id: 'tech-store', name: 'متجر التقنية', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100' },
  { _id: 'fashion-hub', name: 'مركز الموضة', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100' },
  { _id: 'home-essentials', name: 'أساسيات المنزل', logo: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100' },
  { _id: 'book-world', name: 'عالم الكتب', logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100' },
  { _id: 'beauty-corner', name: 'ركن الجمال', logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100' }
];

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Variants & Attributes State
  const [showVariantsSection, setShowVariantsSection] = useState(true);
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'color' as const,
    displayName: '',
    isRequired: false
  });
  const [newVariant, setNewVariant] = useState({
    name: '',
    value: '',
    price: 0,
    stock: 0,
    sku: '',
    hexColor: ''
  });
  
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    sku: '',
    category: '',
    subCategory: '',
    shop: '',
    existingImages: [],
    newImages: [],
    tags: [],
    isActive: true,
    isFeatured: false,
    hasVariants: false,
    attributes: [],
    variantCombinations: []
  });

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(sub => sub.mainCategory === formData.category);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // البحث عن المنتج في البيانات الوهمية
      const foundProduct = mockProducts.find(p => p._id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price,
          originalPrice: foundProduct.originalPrice || 0,
          stock: foundProduct.stock,
          sku: foundProduct.sku,
          category: foundProduct.category._id,
          subCategory: foundProduct.subCategory?._id || '',
          shop: foundProduct.shop._id,
          existingImages: foundProduct.images,
          newImages: [],
          tags: foundProduct.tags || [],
          isActive: foundProduct.isActive,
          isFeatured: foundProduct.isFeatured,
          hasVariants: false,
          attributes: [],
          variantCombinations: []
        });
      } else {
        toast.error('المنتج غير موجود');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المنتج');
      navigate('/products');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.existingImages.length === 0 && formData.newImages.length === 0) {
      toast.error('يرجى إضافة صورة واحدة على الأقل للمنتج');
      return;
    }

    try {
      setSaving(true);
      
      // محاكاة تحديث المنتج
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('تم تحديث المنتج بنجاح');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('حدث خطأ أثناء تحديث المنتج');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...files]
      }));

      // Create previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Variants Management Functions
  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.displayName) {
      toast.error('يرجى ملء جميع حقول الخاصية');
      return;
    }

    const attribute: ProductAttribute = {
      _id: Date.now().toString(),
      name: newAttribute.name,
      type: newAttribute.type,
      displayName: newAttribute.displayName,
      isRequired: newAttribute.isRequired,
      variants: []
    };

    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, attribute],
      hasVariants: true
    }));

    setNewAttribute({
      name: '',
      type: 'color',
      displayName: '',
      isRequired: false
    });

    toast.success('تم إضافة الخاصية بنجاح');
  };

  const removeAttribute = (attributeId: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(attr => attr._id !== attributeId),
      hasVariants: prev.attributes.length > 1
    }));
    toast.success('تم حذف الخاصية');
  };

  const addVariantToAttribute = (attributeId: string) => {
    if (!newVariant.name || !newVariant.value) {
      toast.error('يرجى ملء اسم وقيمة المتغير');
      return;
    }

    const variant: ProductVariant = {
      _id: Date.now().toString(),
      name: newVariant.name,
      value: newVariant.value,
      price: newVariant.price,
      stock: newVariant.stock,
      sku: newVariant.sku || generateSKU(),
      hexColor: newVariant.hexColor
    };

    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr._id === attributeId
          ? { ...attr, variants: [...attr.variants, variant] }
          : attr
      )
    }));

    setNewVariant({
      name: '',
      value: '',
      price: 0,
      stock: 0,
      sku: '',
      hexColor: ''
    });

    toast.success('تم إضافة المتغير بنجاح');
  };

  const removeVariantFromAttribute = (attributeId: string, variantId: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr._id === attributeId
          ? { ...attr, variants: attr.variants.filter(v => v._id !== variantId) }
          : attr
      )
    }));
    toast.success('تم حذف المتغير');
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaBoxOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">المنتج غير موجود</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">المنتج الذي تحاول تعديله غير متوفر</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="ml-2 w-4 h-4" />
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`تعديل المنتج - ${product.name}`} description={`تعديل بيانات المنتج ${product.name}`} />
      <PageBreadcrumb pageTitle={`تعديل ${product.name}`} />
      
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
                  <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                    <FaBoxOpen className="text-2xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل المنتج</h1>
                    <p className="text-gray-600 dark:text-gray-400">تحديث بيانات {product.name}</p>
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
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaSave className="ml-2 w-4 h-4" />
                  )}
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
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
                    <Label htmlFor="name">اسم المنتج *</Label>
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
                    <Label htmlFor="sku">رمز المنتج (SKU) *</Label>
                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="رمز المنتج"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">وصف المنتج *</Label>
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
                    <Label htmlFor="category">الفئة الرئيسية *</Label>
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
                    <Label htmlFor="shop">المتجر *</Label>
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
                    <Label htmlFor="price">السعر (ش.ج) *</Label>
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
                    <Label htmlFor="stock">الكمية في المخزون *</Label>
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
                {/* Existing Images */}
                {formData.existingImages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الصور الحالية</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.existingImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        اضغط لرفع صور جديدة أو اسحبها هنا
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
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الصور الجديدة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`صورة جديدة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="أضف علامة..."
                    onKeyDown={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addTag}
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

            {/* Product Variants & Combinations */}
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
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FaPlus className="ml-2 text-green-500" />
                      إضافة خاصية جديدة
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor="attributeName">اسم الخاصية</Label>
                        <input
                          id="attributeName"
                          type="text"
                          value={newAttribute.name}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثل: اللون"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="attributeDisplayName">الاسم المعروض</Label>
                        <input
                          id="attributeDisplayName"
                          type="text"
                          value={newAttribute.displayName}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="مثل: اختر اللون"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="attributeType">نوع الخاصية</Label>
                        <select
                          id="attributeType"
                          value={newAttribute.type}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        >
                          <option value="color">لون</option>
                          <option value="size">حجم</option>
                          <option value="material">مادة</option>
                          <option value="other">أخرى</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addAttribute}
                          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                        >
                          <FaPlus className="ml-2" />
                          إضافة
                        </button>
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newAttribute.isRequired}
                        onChange={(e) => setNewAttribute(prev => ({ ...prev, isRequired: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        خاصية مطلوبة
                      </span>
                    </label>
                  </div>

                  {/* Existing Attributes */}
                  {formData.attributes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">الخصائص الحالية</h3>
                      
                      {formData.attributes.map((attribute) => (
                        <div key={attribute._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {attribute.type === 'color' && <MdColorLens className="text-red-500" />}
                              {attribute.type === 'size' && <FaRulerCombined className="text-blue-500" />}
                              {attribute.type === 'material' && <FaCogs className="text-gray-500" />}
                              {attribute.type === 'other' && <FaPalette className="text-purple-500" />}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{attribute.displayName}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {attribute.name} • {attribute.isRequired ? 'مطلوب' : 'اختياري'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttribute(attribute._id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>

                          {/* Add Variant to Attribute */}
                          <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3 mb-3">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">إضافة متغير جديد</h5>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                              <div>
                                <input
                                  type="text"
                                  value={newVariant.name}
                                  onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="اسم المتغير"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={newVariant.value}
                                  onChange={(e) => setNewVariant(prev => ({ ...prev, value: e.target.value }))}
                                  placeholder="القيمة"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              {attribute.type === 'color' && (
                                <div>
                                  <input
                                    type="color"
                                    value={newVariant.hexColor}
                                    onChange={(e) => setNewVariant(prev => ({ ...prev, hexColor: e.target.value }))}
                                    className="w-full h-8 border border-gray-300 dark:border-gray-500 rounded"
                                  />
                                </div>
                              )}
                              <div>
                                <input
                                  type="number"
                                  value={newVariant.stock}
                                  onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                  placeholder="المخزون"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={newVariant.sku}
                                  onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                                  placeholder="SKU (اختياري)"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => addVariantToAttribute(attribute._id)}
                                  className="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                  إضافة
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Existing Variants */}
                          {attribute.variants.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">المتغيرات الحالية:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {attribute.variants.map((variant) => (
                                  <div key={variant._id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-500">
                                    <div className="flex items-center gap-2">
                                      {variant.hexColor && (
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-300"
                                          style={{ backgroundColor: variant.hexColor }}
                                        />
                                      )}
                                      <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{variant.name}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          المخزون: {variant.stock} • SKU: {variant.sku}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeVariantFromAttribute(attribute._id, variant._id)}
                                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    >
                                      <FaTimes className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Generate Combinations */}
                  {formData.attributes.length >= 2 && formData.attributes.every(attr => attr.variants.length > 0) && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">تركيبات المتغيرات</h3>
                        <button
                          type="button"
                          onClick={generateVariantCombinations}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                        >
                          <FaCogs className="ml-2" />
                          إنشاء التركيبات
                        </button>
                      </div>

                      {formData.variantCombinations.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            تم إنشاء {formData.variantCombinations.length} تركيبة
                          </p>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {formData.variantCombinations.map((combination) => (
                              <div key={combination._id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{combination.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {combination.sku}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-center">
                                    <input
                                      type="number"
                                      value={combination.price}
                                      onChange={(e) => updateCombination(combination._id, 'price', parseFloat(e.target.value) || 0)}
                                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                      placeholder="السعر"
                                    />
                                    <p className="text-xs text-gray-500">السعر</p>
                                  </div>
                                  <div className="text-center">
                                    <input
                                      type="number"
                                      value={combination.stock}
                                      onChange={(e) => updateCombination(combination._id, 'stock', parseInt(e.target.value) || 0)}
                                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                      placeholder="المخزون"
                                    />
                                    <p className="text-xs text-gray-500">المخزون</p>
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={combination.isAvailable}
                                      onChange={(e) => updateCombination(combination._id, 'isAvailable', e.target.checked)}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">متاح</span>
                                  </label>
                                </div>
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

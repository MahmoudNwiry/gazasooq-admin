import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  FaSave, 
  FaTimes, 
  FaImage, 
  FaPlus, 
  FaTags,
  FaStar,
  FaBoxOpen,
  FaArrowLeft
} from 'react-icons/fa';
import { MdInventory, MdCategory } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import PageMeta from '../../components/common/PageMeta';
import { SimpleLoader } from '../../components/common';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { mockProducts, type Product } from '../../data/mockProducts';
import toast from 'react-hot-toast';

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
    isFeatured: false
  });

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
          isFeatured: foundProduct.isFeatured
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SimpleLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
        <FaBoxOpen size={64} className="mb-4" />
        <h3 className="text-xl font-semibold mb-2">المنتج غير موجود</h3>
        <p className="mb-4">المنتج الذي تحاول تعديله غير متوفر</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`تعديل المنتج - ${product.name}`} description={`تعديل بيانات المنتج ${product.name}`} />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              {/* Navigation & Breadcrumb */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors"
                >
                  <FaArrowLeft className="ml-2 w-4 h-4" />
                  العودة للمنتجات
                </button>
                
                {/* Breadcrumb */}
                <nav className="hidden sm:flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 space-x-reverse">
                    <li>
                      <Link to="/" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors">
                        الرئيسية
                      </Link>
                    </li>
                    <li>
                      <span className="text-gray-300 dark:text-gray-600 mx-2">/</span>
                      <Link to="/products" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors">
                        المنتجات
                      </Link>
                    </li>
                    <li>
                      <span className="text-gray-300 dark:text-gray-600 mx-2">/</span>
                      <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                        تعديل المنتج
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Title */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل المنتج</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaBoxOpen className="ml-2 text-brand-500" />
                    المعلومات الأساسية
                  </h2>                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم المنتج *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل اسم المنتج"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sku">رمز المنتج (SKU) *</Label>
                    <Input
                      id="sku"
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="أدخل رمز المنتج"
                    />
                  </div>
                </div>
                
                  <div>
                    <Label htmlFor="description">وصف المنتج *</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="أدخل وصف المنتج"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <BiMoney className="text-brand-500 ml-2 text-xl" />
                    التسعير
                  </h2>                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">السعر الحالي (دولار) *</Label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="originalPrice">السعر الأصلي (دولار)</Label>
                      <input
                        id="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">اتركه فارغاً إذا لم يكن هناك خصم</p>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <MdInventory className="ml-2 text-brand-500" />
                    المخزون
                  </h2>                <div>
                  <Label htmlFor="stock">الكمية المتوفرة *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

                {/* Images */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaImage className="ml-2 text-brand-500" />
                    صور المنتج
                  </h2>                {/* Existing Images */}
                {formData.existingImages.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">الصور الحالية</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`المنتج ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Images */}
                {formData.newImages.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">الصور الجديدة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.newImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`جديدة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <FaPlus className="ml-2" />
                      إضافة صور
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaTags className="ml-2 text-brand-500" />
                    العلامات
                  </h2>                <div className="space-y-3">
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="أدخل علامة جديدة"
                      className="flex-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                    >
                      إضافة
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="mr-1 text-gray-500 hover:text-red-500"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <MdCategory className="ml-2 text-brand-500" />
                    التصنيف
                  </h2>                <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">الفئة الرئيسية *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      <Label htmlFor="shop">المتجر *</Label>
                      <select
                        id="shop"
                        value={formData.shop}
                        onChange={(e) => setFormData(prev => ({ ...prev, shop: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

                {/* Product Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaStar className="ml-2 text-brand-500" />
                    حالة المنتج
                  </h2>                <div className="space-y-3">
                  <label className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">منتج مفعل</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">منتج مميز</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand text-white py-2 px-4 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave className="ml-2" />
                      حفظ التغييرات
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <FaTimes className="ml-2" />
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

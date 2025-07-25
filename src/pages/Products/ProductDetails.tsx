import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaStar,
  FaBoxOpen,
  FaToggleOn,
  FaToggleOff,
  FaRegStar,
  FaTimes,
  FaShare,
  FaExclamationTriangle,
  FaStore,
  FaCalendarAlt,
  FaHeart,
  FaShoppingCart,
  FaCogs,
  FaRulerCombined,
  FaWeight,
  FaRuler,
  FaCube,
  FaTags,
  FaLayerGroup
} from 'react-icons/fa';
import { MdInventory, MdCategory, MdVisibility } from 'react-icons/md';
import { FaMicrochip } from 'react-icons/fa6';
import PageMeta from '../../components/common/PageMeta';
import { SimpleLoader } from '../../components/common';
import { Modal } from '../../components/ui/modal';
import { mockProducts, type Product } from '../../data/mockProducts';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // البحث عن المنتج في البيانات الوهمية
      const foundProduct = mockProducts.find(p => p._id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('المنتج غير موجود');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('حدث خطأ أثناء تحميل تفاصيل المنتج');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    
    try {
      const newStatus = !product.isActive;
      
      // محاكاة تحديث البيانات
      setProduct(prev => prev ? { ...prev, isActive: newStatus } : null);
      toast.success(`تم ${newStatus ? 'تفعيل' : 'إلغاء تفعيل'} المنتج بنجاح`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة المنتج');
    }
  };

  const handleToggleFeatured = async () => {
    if (!product) return;
    
    try {
      const newFeaturedStatus = !product.isFeatured;
      
      // محاكاة تحديث البيانات
      setProduct(prev => prev ? { ...prev, isFeatured: newFeaturedStatus } : null);
      toast.success(`تم ${newFeaturedStatus ? 'إضافة' : 'إزالة'} المنتج ${newFeaturedStatus ? 'إلى' : 'من'} المميزة بنجاح`);
    } catch (error) {
      console.error('Error toggling product featured status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة التميز');
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    try {
      setDeleting(true);
      
      // محاكاة حذف المنتج
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تم حذف المنتج بنجاح');
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('حدث خطأ أثناء حذف المنتج');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCopyProductUrl = () => {
    const productUrl = `${window.location.origin}/products/${product?._id}`;
    navigator.clipboard.writeText(productUrl);
    toast.success('تم نسخ رابط المنتج بنجاح');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: `${window.location.origin}/products/${product?._id}`,
      });
    } else {
      handleCopyProductUrl();
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const getDiscountPercentage = () => {
    if (product?.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PS', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-PS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
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
        <p className="mb-4">المنتج الذي تبحث عنه غير متوفر</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`تفاصيل المنتج - ${product.name}`} description={product.description} />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              {/* Navigation & Breadcrumb */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                        {product.name}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Link
                  to={`/products/edit/${product._id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FaEdit className="ml-2 w-4 h-4" />
                  تعديل
                </Link>
                <button
                  onClick={handleShareProduct}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FaShare className="ml-2 w-4 h-4" />
                  مشاركة
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <FaTrash className="ml-2 w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images & Gallery */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square relative group">
                  <img
                    src={product.images[currentImageIndex] || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                  
                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </>
                  )}

                  {/* Status Badges */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    {product.isFeatured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <FaStar className="w-3 h-3 ml-1" />
                        مميز
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {getDiscountPercentage() > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                        خصم {getDiscountPercentage()}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {product.images.length > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex
                              ? 'border-blue-500'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      رقم المنتج: {product._id}
                    </p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={handleToggleFeatured}
                      className={`p-2 rounded-lg transition-colors ${
                        product.isFeatured
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600'
                      }`}
                      title={product.isFeatured ? 'إزالة من المميزة' : 'إضافة للمميزة'}
                    >
                      {product.isFeatured ? <FaStar className="w-5 h-5" /> : <FaRegStar className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleToggleActive}
                      className={`p-2 rounded-lg transition-colors ${
                        product.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600'
                      }`}
                      title={product.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      {product.isActive ? <FaToggleOn className="w-5 h-5" /> : <FaToggleOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Price Information */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 space-x-reverse mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {getDiscountPercentage() > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      توفر {formatPrice(product.originalPrice! - product.price)} ({getDiscountPercentage()}% خصم)
                    </p>
                  )}
                </div>

                {/* Product Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">وصف المنتج</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MdCategory className="w-5 h-5 text-blue-500 ml-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">الفئة</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{product.category.name}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FaStore className="w-5 h-5 text-green-500 ml-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">المتجر</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{product.shop.name}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MdInventory className="w-5 h-5 text-orange-500 ml-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">المخزون</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{product.stock} قطعة</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="w-5 h-5 text-purple-500 ml-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">تاريخ الإضافة</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <MdVisibility className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                      </div>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">المشاهدات</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <FaShoppingCart className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                      </div>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">المبيعات</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">89</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <FaHeart className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                      </div>
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">المفضلة</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">456</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Variants Section */}
              {product.hasVariants && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    {product.variantCombinations && product.variantCombinations.length > 0 ? (
                      <FaLayerGroup className="w-5 h-5 text-brand-500 ml-2" />
                    ) : (
                      <FaCogs className="w-5 h-5 text-brand-500 ml-2" />
                    )}
                    {product.variantCombinations && product.variantCombinations.length > 0 
                      ? 'تركيبات المتغيرات المتقدمة' 
                      : 'خصائص ومتغيرات المنتج'
                    }
                  </h3>
                  
                  {/* عرض التركيبات المتقدمة */}
                  {product.variantCombinations && product.variantCombinations.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          <strong>تركيبات متقدمة:</strong> هذا المنتج يحتوي على {product.variantCombinations.length} تركيبة مختلفة من الخصائص المتاحة.
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          كل تركيبة تجمع بين عدة خصائص مثل اللون والحجم والوزن بأسعار ومخزون منفصل.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {product.variantCombinations.map((combination) => (
                          <div
                            key={combination._id}
                            className={`relative border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                              combination.isAvailable
                                ? 'border-green-200 dark:border-green-800 bg-white dark:bg-gray-800'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-75'
                            }`}
                          >
                            {!combination.isAvailable && (
                              <div className="absolute -top-2 -right-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                  غير متاح
                                </span>
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                {combination.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                رمز المنتج: {combination.sku}
                              </p>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              {combination.attributeValues.map((attrValue) => {
                                const attribute = product.attributes?.find(attr => attr._id === attrValue.attributeId);
                                const variant = attribute?.variants.find(v => v._id === attrValue.variantId);
                                
                                if (!attribute || !variant) return null;
                                
                                return (
                                  <div key={attrValue.attributeId} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">{attribute.displayName}:</span>
                                    <div className="flex items-center gap-1">
                                      {attribute.type === 'color' && (
                                        <div
                                          className="w-3 h-3 rounded-full border border-gray-300"
                                          style={{ backgroundColor: variant.hexColor || variant.value }}
                                        ></div>
                                      )}
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {variant.name}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">السعر</p>
                                <p className="font-bold text-lg text-green-600 dark:text-green-400">
                                  {formatPrice(combination.price)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">المخزون</p>
                                <p className={`font-bold text-lg ${
                                  combination.stock > 10 ? 'text-green-600' : 
                                  combination.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {combination.stock}
                                </p>
                              </div>
                            </div>
                            
                            {(combination.weight || combination.dimensions) && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between items-center text-xs">
                                  {combination.weight && (
                                    <div className="flex items-center gap-1">
                                      <FaWeight className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {combination.weight.value} {combination.weight.unit}
                                      </span>
                                    </div>
                                  )}
                                  {combination.dimensions && (
                                    <div className="flex items-center gap-1">
                                      <FaRuler className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {combination.dimensions.length}×{combination.dimensions.width}×{combination.dimensions.height} {combination.dimensions.unit}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    ) : (
                    /* عرض المتغيرات البسيطة */
                    product.attributes && product.attributes.length > 0 && (
                      <div className="space-y-6">
                        {product.attributes.map((attribute) => (
                          <div key={attribute._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                              {attribute.type === 'color' && <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-full ml-2"></div>}
                              {attribute.type === 'size' && <FaRulerCombined className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.type === 'capacity' && <FaMicrochip className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.type === 'weight' && <FaWeight className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.type === 'dimension' && <FaRuler className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.type === 'material' && <FaCube className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.type === 'other' && <FaCogs className="w-4 h-4 text-brand-500 ml-2" />}
                              {attribute.displayName}
                              {attribute.isRequired && (
                                <span className="text-red-500 mr-1">*</span>
                              )}
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {attribute.variants.map((variant) => (
                                <div
                                  key={variant._id}
                                  className={`relative p-3 border-2 rounded-lg transition-all hover:shadow-md ${
                                    variant.isDefault
                                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                                  }`}
                                >
                                  {variant.isDefault && (
                                    <div className="absolute -top-2 -right-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-500 text-white">
                                        افتراضي
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      {attribute.type === 'color' && (
                                        <div
                                          className="w-6 h-6 rounded-full border-2 border-gray-300 ml-2"
                                          style={{ backgroundColor: variant.value }}
                                        ></div>
                                      )}
                                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                                        {variant.name}
                                      </span>
                                    </div>
                                    
                                    {variant.price && variant.price > 0 && (
                                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                        +{formatPrice(variant.price)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <div className="flex justify-between">
                                      <span>الكمية:</span>
                                      <span className={`font-medium ${
                                        variant.stock > 10 ? 'text-green-600' : 
                                        variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                      }`}>
                                        {variant.stock}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>الكود:</span>
                                      <span className="font-mono">{variant.sku}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Tags Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FaTags className="w-5 h-5 text-brand-500 ml-2" />
                  العلامات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      >
        <div className="relative max-w-4xl mx-auto">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </>
          )}

          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 left-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center ml-4">
              <FaExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              تأكيد الحذف
            </h3>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            هل أنت متأكد من أنك تريد حذف المنتج "<span className="font-semibold text-gray-900 dark:text-white">{product.name}</span>"؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? 'جاري الحذف...' : 'حذف'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaBoxOpen,
  FaDownload,
  FaUpload,
  FaStar,
  FaTags,
  FaStore,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import { MdInventory, MdOutlineCategory } from 'react-icons/md';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { SimpleLoader } from '../../components/common';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/modal';
import BulkActions from '../../components/Products/BulkActions';
import ExportProducts from '../../components/Products/ExportProducts';
import ImportProducts from '../../components/Products/ImportProducts';
import { mockProducts } from '../../data/mockProducts';
import '../../styles/product-variants.css';

// بيانات وهمية للفئات والمتاجر
const mockCategories = [
  { _id: 'electronics', name: 'إلكترونيات' },
  { _id: 'clothing', name: 'ملابس' },
  { _id: 'shoes', name: 'أحذية' },
  { _id: 'books', name: 'كتب' },
  { _id: 'appliances', name: 'أجهزة كهربائية' },
  { _id: 'furniture', name: 'أثاث' },
  { _id: 'accessories', name: 'إكسسوارات' }
];

const mockShops = [
  { _id: 'shop1', name: 'متجر التقنية الحديثة' },
  { _id: 'shop2', name: 'موبايل برو' },
  { _id: 'shop3', name: 'تك هب' },
  { _id: 'shop4', name: 'أزياء العصر' },
  { _id: 'shop5', name: 'الصوت المثالي' },
  { _id: 'shop6', name: 'سبورت بلس' },
  { _id: 'shop7', name: 'مكتبة العلوم' },
  { _id: 'shop8', name: 'الأجهزة الذكية' },
  { _id: 'shop9', name: 'أثاث العصر' }
];

const getProductStats = () => {
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter(p => p.isActive).length;
  const outOfStock = mockProducts.filter(p => p.stock === 0).length;
  const featuredProducts = mockProducts.filter(p => p.isFeatured).length;
  
  return {
    totalProducts,
    activeProducts,
    outOfStock,
    featuredProducts
  };
};

interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku: string;
  images?: string[];
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

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  subCategory?: {
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
  attributes?: ProductAttribute[];
  variantCombinations?: VariantCombination[];
  rating?: number;
  reviewCount?: number;
  tags: string[];
  views?: number;
  sales?: number;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  category: string;
  shop: string;
  status: string;
  featured: string;
  priceMin: string;
  priceMax: string;
  stockMin: string;
  stockMax: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    shop: '',
    status: '',
    featured: '',
    priceMin: '',
    priceMax: '',
    stockMin: '',
    stockMax: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Categories and shops for filters
  const [categories, setCategories] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchShops();
  }, []);

  useEffect(() => {
    setShowBulkActions(selectedProducts.length > 0);
  }, [selectedProducts]);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      
      // محاكاة تأخير التحميل
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // فلترة البيانات الوهمية حسب المعايير
      let filteredProducts = [...mockProducts];
      
      // البحث في الاسم والوصف والرمز
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm)
        );
      }
      
      // فلترة حسب الفئة
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category._id === filters.category
        );
      }
      
      // فلترة حسب المتجر
      if (filters.shop) {
        filteredProducts = filteredProducts.filter(product => 
          product.shop._id === filters.shop
        );
      }
      
      // فلترة حسب الحالة
      if (filters.status) {
        if (filters.status === 'active') {
          filteredProducts = filteredProducts.filter(product => product.isActive);
        } else if (filters.status === 'inactive') {
          filteredProducts = filteredProducts.filter(product => !product.isActive);
        } else if (filters.status === 'out_of_stock') {
          filteredProducts = filteredProducts.filter(product => product.stock === 0);
        } else if (filters.status === 'low_stock') {
          filteredProducts = filteredProducts.filter(product => product.stock > 0 && product.stock <= 10);
        }
      }
      
      // فلترة حسب المنتجات المميزة
      if (filters.featured === 'true') {
        filteredProducts = filteredProducts.filter(product => product.isFeatured);
      } else if (filters.featured === 'false') {
        filteredProducts = filteredProducts.filter(product => !product.isFeatured);
      }
      
      // فلترة حسب السعر
      if (filters.priceMin) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= parseFloat(filters.priceMin)
        );
      }
      if (filters.priceMax) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= parseFloat(filters.priceMax)
        );
      }
      
      // فلترة حسب المخزون
      if (filters.stockMin) {
        filteredProducts = filteredProducts.filter(product => 
          product.stock >= parseInt(filters.stockMin)
        );
      }
      if (filters.stockMax) {
        filteredProducts = filteredProducts.filter(product => 
          product.stock <= parseInt(filters.stockMax)
        );
      }
      
      // حساب التصفح
      const limit = 12;
      const total = filteredProducts.length;
      const totalPagesCount = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      setProducts(paginatedProducts);
      setCurrentPage(page);
      setTotalPages(totalPagesCount);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('حدث خطأ أثناء تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchShops = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setShops(mockShops);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      shop: '',
      status: '',
      featured: '',
      priceMin: '',
      priceMax: '',
      stockMin: '',
      stockMax: ''
    });
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setDeletingId(productToDelete._id);
      await axiosInstance.delete(`/admin/products/${productToDelete._id}`);
      toast.success('تم حذف المنتج بنجاح');
      fetchProducts(currentPage);
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('حدث خطأ أثناء حذف المنتج');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchProducts(page);
    }
  };

  const getStatusBadge = (product: Product) => {
    if (!product.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-xs font-medium">
          <FaTimesCircle className="w-3 h-3" />
          غير نشط
        </span>
      );
    }
    
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-lg text-xs font-medium">
          <FaExclamationTriangle className="w-3 h-3" />
          نفد المخزون
        </span>
      );
    }
    
    if (product.stock <= 10) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg text-xs font-medium">
          <FaExclamationTriangle className="w-3 h-3" />
          مخزون منخفض
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-xs font-medium">
        <FaCheckCircle className="w-3 h-3" />
        متاح
      </span>
    );
  };

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          عرض {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalProducts)} من {totalProducts} منتج
        </div>
        <div className="flex items-center gap-2">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...' || page === currentPage}
              className={`
                px-3 py-2 rounded-lg font-medium transition-all duration-200
                ${page === currentPage
                  ? 'bg-blue-500 text-white shadow-lg'
                  : page === '...'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div>
        <PageMeta title="إدارة المنتجات" description="إدارة المنتجات في المنصة" />
        <PageBreadcrumb pageTitle="إدارة المنتجات" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <SimpleLoader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta title="إدارة المنتجات" description="إدارة المنتجات في المنصة" />
      <PageBreadcrumb pageTitle="إدارة المنتجات" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FaBoxOpen className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المنتجات</h1>
              <p className="text-gray-600 dark:text-gray-400">إدارة المنتجات والمخزون</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              <FaUpload className="text-sm" />
              استيراد
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <FaDownload className="text-sm" />
              تصدير
            </button>
            <Link
              to="/products/add"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaPlus className="text-sm" />
              إضافة منتج جديد
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المنتجات..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <FaFilter />
              فلاتر
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <FaSearch />
              بحث
            </button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    القسم
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">جميع الأقسام</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المتجر
                  </label>
                  <select
                    value={filters.shop}
                    onChange={(e) => handleFilterChange('shop', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">جميع المتاجر</option>
                    {shops.map(shop => (
                      <option key={shop._id} value={shop._id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الحالة
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="out_of_stock">نفد المخزون</option>
                    <option value="low_stock">مخزون منخفض</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مميز
                  </label>
                  <select
                    value={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">الكل</option>
                    <option value="true">مميز</option>
                    <option value="false">غير مميز</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    أقل سعر
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    أعلى سعر
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    أقل مخزون
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.stockMin}
                    onChange={(e) => handleFilterChange('stockMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    أعلى مخزون
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filters.stockMax}
                    onChange={(e) => handleFilterChange('stockMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  مسح الفلاتر
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{getProductStats().totalProducts}</p>
              </div>
              <MdInventory className="text-3xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">المنتجات النشطة</p>
                <p className="text-2xl font-bold">{getProductStats().activeProducts}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">نفد المخزون</p>
                <p className="text-2xl font-bold">{getProductStats().outOfStock}</p>
              </div>
              <FaExclamationTriangle className="text-3xl text-orange-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">المنتجات المميزة</p>
                <p className="text-2xl font-bold">{getProductStats().featuredProducts}</p>
              </div>
              <FaStar className="text-3xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBoxOpen className="text-4xl text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">لا توجد منتجات</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {Object.values(filters).some(filter => filter) 
                    ? 'لم يتم العثور على منتجات تطابق معايير البحث المحددة. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.'
                    : 'ابدأ رحلتك التجارية بإضافة أول منتج للمتجر. يمكنك إضافة المنتجات بسهولة وإدارتها بفعالية.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!Object.values(filters).some(filter => filter) && (
                    <Link
                      to="/products/add"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span className="font-medium">إضافة منتج جديد</span>
                    </Link>
                  )}
                  {Object.values(filters).some(filter => filter) && (
                    <button
                      onClick={() => {
                        setFilters({
                          search: '',
                          category: '',
                          shop: '',
                          status: '',
                          featured: '',
                          priceMin: '',
                          priceMax: '',
                          stockMin: '',
                          stockMax: ''
                        });
                        fetchProducts(1);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span className="font-medium">مسح الفلاتر</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Selection */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    تحديد الكل ({products.length})
                  </span>
                </label>
                {selectedProducts.length > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    تم تحديد {selectedProducts.length} منتج
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                عرض {products.length} من {totalProducts} منتج
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col relative"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-20">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 shadow-sm"
                      />
                    </div>
                    
                    {/* Featured Badge */}
                    {product.isFeatured && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-xs font-semibold shadow-lg">
                          <FaStar className="w-3 h-3" />
                          مميز
                        </span>
                      </div>
                    )}

                    {/* Variants Indicator */}
                    {product.hasVariants && product.attributes && (
                      <div className="absolute bottom-3 left-3 z-20">
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer group-hover:scale-110 variant-indicator breathing-glow">
                          <FaTags className="w-3 h-3" />
                          <span>{product.attributes.length} متغير</span>
                          <div className="w-1.5 h-1.5 bg-white/70 rounded-full floating-dot ml-1"></div>
                          <div className="text-xs opacity-75 border-l border-white/30 pl-2 ml-1">
                            {product.variantCombinations?.length || 0} تركيبة
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Product Image */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300/ef4444/ffffff?text=${encodeURIComponent(product.name.substring(0, 10))}`;
                      }}
                    />
                    
                    {/* Stock Status Overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <div className="text-center">
                          <FaExclamationTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            نفد المخزون
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-3 bg-white dark:bg-gray-800 text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-110"
                          title="عرض التفاصيل"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="p-3 bg-white dark:bg-gray-800 text-green-600 rounded-lg shadow-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-110"
                          title="تعديل المنتج"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-3 bg-white dark:bg-gray-800 text-red-600 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                          title="حذف المنتج"
                          disabled={deletingId === product._id}
                        >
                          {deletingId === product._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Status and Discount Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(product)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-semibold shadow-sm">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-xl leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Product Description */}
                    <p className="text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Product Details */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MdOutlineCategory className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{product.category.name}</span>
                        {product.subCategory && (
                          <>
                            <span className="text-gray-400 mx-1">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{product.subCategory.name}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <FaStore className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{product.shop.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MdInventory className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">المخزون:</span>
                        <span className={`font-semibold ${
                          product.stock === 0 ? 'text-red-600 dark:text-red-400' : 
                          product.stock <= 10 ? 'text-orange-600 dark:text-orange-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {product.stock === 0 ? 'نفد المخزون' : `${product.stock} قطعة`}
                        </span>
                      </div>

                      {/* Quick Variants Info */}
                      {product.hasVariants && product.attributes && (
                        <div className="relative">
                          <div className="variants-hover-trigger flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-300">
                            <FaTags className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                              {product.attributes.length} متغير • {product.variantCombinations?.length || 0} تركيبة
                            </span>
                          </div>
                          
                          <div className="variants-hover-content absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 max-w-[calc(100vw-40px)] bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/30 p-4 opacity-0 invisible transition-all duration-300 z-50">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/20">
                              <div className="p-2 bg-white/10 rounded-lg">
                                <FaTags className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">متغيرات المنتج</h4>
                                <div className="text-xs text-white/60">اختر من الخيارات المتاحة</div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                              {product.attributes.map((attr) => (
                                <div key={attr._id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white/90 text-sm font-semibold">{attr.displayName}</span>
                                    <span className="text-xs text-white/60 bg-white/15 px-2 py-0.5 rounded-full">
                                      {attr.variants.length} خيار
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1.5">
                                    {attr.variants.slice(0, 5).map((variant) => (
                                      <span key={variant._id} className="bg-white/15 hover:bg-white/25 rounded-lg px-2 py-1 text-white text-xs font-medium cursor-pointer transition-all duration-200">
                                        {attr.type === 'color' ? (
                                          <div className="flex items-center gap-1">
                                            <div
                                              className="w-3 h-3 rounded-full border border-white/50"
                                              style={{ backgroundColor: variant.value }}
                                            />
                                            {variant.name.split(' ')[0]}
                                          </div>
                                        ) : (
                                          variant.value
                                        )}
                                      </span>
                                    ))}
                                    {attr.variants.length > 5 && (
                                      <span className="text-white/70 text-xs bg-white/10 rounded-lg px-2 py-1">
                                        +{attr.variants.length - 5} أخرى
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {product.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">ش.ج</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">شامل الضريبة</span>
                        </div>
                        
                        {product.rating && (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-gray-900 dark:text-white">{product.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount || 0})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2">
                          <FaTags className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">العلامات</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-200 dark:border-red-800"
                            >
                              #{tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
                              +{product.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <FaEye className="w-3 h-3" />
                        <span>{product.views || 0} مشاهدة</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{new Date(product.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PaginationComponent />
          </>
        )}

        {/* Bulk Actions */}
        {showBulkActions && (
          <BulkActions
            selectedProducts={selectedProducts}
            onClearSelection={() => setSelectedProducts([])}
            onRefresh={() => fetchProducts(currentPage)}
          />
        )}

        {/* Export Modal */}
        <ExportProducts
          products={products}
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />

        {/* Import Modal */}
        <ImportProducts
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => fetchProducts(currentPage)}
        />

        {/* Delete Confirmation Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-md z-[9999]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500 rounded-lg">
                <FaTrash className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">حذف المنتج</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              هل أنت متأكد من رغبتك في حذف المنتج "{productToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
              >
                <FaTimes className="text-sm" />
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === productToDelete?._id}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <FaTrash className="text-sm" />
                {deletingId === productToDelete?._id ? "جاري الحذف..." : "حذف نهائياً"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

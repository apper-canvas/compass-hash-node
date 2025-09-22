import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Modal from '@/components/molecules/Modal';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';

const Companies = () => {
  // State management
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [industries, setIndustries] = useState([]);
  const [sortBy, setSortBy] = useState('Name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    Name: '',
    Industry: '',
    Website: '',
    Phone: '',
    Email: '',
    Address: '',
    City: '',
    State: '',
    Country: 'United States',
    PostalCode: '',
    EmployeeCount: '',
    AnnualRevenue: '',
    Founded: '',
    Description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Load companies and industries on component mount
  useEffect(() => {
    loadCompanies();
    loadIndustries();
  }, []);

  // Reload companies when filters change
  useEffect(() => {
    loadCompanies();
  }, [searchTerm, selectedIndustry, sortBy, sortOrder]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchTerm,
        industry: selectedIndustry,
        sortBy,
        sortOrder
      };
      
      const data = await companyService.getAll(filters);
      setCompanies(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadIndustries = async () => {
    try {
      const data = await companyService.getIndustries();
      setIndustries(data);
    } catch (err) {
      console.error('Error loading industries:', err);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  // Form handling
  const resetForm = () => {
    setFormData({
      Name: '',
      Industry: '',
      Website: '',
      Phone: '',
      Email: '',
      Address: '',
      City: '',
      State: '',
      Country: 'United States',
      PostalCode: '',
      EmployeeCount: '',
      AnnualRevenue: '',
      Founded: '',
      Description: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.Name.trim()) {
      errors.Name = 'Company name is required';
    }
    
    if (!formData.Industry.trim()) {
      errors.Industry = 'Industry is required';
    }
    
    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email)) {
      errors.Email = 'Invalid email format';
    }
    
    if (formData.Website && !/^https?:\/\/.+/.test(formData.Website)) {
      errors.Website = 'Website must start with http:// or https://';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddCompany = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setFormData({
      Name: company.Name || '',
      Industry: company.Industry || '',
      Website: company.Website || '',
      Phone: company.Phone || '',
      Email: company.Email || '',
      Address: company.Address || '',
      City: company.City || '',
      State: company.State || '',
      Country: company.Country || 'United States',
      PostalCode: company.PostalCode || '',
      EmployeeCount: company.EmployeeCount || '',
      AnnualRevenue: company.AnnualRevenue || '',
      Founded: company.Founded || '',
      Description: company.Description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveCompany = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      if (selectedCompany) {
        // Update existing company
        await companyService.update(selectedCompany.Id, formData);
        toast.success('Company updated successfully');
        setIsEditModalOpen(false);
      } else {
        // Create new company
        await companyService.create(formData);
        toast.success('Company created successfully');
        setIsAddModalOpen(false);
      }
      
      loadCompanies();
      resetForm();
      setSelectedCompany(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save company');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    try {
      await companyService.delete(companyToDelete.Id);
      toast.success('Company deleted successfully');
      setIsDeleteConfirmOpen(false);
      setCompanyToDelete(null);
      loadCompanies();
    } catch (err) {
      toast.error(err.message || 'Failed to delete company');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatEmployeeCount = (count) => {
    if (!count) return 'N/A';
    return new Intl.NumberFormat('en-US').format(count);
  };

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadCompanies}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Companies</h1>
          <p className="text-slate-600 mt-1">Manage your company database</p>
        </div>
        <Button onClick={handleAddCompany} className="shrink-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search companies..."
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Companies Table */}
      <Card>
        {loading ? (
          <div className="p-12">
            <Loading />
          </div>
        ) : companies.length === 0 ? (
          <div className="p-12">
            <Empty 
              message={searchTerm || selectedIndustry !== 'all' 
                ? "No companies match your search criteria" 
                : "No companies found. Add your first company to get started."}
              action={
                <Button onClick={handleAddCompany} variant="outline" className="mt-4">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Company
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('Name')}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Company
                      <ApperIcon name={getSortIcon('Name')} size={14} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('Industry')}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Industry
                      <ApperIcon name={getSortIcon('Industry')} size={14} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('City')}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Location
                      <ApperIcon name={getSortIcon('City')} size={14} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('EmployeeCount')}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Employees
                      <ApperIcon name={getSortIcon('EmployeeCount')} size={14} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('AnnualRevenue')}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Revenue
                      <ApperIcon name={getSortIcon('AnnualRevenue')} size={14} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <AnimatePresence mode="popLayout">
                  {companies.map((company) => (
                    <motion.tr
                      key={company.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-slate-900">{company.Name}</div>
                          {company.Website && (
                            <a
                              href={company.Website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {company.Website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary">{company.Industry}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-900">
                          {company.City}
                          {company.State && `, ${company.State}`}
                        </div>
                        {company.Country && (
                          <div className="text-sm text-slate-500">{company.Country}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {formatEmployeeCount(company.EmployeeCount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {formatCurrency(company.AnnualRevenue)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditCompany(company)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Edit company"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Delete company"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add/Edit Company Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
          setSelectedCompany(null);
        }}
        title={selectedCompany ? 'Edit Company' : 'Add New Company'}
        size="large"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  error={formErrors.Name}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry *
                </label>
                <Input
                  value={formData.Industry}
                  onChange={(e) => handleInputChange('Industry', e.target.value)}
                  error={formErrors.Industry}
                  placeholder="Enter industry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <Input
                  value={formData.Website}
                  onChange={(e) => handleInputChange('Website', e.target.value)}
                  error={formErrors.Website}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <Input
                  value={formData.Phone}
                  onChange={(e) => handleInputChange('Phone', e.target.value)}
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  error={formErrors.Email}
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Founded Year
                </label>
                <Input
                  value={formData.Founded}
                  onChange={(e) => handleInputChange('Founded', e.target.value)}
                  placeholder="2020"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <Input
                  value={formData.Address}
                  onChange={(e) => handleInputChange('Address', e.target.value)}
                  placeholder="123 Business Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                <Input
                  value={formData.City}
                  onChange={(e) => handleInputChange('City', e.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State/Province
                </label>
                <Input
                  value={formData.State}
                  onChange={(e) => handleInputChange('State', e.target.value)}
                  placeholder="CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                <Input
                  value={formData.Country}
                  onChange={(e) => handleInputChange('Country', e.target.value)}
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postal Code
                </label>
                <Input
                  value={formData.PostalCode}
                  onChange={(e) => handleInputChange('PostalCode', e.target.value)}
                  placeholder="94105"
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employee Count
                </label>
                <Input
                  type="number"
                  value={formData.EmployeeCount}
                  onChange={(e) => handleInputChange('EmployeeCount', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Annual Revenue ($)
                </label>
                <Input
                  type="number"
                  value={formData.AnnualRevenue}
                  onChange={(e) => handleInputChange('AnnualRevenue', e.target.value)}
                  placeholder="1000000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => handleInputChange('Description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Brief description of the company..."
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
                setSelectedCompany(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCompany}
              loading={formLoading}
            >
              {selectedCompany ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setCompanyToDelete(null);
        }}
        title="Delete Company"
        size="small"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800 font-medium">
                Are you sure you want to delete this company?
              </p>
              {companyToDelete && (
                <p className="text-slate-600 text-sm mt-1">
                  <strong>{companyToDelete.Name}</strong> will be permanently removed.
                  This action cannot be undone.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setCompanyToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteCompany}
            >
              Delete Company
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Companies;
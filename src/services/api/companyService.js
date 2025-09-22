import companiesData from '../mockData/companies.json';

// Utility function for realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  // Get all companies with optional filtering and sorting
  async getAll(filters = {}) {
    await delay(300);
    
    try {
      let filteredCompanies = [...this.companies];
      
      // Apply search filter if provided
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company =>
          company.Name.toLowerCase().includes(searchTerm) ||
          company.Industry.toLowerCase().includes(searchTerm) ||
          company.City.toLowerCase().includes(searchTerm) ||
          company.Email.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply industry filter if provided
      if (filters.industry && filters.industry !== 'all') {
        filteredCompanies = filteredCompanies.filter(company =>
          company.Industry === filters.industry
        );
      }
      
      // Apply sorting if provided
      if (filters.sortBy) {
        filteredCompanies.sort((a, b) => {
          const aValue = a[filters.sortBy];
          const bValue = b[filters.sortBy];
          
          if (typeof aValue === 'string') {
            return filters.sortOrder === 'desc' 
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          } else {
            return filters.sortOrder === 'desc' 
              ? bValue - aValue 
              : aValue - bValue;
          }
        });
      }
      
      return filteredCompanies;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
  }

  // Get company by ID
  async getById(id) {
    await delay(200);
    
    try {
      const company = this.companies.find(c => c.Id === parseInt(id));
      if (!company) {
        throw new Error('Company not found');
      }
      return { ...company };
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      throw error;
    }
  }

  // Create new company
  async create(companyData) {
    await delay(400);
    
    try {
      // Validate required fields
      if (!companyData.Name?.trim()) {
        throw new Error('Company name is required');
      }
      
      if (!companyData.Industry?.trim()) {
        throw new Error('Industry is required');
      }

      // Generate new ID
      const newId = Math.max(...this.companies.map(c => c.Id), 0) + 1;
      
      const newCompany = {
        ...companyData,
        Id: newId,
        Name: companyData.Name.trim(),
        Industry: companyData.Industry.trim(),
        Website: companyData.Website?.trim() || '',
        Phone: companyData.Phone?.trim() || '',
        Email: companyData.Email?.trim() || '',
        Address: companyData.Address?.trim() || '',
        City: companyData.City?.trim() || '',
        State: companyData.State?.trim() || '',
        Country: companyData.Country?.trim() || '',
        PostalCode: companyData.PostalCode?.trim() || '',
        EmployeeCount: parseInt(companyData.EmployeeCount) || 0,
        AnnualRevenue: parseFloat(companyData.AnnualRevenue) || 0,
        Founded: companyData.Founded?.trim() || '',
        Description: companyData.Description?.trim() || ''
      };
      
      this.companies.push(newCompany);
      return { ...newCompany };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  // Update existing company
  async update(id, companyData) {
    await delay(350);
    
    try {
      const index = this.companies.findIndex(c => c.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Company not found');
      }

      // Validate required fields
      if (!companyData.Name?.trim()) {
        throw new Error('Company name is required');
      }
      
      if (!companyData.Industry?.trim()) {
        throw new Error('Industry is required');
      }

      const updatedCompany = {
        ...this.companies[index],
        ...companyData,
        Id: parseInt(id), // Ensure ID remains unchanged
        Name: companyData.Name.trim(),
        Industry: companyData.Industry.trim(),
        Website: companyData.Website?.trim() || '',
        Phone: companyData.Phone?.trim() || '',
        Email: companyData.Email?.trim() || '',
        Address: companyData.Address?.trim() || '',
        City: companyData.City?.trim() || '',
        State: companyData.State?.trim() || '',
        Country: companyData.Country?.trim() || '',
        PostalCode: companyData.PostalCode?.trim() || '',
        EmployeeCount: parseInt(companyData.EmployeeCount) || 0,
        AnnualRevenue: parseFloat(companyData.AnnualRevenue) || 0,
        Founded: companyData.Founded?.trim() || '',
        Description: companyData.Description?.trim() || ''
      };
      
      this.companies[index] = updatedCompany;
      return { ...updatedCompany };
    } catch (error) {
      console.error(`Error updating company ${id}:`, error);
      throw error;
    }
  }

  // Delete company
  async delete(id) {
    await delay(250);
    
    try {
      const index = this.companies.findIndex(c => c.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Company not found');
      }

      this.companies.splice(index, 1);
      return { success: true, message: 'Company deleted successfully' };
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error);
      throw error;
    }
  }

  // Get unique industries for filter dropdown
  async getIndustries() {
    await delay(100);
    
    try {
      const industries = [...new Set(this.companies.map(c => c.Industry))];
      return industries.sort();
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw new Error('Failed to fetch industries');
    }
  }

  // Get companies stats
  async getStats() {
    await delay(150);
    
    try {
      const totalCompanies = this.companies.length;
      const totalRevenue = this.companies.reduce((sum, c) => sum + (c.AnnualRevenue || 0), 0);
      const totalEmployees = this.companies.reduce((sum, c) => sum + (c.EmployeeCount || 0), 0);
      const industries = [...new Set(this.companies.map(c => c.Industry))].length;
      
      return {
        totalCompanies,
        totalRevenue,
        totalEmployees,
        industries
      };
    } catch (error) {
      console.error('Error fetching companies stats:', error);
      throw new Error('Failed to fetch companies statistics');
    }
  }
}

// Export singleton instance
export default new CompanyService();
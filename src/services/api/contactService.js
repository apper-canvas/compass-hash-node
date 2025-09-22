const tableName = 'contact_c';

export const contactService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_activity_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to frontend expected format
      const contacts = (response.data || []).map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        status: contact.status_c || 'lead',
        lastActivity: contact.last_activity_c || contact.CreatedOn,
        createdAt: contact.CreatedOn
      }));
      
      return contacts;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to load contacts");
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_activity_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Map database fields to frontend expected format
      const contact = {
        Id: response.data.Id,
        firstName: response.data.first_name_c || '',
        lastName: response.data.last_name_c || '',
        email: response.data.email_c || '',
        phone: response.data.phone_c || '',
        company: response.data.company_c || '',
        status: response.data.status_c || 'lead',
        lastActivity: response.data.last_activity_c || response.data.CreatedOn,
        createdAt: response.data.CreatedOn
      };
      
      return contact;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      return null;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map frontend format to database fields (only Updateable fields)
      const dbContactData = {
        Name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        first_name_c: contactData.firstName,
        last_name_c: contactData.lastName,
        email_c: contactData.email,
        phone_c: contactData.phone || '',
        company_c: contactData.company,
        status_c: contactData.status || 'lead',
        last_activity_c: new Date().toISOString()
      };
      
      const params = {
        records: [dbContactData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to create contact:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            firstName: result.data.first_name_c || '',
            lastName: result.data.last_name_c || '',
            email: result.data.email_c || '',
            phone: result.data.phone_c || '',
            company: result.data.company_c || '',
            status: result.data.status_c || 'lead',
            lastActivity: result.data.last_activity_c,
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      throw new Error("Failed to create contact");
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map frontend format to database fields (only Updateable fields)
      const dbUpdateData = {
        Id: parseInt(id),
        Name: `${updateData.firstName} ${updateData.lastName}`.trim(),
        first_name_c: updateData.firstName,
        last_name_c: updateData.lastName,
        email_c: updateData.email,
        phone_c: updateData.phone || '',
        company_c: updateData.company,
        status_c: updateData.status || 'lead',
        last_activity_c: new Date().toISOString()
      };
      
      const params = {
        records: [dbUpdateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to update contact:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            firstName: result.data.first_name_c || '',
            lastName: result.data.last_name_c || '',
            email: result.data.email_c || '',
            phone: result.data.phone_c || '',
            company: result.data.company_c || '',
            status: result.data.status_c || 'lead',
            lastActivity: result.data.last_activity_c,
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to delete contact:", response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const searchTerm = query.toLowerCase();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_activity_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "company_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""}
          ]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to search contacts:", response.message);
        return [];
      }
      
      // Map database fields to frontend expected format
      const contacts = (response.data || []).map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        status: contact.status_c || 'lead',
        lastActivity: contact.last_activity_c || contact.CreatedOn,
        createdAt: contact.CreatedOn
      }));
      
      return contacts;
    } catch (error) {
      console.error("Error searching contacts:", error);
      return [];
    }
  }
};
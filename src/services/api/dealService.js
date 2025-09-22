const tableName = 'deal_c';

export const dealService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to frontend expected format
      const deals = (response.data || []).map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c || new Date().toISOString(),
        createdAt: deal.CreatedOn
      }));
      
      return deals;
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw new Error("Failed to load deals");
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Map database fields to frontend expected format
      const deal = {
        Id: response.data.Id,
        title: response.data.title_c || '',
        contactId: response.data.contact_id_c?.Id || response.data.contact_id_c,
        value: parseFloat(response.data.value_c) || 0,
        stage: response.data.stage_c || 'lead',
        probability: parseInt(response.data.probability_c) || 0,
        expectedCloseDate: response.data.expected_close_date_c || new Date().toISOString(),
        createdAt: response.data.CreatedOn
      };
      
      return deal;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error);
      return null;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map frontend format to database fields (only Updateable fields)
      const dbDealData = {
        Name: dealData.title,
        title_c: dealData.title,
        contact_id_c: parseInt(dealData.contactId),
        value_c: parseFloat(dealData.value),
        stage_c: dealData.stage || 'lead',
        probability_c: parseInt(dealData.probability) || 0,
        expected_close_date_c: dealData.expectedCloseDate
      };
      
      const params = {
        records: [dbDealData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to create deal:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            title: result.data.title_c || '',
            contactId: result.data.contact_id_c?.Id || result.data.contact_id_c,
            value: parseFloat(result.data.value_c) || 0,
            stage: result.data.stage_c || 'lead',
            probability: parseInt(result.data.probability_c) || 0,
            expectedCloseDate: result.data.expected_close_date_c,
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      throw new Error("Failed to create deal");
    } catch (error) {
      console.error("Error creating deal:", error);
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
        Name: updateData.title || updateData.Name,
        title_c: updateData.title,
        stage_c: updateData.stage
      };
      
      // Only include fields that are being updated
      if (updateData.contactId !== undefined) {
        dbUpdateData.contact_id_c = parseInt(updateData.contactId);
      }
      if (updateData.value !== undefined) {
        dbUpdateData.value_c = parseFloat(updateData.value);
      }
      if (updateData.probability !== undefined) {
        dbUpdateData.probability_c = parseInt(updateData.probability);
      }
      if (updateData.expectedCloseDate !== undefined) {
        dbUpdateData.expected_close_date_c = updateData.expectedCloseDate;
      }
      
      const params = {
        records: [dbUpdateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to update deal:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            title: result.data.title_c || '',
            contactId: result.data.contact_id_c?.Id || result.data.contact_id_c,
            value: parseFloat(result.data.value_c) || 0,
            stage: result.data.stage_c || 'lead',
            probability: parseInt(result.data.probability_c) || 0,
            expectedCloseDate: result.data.expected_close_date_c,
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error);
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
        console.error("Failed to delete deal:", response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  },

  async getByStage(stage) {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "stage_c", "Operator": "ExactMatch", "Values": [stage], "Include": true}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch deals by stage:", response.message);
        return [];
      }
      
      // Map database fields to frontend expected format
      const deals = (response.data || []).map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c || new Date().toISOString(),
        createdAt: deal.CreatedOn
      }));
      
      return deals;
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      return [];
    }
  }
};
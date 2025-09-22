const tableName = 'activity_c';

export const activityService = {
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to frontend expected format
      const activities = (response.data || []).map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        type: activity.type_c || 'call',
        description: activity.description_c || '',
        createdAt: activity.CreatedOn
      }));
      
      return activities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error("Failed to load activities");
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Map database fields to frontend expected format
      const activity = {
        Id: response.data.Id,
        contactId: response.data.contact_id_c?.Id || response.data.contact_id_c,
        dealId: response.data.deal_id_c?.Id || response.data.deal_id_c || null,
        type: response.data.type_c || 'call',
        description: response.data.description_c || '',
        createdAt: response.data.CreatedOn
      };
      
      return activity;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      return null;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Map frontend format to database fields (only Updateable fields)
      const dbActivityData = {
        Name: `${activityData.type} - ${activityData.description.substring(0, 50)}`,
        contact_id_c: parseInt(activityData.contactId),
        deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null,
        type_c: activityData.type,
        description_c: activityData.description
      };
      
      // Remove null dealId if not provided
      if (!dbActivityData.deal_id_c) {
        delete dbActivityData.deal_id_c;
      }
      
      const params = {
        records: [dbActivityData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            contactId: result.data.contact_id_c?.Id || result.data.contact_id_c,
            dealId: result.data.deal_id_c?.Id || result.data.deal_id_c || null,
            type: result.data.type_c || 'call',
            description: result.data.description_c || '',
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      throw new Error("Failed to create activity");
    } catch (error) {
      console.error("Error creating activity:", error);
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
        Name: `${updateData.type} - ${updateData.description.substring(0, 50)}`,
        contact_id_c: parseInt(updateData.contactId),
        type_c: updateData.type,
        description_c: updateData.description
      };
      
      if (updateData.dealId) {
        dbUpdateData.deal_id_c = parseInt(updateData.dealId);
      }
      
      const params = {
        records: [dbUpdateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Failed to update activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Map back to frontend format
          return {
            Id: result.data.Id,
            contactId: result.data.contact_id_c?.Id || result.data.contact_id_c,
            dealId: result.data.deal_id_c?.Id || result.data.deal_id_c || null,
            type: result.data.type_c || 'call',
            description: result.data.description_c || '',
            createdAt: result.data.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating activity:", error);
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
        console.error("Failed to delete activity:", response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  },

  async getByContact(contactId) {
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "ExactMatch", "Values": [parseInt(contactId)], "Include": true}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by contact:", response.message);
        return [];
      }
      
      // Map database fields to frontend expected format
      const activities = (response.data || []).map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        type: activity.type_c || 'call',
        description: activity.description_c || '',
        createdAt: activity.CreatedOn
      }));
      
      return activities;
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      return [];
    }
  }
};
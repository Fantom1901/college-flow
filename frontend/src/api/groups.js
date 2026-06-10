import axios from 'axios'; // или твой настроенный инстанс API / $api

export const groupsApi = {
  /**
   * Инициализация группы куратором
   * @param {Object} data - Полностью сформированный объект GroupInitRequest
   */
  initGroup: async (data) => {
    // Шлём строго то, что пришло из формы/layout, ничего не подменяя внутри метода
    const response = await axios.post('/api/v1/groups/init', data);
    return response.data;
  },

  // ... твои остальные методы (getGroup, etc.) оставляй как есть
};
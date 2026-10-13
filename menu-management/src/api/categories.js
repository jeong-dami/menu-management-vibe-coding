import apiClient from './client.js'

export async function getCategories({ signal } = {}) {
  const response = await apiClient.get('/api/categories', { signal })

  return response.data.result
}

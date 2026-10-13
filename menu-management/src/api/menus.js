import apiClient from './client.js'

export async function getMenuPage({ page = 1, size, signal } = {}) {
  const response = await apiClient.get('/api/menus/pages', {
    params: { page, size },
    signal,
  })

  return response.data.result
}

export async function searchMenusByPrice({ menuPrice, signal } = {}) {
  const response = await apiClient.get('/api/menus/search', {
    params: { menuPrice },
    signal,
  })

  return response.data.result
}

export async function getMenu({ menuCode, signal } = {}) {
  const response = await apiClient.get(`/api/menus/${menuCode}`, { signal })

  return response.data.result
}

export async function createMenu({ menu, signal } = {}) {
  const response = await apiClient.post('/api/menus', menu, { signal })

  return response.data.result
}

export async function updateMenu({ menuCode, menu, signal } = {}) {
  const response = await apiClient.put(`/api/menus/${menuCode}`, menu, {
    signal,
  })

  return response.data.result
}

export async function deleteMenu({ menuCode, signal } = {}) {
  const response = await apiClient.delete(`/api/menus/${menuCode}`, { signal })

  return response.data.result
}

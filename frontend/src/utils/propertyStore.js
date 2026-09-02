// Centralized store for user authentication & real user-registered properties
// No random data: Only data entered or registered by the user is stored and displayed.

const USER_KEY = '3d_ulpin_user'
const PROPERTIES_KEY = '3d_ulpin_properties'
const SEARCHES_KEY = '3d_ulpin_recent_searches'
const HISTORY_KEY = '3d_ulpin_history'

// ── User Management ──
export const getCurrentUser = (defaultRole = 'user') => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse user from localStorage', e)
  }
  return {
    name: defaultRole === 'admin' ? 'Admin' : 'User',
    email: defaultRole === 'admin' ? 'admin@3d-ulpin.gov.in' : 'user@3d-ulpin.gov.in',
    role: defaultRole,
  }
}

export const setCurrentUser = (userData) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  } catch (e) {
    console.error('Failed to save user to localStorage', e)
  }
}

export const clearCurrentUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch (e) {
    console.error('Failed to remove user from localStorage', e)
  }
}

// ── Registered Properties ──
export const getProperties = () => {
  try {
    const raw = localStorage.getItem(PROPERTIES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse properties', e)
  }
  return []
}

export const saveProperty = (property) => {
  try {
    const existing = getProperties()
    // Check if ULPIN already exists, if so update it, otherwise add it
    const index = existing.findIndex((p) => p.ulpin.toLowerCase() === property.ulpin.toLowerCase())
    let updatedList
    if (index >= 0) {
      updatedList = [...existing]
      updatedList[index] = { ...updatedList[index], ...property, updatedAt: new Date().toISOString() }
    } else {
      const newProp = {
        ...property,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: property.status || 'Registered',
      }
      updatedList = [newProp, ...existing]

      // Automatically add a real registry history entry for this registration
      addHistoryEvent({
        id: Date.now().toString(),
        ulpin: property.ulpin,
        type: 'Registration',
        description: `Property registered under ${property.owner || 'Owner'}`,
        registrationNo: `REG/${property.ulpin}/${new Date().getFullYear()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        authority: property.authority || 'Sub-Registrar Office',
        status: property.status || 'Registered',
      })
    }
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedList))
    return updatedList
  } catch (e) {
    console.error('Failed to save property', e)
    return []
  }
}

export const deleteProperty = (ulpin) => {
  try {
    const existing = getProperties()
    const updated = existing.filter((p) => p.ulpin !== ulpin)
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to delete property', e)
    return []
  }
}

// ── Recent Searches ──
export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(SEARCHES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse recent searches', e)
  }
  return []
}

export const addRecentSearch = (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return []
  try {
    const term = searchTerm.trim()
    const existing = getRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase())
    const updated = [term, ...existing].slice(0, 8)
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to save search term', e)
    return []
  }
}

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(SEARCHES_KEY)
  } catch (e) {
    console.error('Failed to clear recent searches', e)
  }
  return []
}

// ── Registry History ──
export const getHistoryEvents = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse history events', e)
  }
  return []
}

export const addHistoryEvent = (event) => {
  try {
    const existing = getHistoryEvents()
    const updated = [event, ...existing]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to add history event', e)
    return []
  }
}


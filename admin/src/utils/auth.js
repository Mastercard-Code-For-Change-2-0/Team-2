// Utility functions for authentication
export const getUser = () => {
    try {
        const userStr = localStorage.getItem('user')
        // Handle cases where localStorage contains "undefined" string or null/empty values
        if (!userStr || userStr === 'undefined' || userStr === 'null') {
            return null
        }
        return JSON.parse(userStr)
    } catch (error) {
        console.error('Error parsing user data:', error)
        return null
    }
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const isAuthenticated = () => {
    return !!getToken()
}

export const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
}

// Clean up any invalid localStorage values on module load
export const cleanupAuth = () => {
    const userStr = localStorage.getItem('user')
    const tokenStr = localStorage.getItem('token')

    if (userStr === 'undefined' || userStr === 'null') {
        localStorage.removeItem('user')
    }
    if (tokenStr === 'undefined' || tokenStr === 'null') {
        localStorage.removeItem('token')
    }
}

// Run cleanup when module loads
cleanupAuth()

export const setAuth = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event('auth-change'))
}
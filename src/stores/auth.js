import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { csrfCookie, login, register, logout, getUser } from '../http/auth-api'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  const fetchUser = async () => {
    try {
      const { data } = await getUser()
      user.value = data
    } catch (error) {
      user.value = null
    }
  }

  const handelLogin = async (credentials) => {
    await csrfCookie()
    await login(credentials)
    await fetchUser()
  }

  const handelRegister = async (newUser) => {
    await register(newUser)
    await handelLogin({
      email: newUser.email,
      password: newUser.password
    })
  }

  const handelLogout = async () => {
    await logout()
    user.value = null
  }
  return {
    user,
    isLoggedIn,
    fetchUser,
    handelLogin,
    handelRegister,
    handelLogout
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { csrfCookie, login, register, logout, getUser } from '../http/auth-api'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const errors = ref({})

  const isLoggedIn = computed(() => !!user.value)

  const fetchUser = async () => {
    try {
      const { data } = await getUser()
      user.value = data
      console.log(user.value)
    } catch (error) {
      user.value = null
    }
  }

  const handelLogin = async (credentials) => {
    await csrfCookie()

    try {
      await login(credentials)
      await fetchUser()
      errors.value = {}
    } catch (error) {
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    }
  }

  const handelRegister = async (newUser) => {
    try {
      await register(newUser)
      await handelLogin({
        email: newUser.email,
        password: newUser.password
      })
    } catch (error) {
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    }
  }

  const handelLogout = async () => {
    await logout()
    user.value = null
  }
  return {
    user,
    isLoggedIn,
    errors,
    fetchUser,
    handelLogin,
    handelRegister,
    handelLogout
  }
})

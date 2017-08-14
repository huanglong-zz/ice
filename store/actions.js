import Services from './services'
import axios from 'axios'

export default {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.user) {
      const { email, nickname, avatarUrl } = req.session.user
      const user = {
        email,
        nickname,
        avatarUrl
      }

      commit('SET_USER', user)
    }
  },

  async login ({ commit }, { email, password }) {
    try {
      let res = await axios.post('/admin/login', {
        email,
        password
      })

      const { data } = res
      
      if (data.success) commit('SET_USER', data.data)

      return data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('来错地方了')
      }
    }
  },

  async logout ({ commit }) {
    await axios.post('/admin/logout')

    commit('SET_USER', null)
  },

  async createOrder ({ state }, obj) {
    const { data } = Services.createOrder(obj)

    return data
  },

  getWechatSignature({ commit }, url) {
    return Services.getWechatSignature(url)
  },

  getUserByOAuth({ commit }, url) {
    return Services.getUserByOAuth(url)
  },

  getWechatOAuth({ commit }, url) {
    return Services.getWechatOAuth(url)
  },

  setAuthUser ({ commit }, authUser) {
    commit('SET_AUTHUSER', authUser)
  },

  async fetchHouses ({ state }) {
    const res = await Services.fetchHouses()

    state.houses = res.data.data

    return res
  },

  async fetchCharacters ({ state }) {
    const res = await Services.fetchCharacters()

    state.characters = res.data.data

    return res
  },

  async showHouse ({ state }, _id) {
    if (_id === state.currentHouse._id) return

    const res = await Services.fetchHouse(_id)

    state.currentHouse = res.data.data

    return res
  },

  async showCharacter ({ state }, _id) {
    if (_id === state.currentCharacter._id) return

    const res = await Services.fetchCharacter(_id)

    console.log(res.data)
    state.currentCharacter = res.data.data

    return res
  },

  async fetchProducts ({ state }) {
    const res = await Services.fetchProducts()

    state.products = res.data.data

    return res
  },

  async showProduct ({ state }, _id) {
    if (_id === state.currentProduct._id) return

    const res = await Services.fetchProduct(_id)
    console.log(res.data)
    state.currentProduct = res.data.data

    return res
  },


  async saveProduct ({ state, dispatch }, product) {
    await axios.post('/api/products', product)

    let res = await dispatch('fetchProducts')

    return res.data.data
  },

  async putProduct ({ state, dispatch }, product) {
    await axios.put('/api/products', product)
    let res = await dispatch('fetchProducts')

    return res.data.data
  },

  async deleteProduct ({ state, dispatch }, product) {
    await axios.delete(`/api/products/${product._id}`)
    let res = await dispatch('fetchProducts')

    return res.data.data
  },

  async fetchPayments ({ state }) {
    let { data } = await Services.getPayments()
    state.payments = data.data

    return data
  },

  async fetchUserAndOrders ({ state }) {
    const res = await Services.fetchUserAndOrders()

    state.user = res.data.data

    return res
  }
}
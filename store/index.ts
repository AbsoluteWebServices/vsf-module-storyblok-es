import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import actions from './actions'

export const module: Module<any, RootState> = {
  namespaced: true,
  actions
}

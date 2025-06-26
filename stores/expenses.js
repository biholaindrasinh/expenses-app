// stores/expenses.js
import { defineStore } from 'pinia'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: []
  }),
  actions: {
    addExpense(expense) {
      this.expenses.push(expense)
    }
  }
})

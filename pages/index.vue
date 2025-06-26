<template>
  <div class="container py-5">
    <h1 class="mb-4">Expense Tracker</h1>

    <!-- Expense Form -->
    <form @submit.prevent="isEditing ? updateExpense() : addNewExpense()" class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label">Date</label>
          <input type="date" v-model="newExpense.date" class="form-control" required />
        </div>

        <div class="col-md-3">
          <label class="form-label">Type</label>
          <select v-model="newExpense.type" class="form-select" required>
            <option disabled value="">Select Type</option>
            <option value="Fixed">Fixed</option>
            <option value="Variable">Variable</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Category</label>
          <select v-model="newExpense.category" class="form-select" required>
            <option disabled value="">Select Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Rent">Rent</option>
            <option value="Fuel">Fuel</option>
            <option value="Utilities">Utilities</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Amount (₹)</label>
          <input type="number" v-model.number="newExpense.amount" class="form-control" required />
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Update Expense' : 'Add Expense' }}
        </button>
        <button v-if="isEditing" @click="cancelEdit" type="button" class="btn btn-secondary ms-2">Cancel</button>
      </div>
    </form>

    <!-- Expenses Table -->
    <div v-if="expenses.length">
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Category</th>
            <th scope="col">Amount (₹)</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exp, index) in expenses" :key="index">
            <td>{{ exp.date }}</td>
            <td>{{ exp.type }}</td>
            <td>{{ exp.category }}</td>
            <td>{{ formatINR(exp.amount) }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editExpense(index)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteExpense(index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No expenses added yet.</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useExpensesStore } from '~/stores/expenses'

const expensesStore = useExpensesStore()
const expenses = expensesStore.expenses

const newExpense = reactive({
  date: '',
  type: '',
  category: '',
  amount: null
})

const isEditing = ref(false)
const editIndex = ref(null)

function addNewExpense() {
  expensesStore.addExpense({ ...newExpense })
  resetForm()
}

function editExpense(index) {
  const exp = expenses[index]
  newExpense.date = exp.date
  newExpense.type = exp.type
  newExpense.category = exp.category
  newExpense.amount = exp.amount
  isEditing.value = true
  editIndex.value = index
}

function updateExpense() {
  if (editIndex.value !== null) {
    expenses[editIndex.value] = { ...newExpense }
    resetForm()
  }
}

function deleteExpense(index) {
  expenses.splice(index, 1)
  if (isEditing.value && editIndex.value === index) resetForm()
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  newExpense.date = ''
  newExpense.type = ''
  newExpense.category = ''
  newExpense.amount = null
  isEditing.value = false
  editIndex.value = null
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>

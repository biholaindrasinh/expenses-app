<template>
  <div class="container py-5">
    <h1 class="mb-4">Expense Tracker</h1>

    <!-- Form -->
    <form @submit.prevent="isEditing ? updateTransaction() : addTransaction()" class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-2">
          <label class="form-label">Date</label>
          <input type="date" v-model="form.date" class="form-control" required />
        </div>

        <div class="col-md-2">
          <label class="form-label">Type</label>
          <select v-model="form.type" class="form-select" required>
            <option disabled value="">Select</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Category</label>
          <select v-model="form.category_id" class="form-select" required>
            <option disabled value="">Select</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Description</label>
          <input type="text" v-model="form.description" class="form-control" required />
        </div>

        <div class="col-md-2">
          <label class="form-label">Amount (₹)</label>
          <input type="number" v-model.number="form.amount" class="form-control" required />
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Update' : 'Add' }}
        </button>
        <button v-if="isEditing" @click="resetForm" type="button" class="btn btn-secondary ms-2">Cancel</button>
      </div>
    </form>

    <!-- Transactions Table -->
    <div v-if="transactions.length">
      <table class="table table-striped table-bordered align-middle mt-4">
        <thead class="table-dark">
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(txn, index) in transactions" :key="txn.id">
            <td>{{ txn.date }}</td>
            <td>{{ txn.type }}</td>
            <td>{{ txn.category?.name }}</td>
            <td>{{ txn.description }}</td>
            <td>{{ formatINR(txn.amount) }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editTransaction(index)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteTransaction(txn.id, index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No transactions yet.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const { $axios } = useNuxtApp()
const transactions = ref([])
const categories = ref([])

const form = reactive({
  date: '',
  type: '',
  category_id: '',
  description: '',
  amount: null
})

const isEditing = ref(false)
const editId = ref(null)
const editIndex = ref(null)

const loadTransactions = async () => {
  const { data } = await $axios.get('/transactions?type=expense')
  transactions.value = data
}

const loadCategories = async () => {
  const { data } = await $axios.get('/categories')
  categories.value = data
}

onMounted(() => {
  loadTransactions()
  loadCategories()
})

const addTransaction = async () => {
  const { data } = await $axios.post('/transactions', form)
  transactions.value.unshift(data)
  resetForm()
}

const editTransaction = (index) => {
  const txn = transactions.value[index]
  form.date = txn.date
  form.type = txn.type
  form.category_id = txn.category_id
  form.description = txn.description
  form.amount = txn.amount
  editId.value = txn.id
  editIndex.value = index
  isEditing.value = true
}

const updateTransaction = async () => {
  const { data } = await $axios.put(`/transactions/${editId.value}`, form)
  transactions.value[editIndex.value] = data
  resetForm()
}

const deleteTransaction = async (id, index) => {
  await $axios.delete(`/transactions/${id}`)
  transactions.value.splice(index, 1)
}

const resetForm = () => {
  form.date = ''
  form.type = ''
  form.category_id = ''
  form.description = ''
  form.amount = null
  isEditing.value = false
  editId.value = null
  editIndex.value = null
}

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
</script>

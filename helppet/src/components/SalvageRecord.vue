<template>
  <div class="mt-3">
    <input v-model="search" type="text" class="form-control mb-3" placeholder="Search by breed or volunteer name..." />
    <table class="table table-striped">
      <thead>
      <tr>
        <th >#</th>
        <th @click="sortData('breed')">Pet Breed</th>
        <th class="d-none d-md-table-cell" @click="sortData('volunteer')">Volunteer Name</th>
        <th @click="sortData('method')">Salvage Method</th>
        <th>

        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(record, index) in filteredRecords" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ record.breed }}</td>
        <td class="d-none d-md-table-cell">{{ record.volunteer }}</td>
        <td>{{ record.method }}</td>
        <td>
          <router-link :to="{ name: 'SalvageRecordDetail', params: { id: record.id } }" class="btn btn-primary btn-sm">View</router-link>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>

        <!-- Dynamically calculate page numbers to display -->
        <li
            class="page-item"
            :class="{ active: page === currentPage }"
            v-for="page in pageNumbers"
            :key="page"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import mockData from '../mock/salvageRecords.json';
import {useSalvageRecords} from "../composables/useSalvageRecords.js";

const search = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortKey = ref('id');
const sortOrder = ref(1);

const { salvageRecords } = useSalvageRecords();
const records = computed(() => salvageRecords.value);
console.log(records.value)

const filteredRecords = computed(() => {
  let filtered = records.value.filter(
      record =>
          record.breed.toLowerCase().includes(search.value.toLowerCase()) ||
          record.volunteer.toLowerCase().includes(search.value.toLowerCase())
  );
  filtered = filtered.sort((a, b) => (a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value));
  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});

const totalPages = computed(() => Math.ceil(records.value.length / itemsPerPage));

const pageNumbers = computed(() => {
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages.value);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const sortData = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = -sortOrder.value;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
};
</script>

<style scoped>
.table {
  font-size: 14px;
}

@media (max-width: 768px) {
  .table {
    font-size: 12px;
  }
}
</style>

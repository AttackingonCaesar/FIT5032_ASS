<template>
  <div class="mt-3">


    <button @click="handleClickPublish" class="btn btn-primary mb-2">Publish Stray Pet</button>
    <input v-model="search" type="text" class="form-control mb-3" placeholder="Search by breed or explorer name..." />
    <table class="table table-striped">
      <thead>
      <tr>
        <th >#</th>
        <th @click="sortData('petBreed')">Pet Breed</th>
        <th class="d-none d-md-table-cell" @click="sortData('explorer')">Explorer Name</th>
        <th class="d-none d-md-table-cell" @click="sortData('appearAddress')">Position Name</th>
        <th @click="sortData('petQuantity')">Quantity</th>
        <th>
          Detail
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(pet, index) in filteredPets" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ pet.petBreed }}</td>
        <td class="d-none d-md-table-cell">{{ pet.explorer }}</td>
        <td class="d-none d-md-table-cell">{{ pet.appearAddress }}</td>
        <td>
          <span v-for="n in pet.petQuantity" :key="n">🐶</span>
        </td>
        <td>
          <router-link :to="{ name: 'StrayPetDetail', params: { id: pet.id } }" class="btn btn-primary">Detail</router-link>
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
import {ref, computed} from 'vue';
import mockData from '../mock/strayPets.json';
import {useRouter} from "vue-router";
import {useUserData} from "../composables/useUserData.js";
import {useToast} from "vue-toast-notification";
import {useStrayPets} from "../composables/useStrayPets.js";

const search = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortKey = ref('id');
const sortOrder = ref(1);
const { userData } = useUserData();
const router = useRouter();

const $toast = useToast();
const {strayPets} = useStrayPets();


const pets = computed(() => strayPets.value);


const handleClickPublish = async () => {
  try {

    const user = userData.value;
    const role = user?.role;
    if (!user || role !== 'explorer') {
      return $toast.error('You are not authorized to publish a stray pet');
    } else {
      router.push(`/publish-stray-pet`);
    }
  } catch (error) {

  }
};

const filteredPets = computed(() => {
  let filtered = pets.value.filter(
      pet =>
          pet.petBreed.toLowerCase().includes(search.value.toLowerCase()) ||
          pet.explorer.toLowerCase().includes(search.value.toLowerCase())
  );
  filtered = filtered.sort((a, b) => (a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value));
  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});

const totalPages = computed(() => Math.ceil(pets.value.length / itemsPerPage));

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

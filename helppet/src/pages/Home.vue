<template>
  <div class="container mt-5">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'stray-pet' }"
            @click="activeTab = 'stray-pet'"
        >
          Stray Pet
        </button>
      </li>
      <li class="nav-item">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'salvage-record' }"
            @click="activeTab = 'salvage-record'"
        >
          Salvage Record
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <div v-if="activeTab === 'stray-pet'">
        <StrayPet />
      </div>
      <div v-if="activeTab === 'salvage-record'">
        <SalvageRecord />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StrayPet from '../components/StrayPet.vue';
import SalvageRecord from '../components/SalvageRecord.vue';

const activeTab = ref('stray-pet');
</script>

<style scoped>
.container {
  max-width: 800px;
}

.nav-link.active {
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #fff;
}
</style>

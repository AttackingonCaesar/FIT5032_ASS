<template>
  <div class="container mt-5">
    <h3>Salvage Record Details</h3>

    <div v-if="!salvageRecord" class="text-center">
      <p>Loading...</p>
    </div>

    <div v-if="salvageRecord" class="mt-4">
      <!-- Explorer -->
      <div class="mb-3">
        <strong>Explorer:</strong> {{ salvageRecord.user.username }}
      </div>

      <!-- Created At -->
      <div class="mb-3">
        <strong>Created At:</strong> {{ formatDate(salvageRecord.createdAt.seconds) }}
      </div>

      <!-- Pet Breed -->
      <div class="mb-3">
        <strong>Pet Breed:</strong> {{ salvageRecord.strayPet.petBreed }}
      </div>

      <!-- Description -->
      <div class="mb-3">
        <strong>Description:</strong> {{ salvageRecord.description }}
      </div>

      <!-- Uploaded Images -->
      <div class="mb-3">
        <strong>Images:</strong>
        <div class="row">
          <div
              class="col-4"
              v-for="(imageUrl, index) in salvageRecord.imageUrls"
              :key="index"
          >
            <img :src="imageUrl" class="img-fluid img-thumbnail" alt="Uploaded Image" />
          </div>
        </div>
      </div>

      <!-- Map (render strayPet coordinates) -->
      <div class="mb-3">
        <strong>Location:</strong>
        <div id="map" class="map-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSalvageRecordDetail } from '../composables/useSalvageRecordDetail.js';
import L from 'leaflet';

// 获取路由中的id
const route = useRoute();
const id = route.params.id;

// 获取救助记录详细数据
const { salvageRecord } = useSalvageRecordDetail(id);

// 日期格式化函数
const formatDate = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// 地图初始化和多边形绘制
onMounted(() => {
  setTimeout(() => {
    if (salvageRecord.value && salvageRecord.value.strayPet.coordinates.length > 0) {
      const map = L.map('map').setView([salvageRecord.value.strayPet.coordinates[0].latitude, salvageRecord.value.strayPet.coordinates[0].longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // 使用坐标绘制多边形
      const points = salvageRecord.value.strayPet.coordinates.map(coord => [coord.latitude, coord.longitude]);
      L.polygon(points).addTo(map);
      map.fitBounds(L.polygon(points).getBounds());
    }
  }, 3000)
});
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
  border: 1px solid #ccc;
}
</style>

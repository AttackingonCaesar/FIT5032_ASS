<template>
  <div class="container mt-5">
    <h3>Publish Stray Pet Information</h3>

    <form @submit.prevent="submitForm" class="mt-4">
      <!-- Pet Breed Dropdown -->
      <div class="mb-3">
        <label for="petBreed" class="form-label">Pet Breed</label>
        <select v-model="form.petBreed" class="form-select" id="petBreed" required>
          <option value="" disabled>Select a Pet Breed</option>
          <option v-for="breed in breeds" :key="breed" :value="breed">{{ breed }}</option>
        </select>
      </div>

      <!-- Pet Quantity Input -->
      <div class="mb-3">
        <label for="petQuantity" class="form-label">Pet Quantity</label>
        <input
            type="number"
            v-model="form.petQuantity"
            class="form-control"
            id="petQuantity"
            min="1"
            required
        />
      </div>

      <!-- Appear Address Input -->
      <div class="mb-3">
        <label for="appearAddress" class="form-label">Appear Address</label>
        <input
            type="text"
            v-model="form.appearAddress"
            class="form-control"
            id="appearAddress"
            required
        />
      </div>

      <!-- Leaflet Map -->
      <div class="mb-3">
        <label for="map" class="form-label">Select Area</label>
        <div id="map" class="map-container"></div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import L from 'leaflet';
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebaseConfig.js";
import {useUserData} from "../composables/useUserData.js";
import {useToast} from "vue-toast-notification";
import {useRouter} from "vue-router";
const $toast = useToast();
const {userData} = useUserData();
const router = useRouter();

if (userData && userData.value && userData.value.role !== 'explorer') {
  $toast.error('You are not authorized to access this page.');
  router.push('/');
}

const breeds = [
  'Cat', 'Dog', 'Rabbit', 'Bird', 'Hamster', 'Guinea Pig', 'Turtle', 'Others'
];

const form = reactive({
  petBreed: '',
  petQuantity: 1,
  appearAddress: '',
  coordinates: []
});

const submitForm = async () => {
  if (!form.petBreed || form.petQuantity <= 0 || !form.appearAddress || form.coordinates.length < 4) {
    $toast.error('Please fill in all fields.');
    return;
  }
  try {

    await addDoc(collection(db, 'strayPets'), {
      petBreed: form.petBreed,
      petQuantity: form.petQuantity,
      appearAddress: form.appearAddress,
      coordinates: form.coordinates.map(item => {
        return {
          latitude: item.lat,
          longitude: item.lng
        }
      }),
      uid: localStorage.getItem('uid'),
      username: localStorage.getItem('username')
    });
    $toast.success('Stray pet information submitted successfully.');
    router.push('/');
  } catch (error) {
    $toast.error('Failed to submit stray pet information.');
    console.log(error);
  }

};


function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];
  const points = ref([]);
  let polygon = null;

  map.on('click', function(e) {
    if (markers.length === 4) {
      const firstMarker = markers.shift();
      map.removeLayer(firstMarker);
      points.value.shift();
    }

    const marker = L.marker(e.latlng).addTo(map);
    markers.push(marker);
    points.value.push(e.latlng);

    if (points.value.length === 4) {
      if (polygon) {
        map.removeLayer(polygon);
      }

      polygon = L.polygon(points.value).addTo(map);
      form.coordinates = points.value;
    }
  });
}

function errorCallback(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
  border: 1px solid #ccc;
}
</style>

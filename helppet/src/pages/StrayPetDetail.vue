<template>
  <div class="container mt-5">
    <h3>Stray Pet Details</h3>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="strayPet" class="mt-4">
      <div class="mb-3">
        <button
            @click="handleClickHelp"
            class="btn btn-primary">Help</button>
      </div>

      <!-- Pet Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Basic Information</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <strong>Pet Breed:</strong> {{ strayPet.petBreed }}
          </div>
          <div class="mb-3">
            <strong>Pet Quantity:</strong> {{ strayPet.petQuantity }}
          </div>
          <div class="mb-3">
            <strong>Appear Address:</strong> {{ strayPet.appearAddress }}
          </div>
          <div class="mb-3">
            <strong>Explorer Name:</strong> {{ strayPet.user.username }}
          </div>
          <div class="mb-3">
            <strong>Average Rate:</strong> {{ averageMark }}
          </div>
          <button
              @click="subscribeEvent"
              v-if="!subscribed" :disabled="!userData" class="btn btn-warning">Subscribe Salvage </button>
          <button
              @click="unsubscribeEvent"
              v-else :disabled="!userData" class="btn btn-dark">Unsubscribe Salvage </button>
          <div class="mt-2">
            <Mark :record-id="strayPet.id" type="'strayPet'" />
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Location</h4>
        </div>
        <div class="card-body">
          <div id="map" class="map-container"></div>
        </div>
      </div>

      <!-- Salvage Records -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Rescue Records</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <template v-if="strayPet.salvageRecords && strayPet.salvageRecords.length > 0">
              <div v-for="record in strayPet.salvageRecords"
                   :key="record.id"
                   class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                  <!-- Image Carousel -->
                  <div v-if="record.imageUrls && record.imageUrls.length > 0"
                       :id="'carousel-'+record.id"
                       class="carousel slide"
                       data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div v-for="(imageUrl, index) in record.imageUrls"
                           :key="index"
                           class="carousel-item"
                           :class="{ active: index === 0 }">
                        <img :src="imageUrl"
                             class="d-block w-100"
                             alt="Rescue Image"
                             style="height: 200px; object-fit: cover;">
                      </div>
                    </div>
                    <button v-if="record.imageUrls.length > 1"
                            class="carousel-control-prev"
                            type="button"
                            :data-bs-target="'#carousel-'+record.id"
                            data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button v-if="record.imageUrls.length > 1"
                            class="carousel-control-next"
                            type="button"
                            :data-bs-target="'#carousel-'+record.id"
                            data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>

                  <div class="card-body">
                    <p>
                      <i class="bi bi-person-circle">
                        {{record.volunteer.username}}
                      </i>
                    </p>
                    <h5 class="card-title">{{ record.method }}</h5>
                    <p class="card-text">{{ record.description }}</p>
                    <p class="card-text">
                      <small class="text-muted">
                        {{ new Date(record.createdAt.seconds * 1000).toLocaleString() }}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="col-12">
              <p class="text-center">No rescue records available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStrayPetDetail} from "../composables/useStrayPetDetail";
import L from "leaflet";
import Mark from "../components/Mark.vue";
import {addDoc, collection, getDocs, query, where, deleteDoc} from "firebase/firestore";
import {db} from "../firebaseConfig.js";
import {useUserData} from "../composables/useUserData.js";
import {useToast} from "vue-toast-notification";

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const {userData} = useUserData();
const marks = ref([]);
const $toast = useToast();
const subscribed = ref(false);
const averageMark = computed(() => {
  if (marks.value.length === 0) {
    return 0;
  }
  const sum = marks.value.reduce((acc, mark) => acc + mark.score, 0);
  return sum / marks.value.length;
});
onMounted(() => {
  const fetchMarks = async () => {
    const marksRef = collection(db, "mark");
    const q = query(marksRef, where("recordId", "==", id));
    const querySnapshot = await getDocs(q);
    for (let item of querySnapshot.docs) {
      marks.value.push({
        id: item.id,
        ...item.data(),
      });

    }
  }
  fetchMarks();

  const fetchSubscribed = async () => {
    const subscribedRef = collection(db, "subscribed");
    const q = query(subscribedRef, where("recordId", "==", id), where("uid", "==", localStorage.getItem('uid')));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      subscribed.value = true;
    }
  }
  fetchSubscribed();
});

const subscribeEvent = async () => {
  const uid = localStorage.getItem('uid');
  await addDoc(collection(db, 'subscribed'), {
    uid,
    recordId: id,
    email: userData.value.email,
  });
  subscribed.value = true;
  $toast.success(`Subscribed successfully, please check your email: ${userData.value.email} for further information.`);
}
const unsubscribeEvent = async () => {
  const uid = localStorage.getItem('uid');
  const subscribedRef = collection(db, 'subscribed');
  const q = query(subscribedRef, where('uid', '==', uid), where('recordId', '==', id));
  const querySnapshot = await getDocs(q);
  for (let doc of querySnapshot.docs) {
    await deleteDoc(doc.ref);
  }
  $toast.success('Unsubscribed successfully');
  subscribed.value = false;
}

const {strayPet, loading, error} = useStrayPetDetail(id);

const handleClickHelp = () => {
  router.push(`/help/${id}`);
}

onMounted(() => {
  setTimeout(() => {
    if (strayPet.value) {
      const firstPoint = strayPet.value.coordinates[0];
      const map = L.map("map").setView([firstPoint.latitude, firstPoint.longitude], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      if (strayPet.value.coordinates && strayPet.value.coordinates.length > 0) {
        const points = strayPet.value.coordinates.map(coord => [coord.latitude, coord.longitude]);

        L.polygon(points).addTo(map);
        map.fitBounds(L.polygon(points).getBounds());
      }
    }
  }, 2000)
});
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
  border: 1px solid #ccc;
}

.carousel-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
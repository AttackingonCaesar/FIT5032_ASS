<template>
  <div class="rating-component" v-if="!marked">
    <div class="stars">
      <i
          v-for="star in 5"
          :key="star"
          class="bi"
          :class="star <= currentScore ? 'bi-star-fill' : 'bi-star'"
          @click="submitScore(star)"
          style="font-size: 2rem; cursor: pointer; color: gold;"
      ></i>
    </div>

    <div class="flex gap-1">
      <input
          v-model="comment"
          class="form-control" placeholder="Enter your comment here..."/>
      <button @click="submitComment"
              :disabled="!userData"
              class="btn mt-1 btn-primary">Submit</button>
    </div>
  </div>

  <div class="alert alert-warning" v-if="marked">
    <p>You have already marked this record</p>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {useToast} from "vue-toast-notification";
import {useUserData} from "../composables/useUserData.js";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  recordId: {
    type: String,
    required: true,
  },
});

const {userData} = useUserData();
const currentScore = ref(0);
const comment = ref('');
const uid = localStorage.getItem("uid");
const $toast = useToast();
const marked = ref(true);

onMounted(() => {
  const fetchMark = async () => {
    const marksRef = collection(db, "mark");
    const q = query(
        marksRef,
        where("uid", "==", uid),
        where("type", "==", props.type),
        where("recordId", "==", props.recordId)
    );
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot)
    if (querySnapshot.empty) {
      marked.value = false;
    }
  }
  fetchMark();
});

const submitComment = async () => {

  try {
    const marksRef = collection(db, "mark");
    await addDoc(marksRef, {
      type: props.type,
      recordId: props.recordId,
      score: currentScore.value,
      uid: uid,
      comment: comment.value
    });
    $toast.success("Comment submitted successfully");
    marked.value = true;

  } catch (error) {
    $toast.error("Error submitting score:", error);
  }
}
const submitScore = async (score) => {
  try {

    currentScore.value = score;



  } catch (error) {
    console.error("Error submitting score:", error);
  }
};
</script>

<style scoped>
.stars {
  display: flex;
  gap: 0.5rem;
}
</style>

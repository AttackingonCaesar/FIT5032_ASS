<template>
  <div class="container mt-5">
    <h3>Help Rescue a Pet</h3>

    <form @submit.prevent="submitForm" class="mt-4">
      <!-- Textarea for description -->
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            id="description"
            class="form-control"
            rows="4"
            v-model="form.description"
            placeholder="Describe how you helped the pet..."
            required
        ></textarea>
        <div v-if="descriptionError" class="text-danger">{{ descriptionError }}</div>
      </div>

      <!-- Method Select Section -->
      <div class="mb-3">
        <label for="method" class="form-label">Method</label>
        <select id="method" class="form-control" v-model="form.method" required>
          <option disabled value="">Select a method</option>
          <option value="Feeding">Feeding</option>
          <option value="Seeing Doctors">Seeing Doctors</option>
          <option value="Bathing">Bathing</option>
          <option value="Finding Owners">Finding Owners</option>
          <option value="Vaccines">Vaccines</option>
        </select>
      </div>

      <!-- Image Upload Section -->
      <div class="mb-3">
        <label class="form-label">Upload Rescue Photos</label>
        <input
            type="file"
            multiple
            accept="image/*"
            @change="handleFileUpload"
            class="form-control"
        />
        <div v-if="imageError" class="text-danger">{{ imageError }}</div>

        <!-- Uploaded Images Preview -->
        <div class="mt-3" v-if="form.images.length > 0">
          <h5>Uploaded Images:</h5>
          <div class="row">
            <div
                class="col-3"
                v-for="(image, index) in form.images"
                :key="index"
                style="position: relative;"
            >
              <img
                  :src="image.url"
                  class="img-thumbnail"
                  alt="Uploaded Image"
                  style="height: 100px; object-fit: cover;"
              />
              <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="removeImage(index)"
                  style="position: absolute; top: 5px; right: 5px;"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary" :disabled="isUploading">Submit</button>
      <div v-if="isUploading" class="mt-3 text-info">Uploading images, please wait...</div>
    </form>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import {useToast} from "vue-toast-notification";
import {useUserData} from "../composables/useUserData.js";

const form = ref({
  description: '',
  images: [],
  method: '',
});

const descriptionError = ref('');
const imageError = ref('');
const isUploading = ref(false);
const $toast = useToast();
// 获取路由中的 strayPetId
const route = useRoute();
const strayPetId = route.params.id;
const router = useRouter();
const { userData } = useUserData();
watch(userData, (data) => {

  if (data && data.value && data.value?.role !== 'volunteer') {
    $toast.error('You are not authorized to access this page.');
    router.push('/');

  }
  // if (userData && userData.value?.role !== 'volunteer') {
  //   $toast.error('You are not authorized to access this page.');
  //   router.push('/');
  //
  // }
});

// 表单验证逻辑
const validateForm = () => {
  let valid = true;

  if (!form.value.description.trim()) {
    descriptionError.value = 'Description is required.';
    valid = false;
  } else {
    descriptionError.value = '';
  }

  if (form.value.method === '') {
    alert('Please select a method.');
    valid = false;
  }

  if (form.value.images.length === 0) {
    imageError.value = 'Please upload at least one image.';
    valid = false;
  } else {
    imageError.value = '';
  }

  return valid;
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files;
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.images.push({
        file: file,
        url: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  });
};

// 删除已上传的图片
const removeImage = (index) => {
  form.value.images.splice(index, 1);
};

// 上传图片到 Firebase Storage
const uploadImagesToStorage = async () => {
  const storage = getStorage();
  const uploadPromises = form.value.images.map((image) => {
    const imageRef = storageRef(storage, `rescueImages/${uuidv4()}`);
    return uploadBytes(imageRef, image.file).then((snapshot) =>
        getDownloadURL(snapshot.ref)
    );
  });
  return Promise.all(uploadPromises);
};

// 表单提交逻辑
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    isUploading.value = true;

    // 1. 上传图片到 Firebase Storage 并获取 URL
    const imageUrls = await uploadImagesToStorage();

    // 2. 获取 localStorage 中的 uid
    const uid = localStorage.getItem('uid');

    // 3. 保存到 Firestore 中的 salvageRecord 集合
    const salvageRecordRef = collection(db, 'salvageRecord');
    await addDoc(salvageRecordRef, {
      description: form.value.description,
      imageUrls: imageUrls,
      method: form.value.method,
      strayPetId: strayPetId,
      uid: uid,
      createdAt: new Date(),
    });

    $toast.success('Rescue information submitted successfully.');

    // 重置表单
    form.value.description = '';
    form.value.images = [];
    form.value.method = '';
  } catch (error) {
    console.error('Error submitting form:', error);
    $toast.error('Failed to submit rescue information.');
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.img-thumbnail {
  height: 100px;
  width: 100%;
  object-fit: cover;
}
</style>

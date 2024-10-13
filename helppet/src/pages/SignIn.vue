<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center">Login</h3>
            <form @submit.prevent="handleLogin">
              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    type="email"
                    v-model="email"
                    class="form-control"
                    id="email"
                    :class="{ 'is-invalid': emailError }"
                    required
                />
                <div v-if="emailError" class="invalid-feedback">
                  {{ emailError }}
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    v-model="password"
                    class="form-control"
                    id="password"
                    :class="{ 'is-invalid': passwordError }"
                    required
                />
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
              </div>

              <!-- Login Button -->
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </form>

            <!-- Third-party login button -->
            <div class="d-grid mt-3">
              <button @click="handleThirdPartyLogin" class="btn btn-secondary">
                Sign in with Google
              </button>
            </div>

            <!-- Link to Register -->
            <div class="text-center mt-3">
              <p>
                Don't have an account? <a href="/signup">Register</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {auth, db} from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import * as Yup from 'yup';
import {useToast} from "vue-toast-notification";
import {useRouter} from "vue-router";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
const $toast = useToast();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');
const router = useRouter();

// Firebase Third-party login (Google)
const provider = new GoogleAuthProvider();
const handleThirdPartyLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userRef = collection(db, 'users');
    const q = query(userRef, where('uid', '==', result.user.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {

      let option = window.prompt("Please enter 1 for explorer and 2 for volunteer");

      while (option !== '1' && option !== '2') {
        option = window.prompt("Please enter 1 for explorer and 2 for volunteer");
      }

      let roleValue = option === '1' ? 'explorer' : 'volunteer';

      await addDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        role: roleValue,
        username: result.user.displayName,
      });
      $toast.open({
        message: 'Logged in with Google and registered successfully',
        type: 'success',
      });
      window.location.href = '/';

    } else {
      // Show success message
      $toast.open({
        message: 'Logged in with Google successfully',
        type: 'success',
      });

      window.location.href = '/';
    }
    localStorage.setItem('uid', result.user.uid);
    localStorage.setItem('username', result.user.displayName);
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Form validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
});

// Login user with validation
const handleLogin = async () => {
  try {
    const isValid = await validationSchema.validate({ email: email.value, password: password.value }, { abortEarly: false });
    if (isValid) {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      localStorage.setItem('uid', userCredential.user.uid);
      localStorage.setItem('username', userCredential.user.displayName);
      // Show success message
      $toast.open({
        message: 'Logged in successfully',
        type: 'success',
      });

      errorMessage.value = '';

      window.location.href = '/';
    }
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((err) => {
        if (err.path === 'email') {
          emailError.value = err.message;
        }
        if (err.path === 'password') {
          passwordError.value = err.message;
        }
      });
    } else {
      errorMessage.value = error.message;
    }
  }
};
</script>

<style scoped>


.invalid-feedback {
  display: block;
}
</style>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center">Register</h3>
            <form @submit.prevent="handleRegister">
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

              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                    type="text"
                    v-model="username"
                    class="form-control"
                    id="username"
                    :class="{ 'is-invalid': usernameError }"
                    required
                />
                <div v-if="usernameError" class="invalid-feedback">
                  {{ usernameError }}
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

              <!-- Role Selection -->
              <div class="mb-3">
                <label for="role" class="form-label">Select Role</label>
                <select v-model="role" class="form-select" id="role">
                  <option value="explorer">Explorer</option>
                  <option value="volunteer">Volunteer</option>
                </select>
                <div class="form-text mt-2">
                  {{ roleDescription }}
                </div>
              </div>

              <!-- Register Button -->
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Register</button>
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

            <!-- Link to Signin -->
            <div class="text-center mt-3">
              <p>
                Already have an account? <a href="/signin">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import * as Yup from 'yup';
import {useToast} from "vue-toast-notification";
import {useRouter} from "vue-router";
const $toast = useToast();
const email = ref('');
const password = ref('');
const username = ref('');
const role = ref('explorer');
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');
const usernameError = ref('');
const router = useRouter();

// Role description based on selected role
const roleDescription = computed(() => {
  return role.value === 'explorer'
      ? 'Explorer: Search for stray pets, upload location photos'
      : 'Volunteer: Rescue stray pets, feed stray pets';
});

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
      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('username', result.user.displayName);
      window.location.href = '/';

    } else {
      $toast.open({
        message: 'Logged in with Google',
        type: 'success',
      });
      window.location.href = '/';
      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('username', result.user.displayName);
    }

    localStorage.setItem('uid', result.user.uid);
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

// Register user with validation
const handleRegister = async () => {
  try {
    const isValid = await validationSchema.validate(
        { email: email.value, password: password.value },
        { abortEarly: false }
    );
    if (isValid) {
      const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
      );


      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: role.value,
        username: username.value,
      });


      errorMessage.value = '';
      $toast.open({
        message: 'Registered successfully',
        type: 'success',
      });
      router.push('/signin');
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

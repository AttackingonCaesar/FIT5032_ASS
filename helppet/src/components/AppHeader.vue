<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
      <!-- Brand -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <i class="bi bi-heart-fill text-danger me-2"></i>
        <span class="fw-bold">PetRescue</span>
      </router-link>

      <!-- Hamburger Button -->
      <button
          @click="handleClickHamburger"
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Home -->
          <li class="nav-item">
            <router-link
                class="nav-link px-3 d-flex align-items-center"
                :class="{ 'active': currentRoute === '/' }"
                to="/"
            >
              <i class="bi bi-house-door me-2"></i>
              <span>Home</span>
            </router-link>
          </li>

          <!-- Not Logged In -->
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link
                  class="nav-link px-3 d-flex align-items-center"
                  :class="{ 'active': currentRoute === '/login' }"
                  to="/signin"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                <span>Login</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  class="nav-link px-3 d-flex align-items-center"
                  :class="{ 'active': currentRoute === '/register' }"
                  to="/signup"
              >
                <i class="bi bi-person-plus me-2"></i>
                <span>Register</span>
              </router-link>
            </li>
          </template>

          <!-- Logged In -->
          <template v-else>
            <li class="nav-item">
              <router-link
                  class="nav-link px-3 d-flex align-items-center"
                  :class="{ 'active': currentRoute === '/profile' }"
                  to="/profile"
              >
                <i class="bi bi-person-circle me-2"></i>
                <span>Profile</span>
              </router-link>
            </li>
            <li class="nav-item">
              <button
                  @click="handleLogout"
                  class="btn btn-outline-danger ms-lg-3 d-flex align-items-center"
              >
                <i class="bi bi-box-arrow-right me-2"></i>
                <span>Logout</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <div class="d-block d-md-none overflow-hidden w-100" :style="{height: openMobileMenu ? 'auto' : '0px'}">
      <ul class="navbar-nav ms-auto align-items-center">
        <!-- Home -->
        <li class="nav-item">
          <router-link
              class="nav-link px-3 d-flex align-items-center"
              :class="{ 'active': currentRoute === '/' }"
              to="/"
          >
            <i class="bi bi-house-door me-2"></i>
            <span>Home</span>
          </router-link>
        </li>

        <!-- Not Logged In -->
        <template v-if="!isLoggedIn">
          <li class="nav-item">
            <router-link
                class="nav-link px-3 d-flex align-items-center"
                :class="{ 'active': currentRoute === '/login' }"
                to="/signin"
            >
              <i class="bi bi-box-arrow-in-right me-2"></i>
              <span>Login</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
                class="nav-link px-3 d-flex align-items-center"
                :class="{ 'active': currentRoute === '/register' }"
                to="/signup"
            >
              <i class="bi bi-person-plus me-2"></i>
              <span>Register</span>
            </router-link>
          </li>
        </template>

        <!-- Logged In -->
        <template v-else>
          <li class="nav-item">
            <router-link
                class="nav-link px-3 d-flex align-items-center"
                :class="{ 'active': currentRoute === '/profile' }"
                to="/profile"
            >
              <i class="bi bi-person-circle me-2"></i>
              <span>Profile</span>
            </router-link>
          </li>
          <li class="nav-item">
            <button
                @click="handleLogout"
                class="btn btn-outline-danger ms-lg-3 d-flex align-items-center"
            >
              <i class="bi bi-box-arrow-right me-2"></i>
              <span>Logout</span>
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const isAuthenticated = () => {
  return !!localStorage.getItem("uid");
};
const isLoggedIn = isAuthenticated();
const route = useRoute()
const router = useRouter()
const openMobileMenu = ref(false);


const currentRoute = computed(() => route.path)

const handleClickHamburger = () => {
  openMobileMenu.value = !openMobileMenu.value;
}

const handleLogout = () => {
  localStorage.removeItem('uid');
  window.location.href = '/signin';
}
</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
}

.nav-link {
  position: relative;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--bs-danger) !important;
}

.nav-link.active {
  color: var(--bs-danger) !important;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background-color: var(--bs-danger);
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991.98px) {
  .nav-link.active::after {
    display: none;
  }

  .nav-link {
    padding: 0.5rem 0;
  }

  .navbar-nav {
    padding: 1rem 0;
  }

  .btn-outline-danger {
    width: 100%;
    text-align: left;
    padding: 0.5rem 0;
    border: none;
    background: transparent;
    color: var(--bs-navbar-color);
  }

  .btn-outline-danger:hover {
    background: transparent;
    color: var(--bs-danger);
  }
}
</style>
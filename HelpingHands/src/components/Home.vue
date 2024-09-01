<template>
  <div class="home">
    <header>
      <h1 class="site-title">HelpingHands</h1>
      <nav>
        <ul>
          <li v-if="!isLoggedIn">
            <button @click="openLoginModal">Login</button>
          </li>
          <li v-else>
            <span class="username">Welcome, {{ username }}</span>
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </nav>
    </header>

    <section class="intro">
      <div class="links">
        <router-link to="#" class="link-item">About Us</router-link>
        <router-link to="#" class="link-item">Related Sites</router-link>
        <router-link to="#" class="link-item">Contact Us</router-link>
        <router-link to="#" class="link-item">News</router-link>
      </div>
    </section>

    <section class="navigation">
      <h3>Select Your Category</h3>
      <div class="nav-links">
        <button class="nav-item">Skilled Immigrants</button>
        <button class="nav-item">Refugees</button>
        <button class="nav-item">Other</button>
      </div>
    </section>

    <button class="rate-button" @click="openRatingModal">Rate Us</button>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click.self="closeLoginModal">
      <div class="modal-content">
        <span class="close-button" @click="closeLoginModal">&times;</span>
        <h3>Login</h3>
        <input v-model="loginUsername" placeholder="Username" />
        <input v-model="loginPassword" type="password" placeholder="Password" />
        <button @click="login">Login</button>
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="modal-overlay" @click.self="closeRatingModal">
      <div class="modal-content">
        <span class="close-button" @click="closeRatingModal">&times;</span>
        <h3>Rate Us</h3>
        <p>Please select a rating from 1 to 10:</p>
        <div class="rating-container">
          <label v-for="n in 10" :key="n">
            <input type="radio" :value="n" v-model="rating" />
            {{ n }}
          </label>
        </div>
        <button @click="submitRating">Submit</button>
      </div>
    </div>

    <!-- Admin Dashboard Content -->
    <div v-if="isAdmin" class="admin-dashboard">
      <h3>Admin Dashboard</h3>
      <div class="stats">
        <h4>Today's Visitors</h4>
        <p>{{ visitorsCount }}</p>
      </div>
      <div class="submissions">
        <h4>User Submissions</h4>
        <ul>
          <li v-for="(submission, index) in submissions" :key="index">
            {{ submission.username }} rated {{ submission.rating }} at {{ submission.timestamp }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      username: '',
      isAdmin: false,
      isLoggedIn: false,
      loginUsername: '',
      loginPassword: '',
      rating: 1,
      showLoginModal: false,
      showRatingModal: false,
      visitorsCount: Math.floor(Math.random() * 1150) + 50, // Random number between 50 and 1200
      submissions: JSON.parse(localStorage.getItem('userRatings')) || [] // Load ratings from local storage
    };
  },
  computed: {
    isLoggedIn() {
      this.username = localStorage.getItem('username') || '';
      this.isAdmin = localStorage.getItem('role') === 'admin';
      return this.username !== '';
    }
  },
  methods: {
    openLoginModal() {
      this.showLoginModal = true;
    },
    closeLoginModal() {
      this.showLoginModal = false;
    },
    login() {
      if (this.loginUsername === 'admin' && this.loginPassword === 'adminpass') {
        localStorage.setItem('username', 'admin');
        localStorage.setItem('role', 'admin');
      } else if (this.loginUsername === 'user' && this.loginPassword === 'wasd321!') {
        localStorage.setItem('username', 'user');
        localStorage.setItem('role', 'user');
      } else {
        alert('Invalid username or password');
        return;
      }
      this.username = this.loginUsername;
      this.isLoggedIn = true;
      this.isAdmin = localStorage.getItem('role') === 'admin';
      this.loginUsername = ''; // Clear username
      this.loginPassword = ''; // Clear password
      this.closeLoginModal();
    },
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.username = '';
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.push('/login');
    },
    openRatingModal() {
      this.showRatingModal = true;
    },
    closeRatingModal() {
      this.showRatingModal = false;
    },
    submitRating() {
      if (this.isLoggedIn) {
        const userRatings = JSON.parse(localStorage.getItem('userRatings')) || [];
        userRatings.push({ username: this.username, rating: this.rating, timestamp: new Date().toISOString() });
        localStorage.setItem('userRatings', JSON.stringify(userRatings));
        this.submissions = userRatings; // Update submissions
        this.closeRatingModal();
      } else {
        alert('You must be logged in to submit a rating.');
      }
    }
  }
}
</script>

<style scoped>
/* Header Styles */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
}

.site-title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 15px;
}

nav ul li {
  display: flex;
  align-items: center;
}

nav ul li button {
  background-color: var(--secondary-color);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
}

nav ul li button:hover {
  background-color: var(--primary-color);
}

.username {
  margin-right: 1rem;
}

/* Intro Section Styles */
.intro {
  margin: 3rem auto;
  text-align: center;
}

.links {
  margin-top: 2rem;
}

.link-item {
  display: inline-block;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--background-color);
  border-radius: 4px;
  font-size: 1.25rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
}

.link-item:hover {
  background-color: var(--secondary-color);
  color: white;
}

/* Category Selection Styles */
.navigation {
  margin: 3rem auto;
  text-align: center;
}

.navigation h3 {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2rem;
  color: var(--primary-color);
}

.nav-links {
  display: inline-flex;
  justify-content: center;
  margin-top: 2rem;
}

.nav-item {
  margin: 0 1rem;
  padding: 1rem 2rem;
  background-color: var(--background-color);
  border-radius: 8px;
  font-size: 1.5rem;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Arial', 'Helvetica', sans-serif;
}

.nav-item:hover {
  background-color: var(--hover-background-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

.rating-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.rate-button {
  display: block;
  width: 200px;
  margin: 3rem auto; /* Center horizontally and add margin */
  padding: 1rem;
  background-color: var(--secondary-color);
  border: none;
  color: white;
  font-size: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.rate-button:hover {
  background-color: var(--primary-color);
}

/* Admin Dashboard Styles */
.admin-dashboard {
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 800px;
}

.admin-dashboard h3 {
  font-size: 2rem;
  color: var(--primary-color);
}

.stats, .submissions {
  margin-bottom: 2rem;
}

.submissions ul {
  list-style-type: none;
  padding: 0;
}

.submissions li {
  margin-bottom: 0.5rem;
}
</style>

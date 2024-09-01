<template>
  <div class="home">
    <header>
      <h1 class="site-title">HelpingHands</h1>
      <nav>
        <ul class="nav-list">
          <li v-if="!isLoggedIn">
            <button class="btn btn-primary" data-toggle="modal" data-target="#loginModal">Login</button>
          </li>
          <li v-else>
            <span class="username">Welcome, {{ username }}</span>
            <button class="btn btn-secondary" @click="logout">Logout</button>
          </li>
        </ul>
      </nav>
    </header>

    <section class="intro">
      <div class="links">
        <a href="#" class="link-item" @click.prevent="showSection('about')">About Us</a>
        <a href="#" class="link-item" @click.prevent="showSection('relatedSites')">Related Sites</a>
        <a href="#" class="link-item" @click.prevent="showSection('contact')">Contact Us</a>
        <a href="#" class="link-item" @click.prevent="showSection('news')">News</a>
      </div>
    </section>

    <section class="navigation">
      <h3>Select Your Category</h3>
      <div class="nav-links">
        <button class="btn btn-outline-success nav-item" @click="selectCategory('Skilled Immigrants')">Skilled Immigrants</button>
        <button class="btn btn-outline-success nav-item" @click="selectCategory('Refugees')">Refugees</button>
        <button class="btn btn-outline-success nav-item" @click="selectCategory('Other')">Other</button>
      </div>
    </section>

    <button class="btn btn-warning rate-button" data-toggle="modal" data-target="#ratingModal">Rate Us</button>

    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Login</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="loginUsername">Username</label>
                <input type="text" id="loginUsername" v-model="loginUsername" class="form-control" :class="{ 'is-invalid': loginError }" required>
                <div v-if="loginError" class="invalid-feedback">
                  {{ loginError }}
                </div>
              </div>
              <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" v-model="loginPassword" class="form-control" :class="{ 'is-invalid': loginError }" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ratingModalLabel">Rate Us</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitRating">
              <div class="form-group">
                <label for="rating">Rate from 1 to 10</label>
                <input type="number" id="rating" v-model="rating" min="1" max="10" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary">Submit Rating</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <section v-if="currentSection === 'about'" class="info-section">
      <h2>About Us</h2>
      <p>HelpingHands was established in 2010 to provide comprehensive support and assistance to immigrants and refugees. We understand that relocating to a new country can be challenging, especially if you are facing language barriers, cultural differences, and adjustment to life. Therefore, we have created this platform as a comprehensive resource center to help you integrate smoothly into your new environment.</p>
      <p>Our history began with a group of dedicated volunteers who witnessed the difficulties and struggles of immigrants and refugees as they adjusted to their new lives. They were determined to take action and provide practical support to these new arrivals. Through years of growth and continuous improvement, HelpingHands has become a trusted resource center offering a variety of services including language training, legal advice, medical resources, career opportunities, and educational support.</p>
      <p>We have a special focus on skilled immigrants, refugees, and other types of immigrants, and each of our services has been carefully designed to meet the needs of a variety of users. Our platform offers an intuitive and easy-to-use interface that ensures users can quickly find the information they need. We also provide users with a secure login system that protects their personal information and allows them to access customized services.</p>
      <p>More than just a resource platform, HelpingHands carries our commitment to the community - to help every immigrant and refugee build a better life. Our mission is to help them overcome challenges and achieve success and happiness by providing the necessary tools and support. We believe that through solidarity and cooperation, we can together create a more inclusive and caring society.</p>
    </section>

    <section v-if="currentSection === 'relatedSites'" class="info-section">
      <h2>Related Sites</h2>
      <ul>
        <li><a href="https://www.redcross.org" target="_blank">Red Cross</a></li>
        <li><a href="https://www.unhcr.org" target="_blank">UNHCR</a></li>
        <li><a href="https://www.immigration.gov" target="_blank">Immigration Services</a></li>
      </ul>
    </section>

    <section v-if="currentSection === 'contact'" class="info-section">
      <h2>Contact Us</h2>
      <p>Address: 123 Charity Lane, Melbourne</p>
      <p>Phone: (03) 1234 5678</p>
      <p>Email: contact@helpinghands.org</p>
    </section>

    <section v-if="currentSection === 'news'" class="info-section">
      <h2>News</h2>
      <ul>
        <li>Latest updates on immigration policies.</li>
        <li>New language training programs available.</li>
        <li>Community events for newcomers.</li>
      </ul>
    </section>

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
      visitorsCount: Math.floor(Math.random() * 1150) + 50,
      submissions: JSON.parse(localStorage.getItem('userRatings')) || [],
      currentSection: ''
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
      // Ensure jQuery is available in your environment
      if (typeof $ !== 'undefined') {
        $('#loginModal').modal('show');
      } else {
        console.error('jQuery is not available');
      }
    },
    openRatingModal() {
      if (typeof $ !== 'undefined') {
        $('#ratingModal').modal('show');
      } else {
        console.error('jQuery is not available');
      }
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
      this.username = this.escapeHTML(this.loginUsername);
      this.isLoggedIn = true;
      this.isAdmin = localStorage.getItem('role') === 'admin';
      this.loginUsername = '';
      this.loginPassword = '';
      // Hide the modal after successful login
      $('#loginModal').modal('hide');
    },
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.username = '';
      this.isLoggedIn = false;
      this.isAdmin = false;
    },
    submitRating() {
      if (this.rating < 1 || this.rating > 10) {
        alert('Rating must be between 1 and 10');
        return;
      }
      const submission = {
        username: this.username,
        rating: this.rating,
        timestamp: new Date().toLocaleString()
      };
      this.submissions.push(submission);
      localStorage.setItem('userRatings', JSON.stringify(this.submissions));
      this.rating = 1;
      // Hide the modal after submission
      $('#ratingModal').modal('hide');
    },
    showSection(section) {
      this.currentSection = section;
    },
    selectCategory(category) {
      alert(`Selected category: ${category}`);
    },
    escapeHTML(s) {
      return String(s).replace(/[&<>"'`=\/]/g, (s) => {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;',
          '`': '&#x60;',
          '=': '&#x3D;'
        }[s];
      });
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.site-title {
  color: #004d99;
}
.nav-list {
  display: flex;
  list-style: none;
}
.nav-list li {
  margin-left: 1rem;
}
.nav-list .btn {
  margin: 0;
}
.intro {
  margin-top: 2rem;
}
.links {
  display: flex;
  justify-content: space-around;
}
.link-item {
  text-decoration: none;
  color: #007bff;
}
.link-item:hover {
  text-decoration: underline;
}
.navigation {
  margin-top: 2rem;
}
.nav-links {
  display: flex;
  justify-content: space-around;
}
.nav-item {
  margin: 0.5rem;
}
.rate-button {
  margin-top: 2rem;
}
.info-section {
  margin-top: 2rem;
}
.admin-dashboard {
  margin-top: 2rem;
}
</style>

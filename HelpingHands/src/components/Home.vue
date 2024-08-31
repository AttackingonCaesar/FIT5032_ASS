<template>
  <div class="home">
    <!-- Top Section -->
    <header class="header-container">
      <h1 class="site-title">HelpingHands</h1>
      <div class="search-container">
        <input type="text" placeholder="Search..." class="search-input"/>
      </div>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Login</a></li>
          <li><a href="#">Rating System</a></li>
        </ul>
      </nav>
    </header>

    <!-- Category Selection -->
    <section class="navigation">
      <h3>Select Your Category</h3>
      <div class="nav-links">
        <a href="#" class="nav-item">Skilled Immigrants</a>
        <a href="#" class="nav-item">Refugees</a>
        <a href="#" class="nav-item">Other</a>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="intro">
      <h2>Welcome to HelpingHands</h2>
      <p>
        HelpingHands is dedicated to providing essential resources, support, and guidance to those in need. Whether you're a skilled immigrant, a refugee, or belong to any other vulnerable group, we're here to assist you every step of the way.
      </p>
      <p>
        Our platform offers a variety of services tailored to meet the unique needs of different communities, ensuring that everyone has access to the help they need to thrive in their new environment.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
/* Top Section Styles */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.site-title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
}

.search-container {
  flex-grow: 1;
  text-align: center;
}

.search-input {
  width: 50%;
  padding: 5px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 15px;
}

nav ul li {
  margin-right: 15px;
}

nav ul li a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 1.1rem;
}

nav ul li a:hover {
  text-decoration: underline;
}

/* Category Selection Styles */
.navigation {
  margin: 3rem auto; /* Center the section horizontally */
  text-align: center; /* Center text and links */
}

.navigation h3 {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2rem;
  color: var(--primary-color);
}

.nav-links {
  display: inline-flex; /* Change to inline-flex to keep links centered */
  justify-content: center;
  margin-top: 2rem;
}

.nav-item {
  margin: 0 2rem;
  padding: 1rem 2rem;
  background-color: var(--background-color);
  border-radius: 8px;
  font-size: 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
  font-family: 'Arial', 'Helvetica', sans-serif;
}

.nav-item:hover {
  background-color: var(--hover-background-color);
}

/* Introduction Section Styles */
.intro {
  margin: 3rem auto; /* Center the section horizontally */
  text-align: center; /* Center text inside the section */
}

.intro h2 {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2.5rem;
  color: #ff8c00; /* Friendly color */
}

.intro p {
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 1.25rem;
  color: var(--text-color);
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 0 15%;
}
</style>

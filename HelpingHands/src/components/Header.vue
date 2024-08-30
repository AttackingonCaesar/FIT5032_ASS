<template>
  <header>
    <h1 class="site-title">HelpingHands</h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/rating">Rating System</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-title {
  font-size: 3rem;
  color: #4CAF50;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 15px;
}

nav ul li a {
  text-decoration: none;
  color: #007BFF;
  font-size: 1.1rem;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>

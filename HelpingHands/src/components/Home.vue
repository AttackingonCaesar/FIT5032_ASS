<template>
    <div class="home">
      <section class="intro">
        <h2>Welcome to HelpingHands</h2>
        <p>Your trusted resource for migrant support and services.</p>
      </section>
  
      <section class="navigation">
        <h3>Select Your Category</h3>
        <div class="nav-links">
          <router-link to="#" class="nav-item">Skilled Immigrants</router-link>
          <router-link to="#" class="nav-item">Refugees</router-link>
          <router-link to="#" class="nav-item">Other</router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    margin-top: 5rem;
  }
  
  .intro h2 {
    font-family: var(--title-font);
    font-size: 2.5rem;
    color: var(--primary-color);
  }
  
  .intro p {
    font-family: var(--body-font);
    font-size: 1.25rem;
    color: var(--text-color);
  }
  
  .navigation {
    margin-top: 3rem;
  }
  
  .navigation h3 {
    font-family: var(--heading-font);
    font-size: 2rem;
    color: var(--link-color);
  }
  
  .nav-links {
    display: flex;
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
    font-family: var(--body-font);
  }
  
  .nav-item:hover {
    background-color: var(--hover-background-color);
  }
  </style>
  
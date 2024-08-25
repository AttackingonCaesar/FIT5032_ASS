<template>
    <header class="header">
      <div class="container">
        <h1 class="site-title">HelpingHands</h1>
        <nav class="nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header'
  }
  </script>
  
  <style scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #f8f9fa;
    padding: 1rem 0;
    border-bottom: 1px solid #dee2e6;
    z-index: 1000;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .site-title {
    font-size: 1.5rem;
    color: #343a40;
    margin: 0;
  }
  
  .nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }
  
  .nav li {
    margin-left: 1rem;
  }
  
  .nav a {
    text-decoration: none;
    color: #007bff;
    font-size: 1rem;
  }
  
  .nav a:hover {
    text-decoration: underline;
  }
  </style>
  
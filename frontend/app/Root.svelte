<script>
  import Upload from './components/Upload'
  import Torrents from './components/Torrents'
  import Torrent from './components/Torrent'

  import { Router, link, Route } from 'svelte-routing'

  let visible = false
</script>

<style>
  .navbar-brand {
    font-size: 1.2rem;
  }
</style>

<Router>
  
  <div class="navbar is-warning">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/" use:link>
          <i class="fas fa-igloo fa-lg"></i>
          &nbsp;&nbsp;Igloo
        </a>
  
        <a 
          role="button" 
          class="navbar-burger burger" 
          class:is-active="{visible}" 
          on:click="{ () => visible = !visible }">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" class:is-active="{visible}">
        <div class="navbar-start">
          <a href="/torrents" class="navbar-item" use:link><i class="fas fa-list"></i>&nbsp;&nbsp;Torrents</a>
          <a href="/upload" class="navbar-item" use:link><i class="fas fa-arrow-up"></i>&nbsp;&nbsp;Upload</a>
        </div>
      </div>
    </div>
  </div>

  <Route path="upload" component="{Upload}" />
  <Route path="torrents" component="{Torrents}" />
  <Route path="torrents/:id" component="{Torrent}" />
</Router>
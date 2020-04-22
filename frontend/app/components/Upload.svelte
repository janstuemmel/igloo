<script>
  import axios from 'axios'
  import { navigate } from 'svelte-routing'
  import parseTorrent from 'parse-torrent'
  import { readInputFile } from '../util'

  export let location
  let file
  let title
  let error

  async function submit(evt) {
    
    const data = new FormData(evt.target)

    try {
     
      const res = await axios({ method: 'post', url: '/api/torrents', data })
      const id = res.data

      // on succes navigate to torrent page
      navigate(`/torrents/${id}`)

    } catch (err) {
      
      if (err.response) {
        error = err.response.data
      } else if(err.request) {
        error = 'Cannot connect to server'
      } else {
        error = 'Unknown Error'
      }
    }
  }

  async function fileSelect(evt) {
    
    file = evt.target.files[0].name
    title = file.replace('.torrent', '')

    // TODO: parse torrent to check for mistakes
    const contents = await readInputFile(evt.target.files[0])
    const torrent = parseTorrent(new Buffer(contents))
  }
</script>

<div class="section">
  <div class="container">
    <h1 class="title">Upload</h1>
    <h2 class="subtitle">
      Upload a <code>.torrent</code> file
    </h2>

    <article class="message is-dark">
      <div class="message-body">
        <h1 class="title is-5">How to create a torrent</h1>
        <ol class="content">
          <li>1. Create a <strong>new torrent</strong> in your client</li>
          <li>2. Select the <strong>file</strong> or <strong>folder</strong> for the torrent</li>
          <li>3. Set the announce url to <code>{window.location.origin}/announce</code></li>
        </ol>
      </div>
    </article>

    <form on:submit|preventDefault="{submit}">
 
      <div class="field">
        <label class="label">File</label>
        <div class="file is-boxed">
          <label class="file-label">
            <input class="file-input" type="file" name="torrent" on:change="{fileSelect}">
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label">
                Choose a .torrent file
              </span>
            </span>
            {#if file}
            <span class="file-name">
              {file}
            </span>
            {/if}
          </label>
        </div>     
      </div>

      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input name="title" class="input" type="text" bind:value="{title}" placeholder="Enter a title">
        </div>
      </div>
    
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea name="description" class="textarea"></textarea>
        </div>
      </div>

      <hr />
      
      {#if error}
      <article class="message is-danger">
        <div class="message-header">
          <p>Error</p>
        </div>
        <div class="message-body">
          <p class="content">You have following error: <strong>{error}</strong></p>
        </div>
      </article>
      {/if}

      <div class="field is-grouped">
        <div class="control">
          <input type="submit" class="button is-link" value="Submit" />
        </div>
      </div>
    
    </form>

  </div>
</div>




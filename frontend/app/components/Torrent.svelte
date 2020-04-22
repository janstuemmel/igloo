<script>
  import { onMount } from 'svelte'
  import axios from 'axios'
  import bytes from 'bytes'

  export let location
  export let id

  let info

  onMount(async () => {

    const res = await axios(`/api/torrents/${id}`)

    console.log(res.data)

    info = res.data

  })
</script>

<div class="section">
  <div class="container">
    {#if info}
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <p class="title is-3">{info.title}</p>
          </div>
        </div>
        <div class="level-right">
          <a href="/api/torrents/{id}/{info.name}.torrent" class="button is-dark">
              <i class="fas fa-download"></i>&nbsp;&nbsp;Download
          </a>          
        </div>
      </div>
      <p class="subtitle is-5">InfoHash: <small>{info.infoHash}</small></p>
      <hr />
      <pre><code>
        {#each info.files as file}
          <div>{file.path} <strong>({bytes(file.length)})</strong></div>
        {/each}
      </code></pre>
    {/if}
  </div>
</div>
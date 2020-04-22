<script>
  import axios from 'axios'
  import { onMount } from 'svelte'
  import bytes from 'bytes'
  import { link } from 'svelte-routing'

  export let location

  let torrents = []

  onMount(async () => {
    const res = await axios('/api/torrents')
    torrents = res.data
  })

</script>

<div class="section">
  <div class="container">

    <table class="table table is-fullwidth is-striped is-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th class="has-text-right"><abbr title="Filesize"><i class="fas fa-expand-alt"></i></abbr></th>
          <th class="has-text-right"><abbr title="Active Seeders"><i class="fas fa-seedling"></i></abbr></th>
          <th class="has-text-right"><abbr title="Download"><i class="fas fa-arrow-down"></i></abbr></th>
        </tr>
      </thead>

      <tbody>
        {#each torrents as torrent }
        <tr>
          <td>
            <strong><a href="/torrents/{torrent.id}" use:link>{torrent.title}</a></strong>
            <p><small>{torrent.name}</small></p>
          </td>
          <td class="has-text-right">{bytes(torrent.size)}</td>
          <td class="has-text-right">{torrent.swarm.complete}</td>
          <td class="has-text-right">
            <a href="/api/torrents/{torrent.id}/{torrent.name}.torrent">
              <i class="fas fa-save"></i>
            </a>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

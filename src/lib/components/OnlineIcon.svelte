<script lang="ts">
  export let online: boolean;
</script>

<span class="dot {online ? 'green-dot' : 'red-dot'}" />

<style>
  .dot {
    height: 0.8em;
    width: 0.8em;
    border-radius: 50%;
    display: inline-block;
    margin: 0.3em;
  }

  .green-dot {
    background-color: #079913;
  }

  .red-dot {
    background-color: #a01111;
  }
</style>

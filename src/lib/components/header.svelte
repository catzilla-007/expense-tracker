<script>
  /* make sure that the slots for left/center/right
     can be used outside the header component,
     need to use multiple <slot /> for this one
  */
</script>

<header>
  <span class="header-left">left</span>
  <span class="header-center">center</span>
  <span class="header-right">Right</span>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    height: 3rem;
    background-color: var(--color-bg-2);
  }

  .header-left {
    border: 1px solid yellow;
  }

  .header-center {
    flex-grow: 1;
    border: 1px solid red;
  }

  .header-right {
    border: 1px solid yellow;
  }
</style>

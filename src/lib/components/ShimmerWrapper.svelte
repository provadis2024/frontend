<script lang="ts">
	import { fade } from "svelte/transition";

    export let loading = false;
    export let placeholder = "loading";
</script>

{#if loading}
    <span class="glint" transition:fade={{duration: 250}}>{placeholder}</span>
{:else}
    <slot/>
{/if}

<style lang="scss">
    .glint {
        position: relative;
        color: transparent;
        user-select: none;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            animation-duration: 4s;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;
            animation-name: shimmer;
            animation-timing-function: linear;
            background-image: linear-gradient(45deg, var(--color-border) 8%, var(--color-border-slight) 18%, var(--color-border) 33%);
            background-size: 1200px 100%;

            border-radius: var(--radius);
        }
    }

    @keyframes shimmer {
        0% {
            background-position: -1200px 0;
        }
        100% {
            background-position: 1200px 0;
        }
    }
</style>
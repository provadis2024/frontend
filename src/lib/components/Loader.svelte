<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	export let loading = true;
	export let display: 'default' | 'overlay' = 'default';
</script>

{#if loading}
	<div class="loader" class:overlay={display == 'overlay'}>
		<LoaderCircle />
	</div>
{:else}
	<slot />
{/if}

<style lang="scss">
	.loader {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&.overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--color-background-transparent);
			z-index: 500;
			backdrop-filter: blur(5px);
		}

		> :global(svg) {
			width: 45px;
			height: 45px;
			animation: spin 1s linear infinite;
		}
	}

	@keyframes spin {
		0% {
			rotate: 0deg;
		}
		100% {
			rotate: 360deg;
		}
	}
</style>

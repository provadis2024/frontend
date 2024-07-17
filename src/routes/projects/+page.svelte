<script lang="ts">
	import ProjectTile from "$lib/components/ProjectTile.svelte";

    let dummy = Array.from({length: 12});
</script>

<div class="projects">
    <div class="box">
        <h1>Projekte</h1>
    </div>
    
    <div class="box long">
        <div class="controls">12 Projekte</div>
        
        <div class="list">
            {#each dummy as project}
            <ProjectTile/>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .projects {
        display: flex;
        flex-direction: column;
        height: 100%;
        @include gaps;

        .list {
            display: flex;
            flex-wrap: wrap;
            flex-grow: 1;
            align-items: flex-start;
            align-content: flex-start;
            @include gaps;
            
            > :global(*) {
                flex-grow: 1;
            }
        }

        .controls {
            @include box;
            padding: 8px 15px;
        }

        > * {
            flex-shrink: 0;
        }

        .box {
            @include box;
        }

        .long {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            @include gaps;
        }
    }
</style>
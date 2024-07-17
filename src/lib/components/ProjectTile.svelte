<script lang="ts">
	import { ChevronRight, ClipboardList, Timer } from "lucide-svelte";

</script>

<a href="/projects/1" class="project">
    <span class="name">My Project</span>
    <div class="facts">
        <ClipboardList /> <span>23</span>
    </div>
    <span class="cta">Projekt öffnen <ChevronRight/></span>
</a>

<style lang="scss">
    .project {
        @include box;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 15px;
        min-width: 200px;

        .name {
            font-size: 1.2em;
            font-weight: 700;
        }

        .facts {
            display: flex;
            align-items: center;
            opacity: .75;
            gap: 5px;

            > :global(svg) {
                stroke-width: 1px;

            }
        }

        .cta {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: var(--color-accent);
        }
    }
</style>
<script lang="ts">
	import type { Project } from "$lib/types";
	import { ChevronRight, ClipboardList, Timer } from "lucide-svelte";
	import ShimmerWrapper from "./ShimmerWrapper.svelte";

    export let project: Project;
</script>

<a href="/projects/{project.id}" class="project">
    <span class="name">{project.name}</span>
    <div class="facts">
        <ClipboardList /> <span><ShimmerWrapper>23</ShimmerWrapper></span>
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
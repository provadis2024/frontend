<script lang="ts">
	import { Pen, Plus, Text, Timer, User, X } from 'lucide-svelte';
    import type { PageData } from './$types';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import type { Project } from '$lib/types';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import { goto } from '$app/navigation';

    let showDescription = false;

    let editorActive = false;
    let editor: ProjectForm;

    let taskEditorActive = false;
    let taskEditor: TaskForm;

    let project: Project = {
        id: '1',
        name: 'Demo Project',
        description: 'Test',
        members: [],
        owner: '1'
    }
    
    export let data: PageData;
</script>

<div class="project">
    <div class="box header">
        <h1>Projekt: {project.name}</h1>

        <button on:click={() => showDescription = true} title="Beschreibung anzeigen">
            <Text />
        </button>
        <button on:click={() => {editor.loadProject(project); editorActive = true;}} title="Projekt bearbeiten">
            <Pen />
        </button>
    </div>

    <div class="overlay" class:active={editorActive}>
        <div class="container">
            <ProjectForm on:cancel={() => editorActive = false} bind:this={editor} />
        </div>
    </div>

    <div class="overlay" class:active={taskEditorActive}>
        <div class="container">
            <TaskForm on:cancel={() => taskEditorActive = false} bind:this={taskEditor} />
        </div>
    </div>

    <div class="description" class:active={showDescription}>
        <div class="inner">
            <h1>Beschreibung</h1>

            <button on:click={() => showDescription = false}><X /></button>

            <p>{project.description}</p>
        </div>
    </div>
    
    <div class="box tasks">
        <h2>Aufgaben</h2>

        <div class="scrollable-list">
            <button on:click={() => {
                taskEditor.loadTask({
                    project: project.id||""
                });
                taskEditorActive = true;
            }}>
                <Plus />
                <span class="name">Neue Aufgabe</span>
            </button>
            <button on:click={() => {
                taskEditor.loadTask({
                    project: project.id||""
                });
                taskEditorActive = true;
            }}>
                <Timer />
                <span class="name">Test 123</span>
                <span class="time">12h</span>
            </button>
            <button>
                <Timer />
                <span class="name">Test 123</span>
                <span class="time">12h</span>
            </button>
            <button>
                <Timer />
                <span class="name">Test 123</span>
                <span class="time">12h</span>
            </button>
        </div>
    </div>
    
    <div class="box team">
        <h2>Team</h2>

        <div class="scrollable-list">
            <button on:click={() => {
                goto(`/users#user-${1}`);
            }}>
                <User />
                <span class="name">Test 123</span>
                <span class="time">12h</span>
            </button>
        </div>
    </div>
    
    <div class="box analyze">
        <h2>Analysen</h2>
    </div>
</div>

<style lang="scss">
    .project {
        display: grid;
        flex-direction: column;
        height: 100%;
        @include gaps;
        grid-template-areas: 
            "header header"
            "tasks   team"
            "analyze team";
        grid-template-rows: min-content 1fr 1fr;
        grid-template-columns: repeat(2, 1fr);
        contain: layout;

        @container layout (width < 1000px) {
            grid-template-areas: "header" "tasks" "team" "analyze";
            grid-template-rows: repeat(4, min-content);
            grid-template-columns: 1fr;
        }
    
        > * {
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-background-transparent);
            opacity: 0;
            pointer-events: none;

            &.active {
                opacity: 1;
                pointer-events: auto;
            }

            .container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 380px;
            }
        }

        .header {
            flex-direction: row;
            align-items: center;
            @include gaps;  

            h1 {
                margin-right: auto;
                margin-bottom: 0;
            }

            button {
                @include button;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .description {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-background-transparent);
            opacity: 0;
            pointer-events: none;

            &.active {
                opacity: 1;
                pointer-events: auto;
            }

            > div {
                position: absolute;
                top: 5%;
                left: 50%;
                transform: translate(-50%, 0);

                background-color: var(--color-background);
                border-radius: var(--radius);
                padding: var(--padding-box);

                button {
                    position: absolute;
                    @include button;
                    top: 0;
                    right: 0;
                    padding: 10px;
                    background-color: transparent;
                    border: none;
                    
                }
            }
        }

        .scrollable-list {
            overflow: auto;
            display: flex;
            flex-direction: column;
            scrollbar-width: thin;
            padding: 0 10px;

            button {
                background-color: transparent;
                border: none;
                color: inherit;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font: inherit;
                cursor: pointer;
                padding: 10px;
                border-radius: var(--radius);
                @include gaps;

                .name {
                    margin-right: auto;
                }

                &:nth-child(2n) {
                    background-color: var(--color-background-alternate);
                }

                > :global(svg) {
                    stroke-width: 1px;
                    width: 35px;
                    height: 35px;
                }
            }
        }

        .team {
            grid-area: team;
        }

        .analyze {
            grid-area: analyze;
        }

        .tasks {
            grid-area: tasks;
        }

        .header {
            grid-area: header;
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
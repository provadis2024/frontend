<script lang="ts">
	import UserForm from "$lib/components/UserForm.svelte";
	import type { User } from "$lib/types";
	import { Plus, User as UserIcon } from "lucide-svelte";

    let editorActive = false;
    let editor: UserForm;

    let dummy = Array.from({length: 12}).map((x, idx) => {
        const user: User = {
            id: idx.toString(),
            username: 'max.muster'
        }

        return user
    });
</script>

<div class="projects">
    <div class="box">
        <h1>Benutzer</h1>
    </div>

    <div class="overlay" class:active={editorActive}>
        <div class="container">
            <UserForm on:cancel={() => editorActive = false} bind:this={editor} />
        </div>
    </div>
    
    <div class="box long">
        <div class="controls">{dummy.length} Benutzer</div>
        
        <div class="list">
            <button class="add-btn" on:click={() => {
                editor.loadUser({});
                editorActive = true;
            }}>
                <Plus/>
                <span>Neuer Benutzer</span>
            </button>

            {#each dummy as user}
                <button on:click={() => {
                    editor.loadUser(user);
                    editorActive = true;
                }} class="user" id="user-{user.id}">
                    <UserIcon />
                    <span>{user.username}</span>
                </button>
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

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-background-transparent);
            opacity: 0;
            pointer-events: none;
            z-index: 20;

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

        .list {
            display: flex;
            flex-wrap: wrap;
            flex-grow: 1;
            align-items: flex-start;
            align-content: flex-start;
            @include gaps;

            .add-btn {
                align-self: stretch;
                width: 200px;
                @include button;
                border-style: dashed;
                border-width: 2px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                
            }

            .user {
                align-self: stretch;
                width: 200px;
                @include button;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background-color: transparent;
                border-color: var(--color-border);
                border-width: 2px;

                &:target {
                    color: var(--color-accent);
                    border-color: var(--color-accent);
                }
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
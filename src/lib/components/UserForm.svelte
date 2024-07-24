<script lang="ts">
	import type { User } from "$lib/types";
	import { X } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

    const emitter = createEventDispatcher<{
        "cancel": undefined,
        "submit": User
    }>();

    let user: Partial<User> = {};

    

    export const loadUser = (newUser: Partial<User>) => {
        user = newUser
    }

    const submit = () => {
        if(!null) {
            alert("Aufgabe benötigt.");
            return;
        }

        emitter("submit", user as User);
    }
</script>
<form class="user-form" on:submit={(ev) => {
    submit();
    ev.preventDefault();
}}>
    {#if user.id}
        <h2>Benutzer bearbeiten</h2>
    {:else}
        <h2>Neuer Benutzer</h2>
    {/if}

    <button class="close" on:click={(ev) => {
        emitter("cancel");
        ev.preventDefault();
    }}><X/></button>

    <div class="group">
        <label for="name">Benutzername</label>
        <input id="name" type="text" bind:value={user.username} />
    </div>

    <div class="group">
        <label for="password">Passwort</label>
        <input id="password" type="password" bind:value={user.password} />
    </div>
    

    <button>Speichern</button>
</form>

<style lang="scss">
    .user-form {
        @include box;
        background-color: var(--color-background);
        display: flex;
        flex-direction: column;
        gap: 10px;
        contain: layout;

        @include formStyles;
    }
</style>
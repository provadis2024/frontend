<script lang="ts">
	import { ChevronRight, OctagonAlert, Play, Timer } from "lucide-svelte";


</script>

<div class="dashboard">
    <div class="greeting">
        <span>Guten Morgen, <em>Max</em>!</span>
    </div>

    <div class="timer">
        <div class="timer-main">
            <Timer/>

            <div class="time-stack">                
                <span class="timer-date">Mittwoch, der 17.07.</span>
                <span class="time">2:23h</span>
            </div>

            <button><Play/></button>
        </div>
    </div>

    <a class="notices" href="/bookings">
        <OctagonAlert />

        <span>2 Zeitbuchungen fehlen</span>
    </a>

    <div class="bookings">
        <h2>Meine Zeitbuchungen</h2>

        <a href="/bookings" class="view-all">Alle Zeitbuchungen anzeigen <ChevronRight/></a>
    </div>

    <div class="projects">
        <h2>Kürzliche Projekte</h2>

        <a href="/projects" class="view-all">Alle Projekte anzeigen <ChevronRight/></a>
    </div>
</div>

<style lang="scss">
    .dashboard {
        height: 100%;
        display: grid;
        grid-template-areas: 
            "greeting greeting"
            " timer   notices "
            "bookings projects";

        grid-template-rows: auto auto 1fr;
        grid-template-columns: 1fr 1fr;

        @include gaps;

        > * {
            @include box;
        }

        .bookings, .projects {
            display: flex;
            flex-direction: column;


            .view-all {
                display: block;
                align-self: flex-end;
                text-align: right;
                color: var(--color-accent);
                text-decoration: none;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-top: auto;
            }
        }

        .bookings {
            grid-area: bookings;
        }

        .projects {
            grid-area: projects;
        }

        .notices {
            --box-color: rgb(255, 55, 48);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 1.5em;
            font-weight: 700;
            gap: 20px;
            grid-area: notices;
                    
            > :global(svg) {
                width: 45px;
                height: 45px;
                stroke-width: 1px;
            }
        }

        .timer {
            grid-area: timer;
            --box-color: rgb(48, 145, 255);
            display: flex;
            flex-direction: column;
            gap: 5px;

            .timer-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;

                .time-stack {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .time {
                        font-size: 1.5em;
                        font-weight: 700;
                    }

                    .timer-date {
                        opacity: .75;
                    }
                }
                    
                > :global(svg) {
                    width: 45px;
                    height: 45px;
                    stroke-width: 1px;
                }
            }

            button {
                @include button;
                color: var(--box-color);
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-width: 1px;

                > :global(svg) {
                    width: 35px;
                    height: 35px;
                    stroke-width: 1px;
                }
            }
        }
        
        .greeting {
            grid-area: greeting;
            --box-color: var(--color-accent);
            > span {
                font-size: 2em;
                font-weight: 200;

                > em {
                    font-weight: 900;
                    font-style: normal;
                }
            }
        }
    }
    @container layout (width < 900px) {
        .dashboard {
            grid-template-areas: 
                "greeting"
                "timer"
                "notices"
                "bookings"
                "projects";

            grid-template-rows: min-content min-content min-content auto auto;
            grid-template-columns: 1fr;
        }
    }
</style>
<script lang="ts">
    
</script>

<div class="bookings">
    <div class="box">
        <h1>Zeitbuchungen</h1>
    </div>
    
    <div class="box long">
        
    </div>
</div>

<style lang="scss">
    .bookings {
        display: flex;
        flex-direction: column;
        height: 100%;
        @include gaps;

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
<script lang="ts">
    import '../style.css'
    import {onMount} from "svelte";
    import {invalidate} from "$app/navigation";

    export let data

    let {supabase, session} = data
    /** Si data change supabase & session se mettent à jour avec data.supabase & data.session **/
    $: ({supabase, session} = data)

    onMount(() => {
        const data = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        })

        return () => data.subscription.unsubscribe()
    })
</script>

<svelte:head>
    <title>User Management</title>
</svelte:head>

<div class="container" style="padding: 50px 0 100px 0">
    <slot/>
</div>
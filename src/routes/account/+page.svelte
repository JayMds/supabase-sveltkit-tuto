<script lang="ts">
    import { enhance } from "$app/forms";
    import type {SubmitFunction} from "@sveltejs/kit";
    import Avatar from "./Avatar.svelte";

    export let data
    export let form

    let {session, supabase, profile} = data
    $: ({session, supabase, profile} = data)

    let profileForm: HTMLFormElement

    let fullName: string = profile?.full_name ?? ''
    let username: string = profile?.username ?? ''
    let website: string = profile?.website ?? ''
    let avatarUrl: string = profile?.avatar_url ?? ''

    let loading = false
    const handleSubmit:SubmitFunction = () => {
        loading = true
        return async () => {
            loading = false
        }
    }

    const handleSignout: SubmitFunction = () => {
        loading = true
        return async ({update}) =>  {
            loading = false
            await update()
        }
    }
</script>

<div class="form-widget">
    <form
    class="form-widget"
    method="post"
    action="?/update"
    use:enhance={handleSubmit}
    bind:this={profileForm}
    >
        <Avatar
                {supabase}
                {session}
                bind:url={avatarUrl}
                size={8}
                on:upload={() => {
                    profileForm.requestSubmit();
                }}
        />
        <h2 style="text-align: center"> Profil </h2>
        <div>
            <label for="email">E-Mail</label>
            <input id="email" name="email" type="text" value={session.user.email} disabled/>
        </div>
        <div>
            <label for="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" value={form??fullName ?? fullName}/>
        </div>
        <div>
            <label for="fullName">Username</label>
            <input id="username" name="username" type="text" value={form??username ?? username}/>
        </div>
        <div>
            <label for="fullName">Website</label>
            <input id="website" name="website" type="text" value={form??website ?? website}/>
        </div>
        <div>
            <input
                type="submit"
                class="button block primary"
                value={loading? 'chargement...' : 'Mettre à jour'}
                disabled={loading}
            />
        </div>
    </form>
    <form method="post" action="?/signout" use:enhance={handleSignout}>
        <button class="button block" disabled={loading}>Déconnexion</button>
    </form>
</div>
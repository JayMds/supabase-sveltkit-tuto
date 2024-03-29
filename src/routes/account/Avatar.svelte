<script lang="ts">
    import type {Session, SupabaseClient} from "@supabase/supabase-js";
    import {createEventDispatcher} from "svelte";
    import {updated} from "$app/stores";

    export let size = 10
    export let url: string
    export let supabase: SupabaseClient
    export let session: Session

    let avatarUrl: string | null = null
    let uploading = false
    let files: FileList

    // let uniqId = new Sqids({minLength: 8})

    const dispatch = createEventDispatcher()

    $:if (url) {
        downloadImage(url)
    }

    const downloadImage = async (path: string) => {
        try {
            const {data, error} = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            avatarUrl = url
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image', error.message)
            }
        }
    }

    const uploadAvatar = async () => {
        try {
            uploading = true

            if (!files || files.length === 0) {
                throw new Error('You must select an image to upload')
            }

            const file = files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${session.user.id}.${fileExt}`

            await supabase.storage.from('avatars').remove([filePath])

            const {error} = await supabase.storage.from('avatars').upload(filePath, file)

            if (error) {
                throw error
            }

            url = filePath
            setTimeout(() => {
                dispatch('upload')
            }, 100)

        } catch (error: any) {

            if (error instanceof Error) {
                alert(error.message)
            }

        } finally {
            uploading = false
        }
    }

</script>

<div style="display: flex;flex-direction: column; align-items: center;">
    {#if avatarUrl}
        <img
                src={avatarUrl}
                alt={avatarUrl? 'avatar' : 'no avatar'}
                class='avatar image'
                style="height: {size}em; width: {size}em"
        />
    {:else }
        <div class="avatar no-image" style="height: {size}em; width: {size}em"></div>
    {/if}
    <input type="hidden" name="avatarUrl" value={url}>

    <div style="display: flex; justify-content: center; width: {size}em;">
        <label class="button primary" for="single">
            {uploading ? 'Chargement...' : 'Choisir un avatar'}
        </label>
        <input
                style="visibility: hidden; position: absolute"
                type="file"
                id="single"
                accept="image/"
                bind:files
                on:change={uploadAvatar}
                disabled={uploading}
        />
    </div>
</div>
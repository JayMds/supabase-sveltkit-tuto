import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals: { supabase, getSession }}) => {
    const session = getSession()

    if (!session) {
        throw redirect(303, '/')
    }

    const {data: profile} = await supabase
        .from('profiles')
        .select('username, full_name, website, avatar_url')
        .eq('id', session.user.id)
        .single()

    return {session, profile}
}

export const actions: Actions = {
    update: async({request, locals: {supabase, getSession}}) => {
        const formData = await request.request.formData()
    }
}
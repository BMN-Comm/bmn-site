import type { RequestHandler } from '@sveltejs/kit'
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
    const { filepath, content }: { filepath: string; content: string } = await request.json()

    try {
        let dest = path.resolve(process.cwd(), filepath);
        fs.writeFileSync(dest, content, 'utf-8');
        return new Response(undefined, { status: 200 })
        } catch (e: any) {
        return new Response(e.message, { status: 500, headers: { error: e.message } })
    }
}
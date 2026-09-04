// functions/api/adhkar.js
import { getDB, query, execute } from './db';

export async function onRequestGet(context) {
    const db = await getDB(context);
    const adhkar = await query(db, 'SELECT * FROM adhkar ORDER BY created_at');
    
    return new Response(JSON.stringify(adhkar), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestPost(context) {
    const db = await getDB(context);
    const { title, text, default_target } = await context.request.json();
    
    const id = crypto.randomUUID();
    await execute(db,
        'INSERT INTO adhkar (id, title, text, default_target) VALUES (?, ?, ?, ?)',
        [id, title, text, default_target || 100]
    );
    
    return new Response(JSON.stringify({ success: true, id }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
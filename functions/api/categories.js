// functions/api/categories.js
import { getDB, query, execute } from './db';

export async function onRequestGet(context) {
    const db = await getDB(context);
    const categories = await query(db, 'SELECT * FROM categories ORDER BY sort_order, created_at');
    
    return new Response(JSON.stringify(categories), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestPost(context) {
    const db = await getDB(context);
    const { title, icon, parent_id, image } = await context.request.json();
    
    const id = crypto.randomUUID();
    await execute(db, 
        'INSERT INTO categories (id, title, icon, parent_id, image) VALUES (?, ?, ?, ?, ?)',
        [id, title, icon || '✦', parent_id || null, image || '']
    );
    
    return new Response(JSON.stringify({ success: true, id }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestDelete(context) {
    const db = await getDB(context);
    const { id } = await context.request.json();
    
    await execute(db, 'DELETE FROM categories WHERE id = ?', [id]);
    
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
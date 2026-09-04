// functions/api/contents.js
import { getDB, query, queryOne, execute } from './db';

export async function onRequestGet(context) {
    const db = await getDB(context);
    const url = new URL(context.request.url);
    const categoryId = url.searchParams.get('category_id');
    const searchQuery = url.searchParams.get('search');
    
    let sql = 'SELECT * FROM contents';
    let params = [];
    
    if (categoryId) {
        sql += ' WHERE category_id = ?';
        params.push(categoryId);
    } else if (searchQuery) {
        sql += ' WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?';
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const contents = await query(db, sql, params);
    
    return new Response(JSON.stringify(contents), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestPost(context) {
    const db = await getDB(context);
    const { category_id, title, content, featured_image, tags } = await context.request.json();
    
    const id = crypto.randomUUID();
    await execute(db,
        'INSERT INTO contents (id, category_id, title, content, featured_image, tags) VALUES (?, ?, ?, ?, ?, ?)',
        [id, category_id, title, content, featured_image || '', tags || '']
    );
    
    return new Response(JSON.stringify({ success: true, id }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestDelete(context) {
    const db = await getDB(context);
    const { id } = await context.request.json();
    
    await execute(db, 'DELETE FROM contents WHERE id = ?', [id]);
    
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
// functions/api/db.js
export async function getDB(context) {
    return context.env.DB;
}

export async function query(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).all();
        return result.results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export async function queryOne(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).first();
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export async function execute(db, sql, params = []) {
    try {
        const result = await db.prepare(sql).bind(...params).run();
        return result;
    } catch (error) {
        console.error('Database execute error:', error);
        throw error;
    }
}
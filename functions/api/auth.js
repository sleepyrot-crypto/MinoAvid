// functions/api/auth.js
export async function onRequestPost(context) {
    try {
        const { token } = await context.request.json();
        const ADMIN_TOKEN = context.env.ADMIN_TOKEN;
        
        if (!ADMIN_TOKEN) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'ADMIN_TOKEN not configured' 
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }
        
        if (token === ADMIN_TOKEN) {
            // ثبت لاگ ورود موفق
            const db = context.env.DB;
            await db.prepare(
                'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)'
            ).bind('admin', 'login', 'Successful admin login').run();
            
            return new Response(JSON.stringify({ 
                success: true,
                session_token: crypto.randomUUID()
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }
        
        return new Response(JSON.stringify({ success: false }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

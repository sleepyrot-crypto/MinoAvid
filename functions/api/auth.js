export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const token = body.token;
        const ADMIN_TOKEN = context.env.ADMIN_TOKEN;
        
        // برای debug
        console.log('Token:', token);
        console.log('Admin Token:', ADMIN_TOKEN);
        
        if (!ADMIN_TOKEN) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Token not set' 
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }
        
        if (token === ADMIN_TOKEN) {
            return new Response(JSON.stringify({ 
                success: true 
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ 
            success: false,
            error: 'Invalid token'
        }), {
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

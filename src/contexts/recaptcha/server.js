export async function verifyRecaptcha(token,action) {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: token,
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data['error-codes'] || 'Recaptcha verification failed');
    }
 
    return data.success&&data.score >= 0.8&&data.action === action;  
}
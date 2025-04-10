import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

// Allowed origins for CORS
const allowedOrigins = [
  'https://newlytic.co',
  'http://localhost:3000',
];

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting map: email -> last submission timestamp
const rateLimitMap = new Map();
const RATE_LIMIT_DURATION = 3600000; // 1 hour in milliseconds

export async function POST(request) {
  // Check request size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024) { // Max 1KB
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 }
    );
  }
  try {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '';
    
    // Check if the origin is allowed
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { 
          status: 405,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }
    const { email } = await request.json();

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Check rate limiting
    const lastSubmission = rateLimitMap.get(email);
    const now = Date.now();
    if (lastSubmission && (now - lastSubmission) < RATE_LIMIT_DURATION) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Retry-After': Math.ceil((RATE_LIMIT_DURATION - (now - lastSubmission)) / 1000)
          }
        }
      );
    }

    // Verify CSRF token if you're using one
    const headersList = headers();
    const referer = headersList.get('referer');
    if (!referer || !allowedOrigins.some(origin => referer.startsWith(origin))) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Add contact to Resend
    await resend.contacts.create({
      email,
      firstName: '',
      lastName: '',
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID // Make sure to set this in your env
    });

    // Send a welcome email
    await resend.emails.send({
      from: 'Nic Coates <nic@team.newlytic.co>',
      reply_to: 'nic@newlytic.co',
      to: email,
      subject: 'Welcome to the Newlytic Waitlist! 🚀',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111111;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hey there! 👋</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thanks for joining the Newlytic waitlist! I'm Nic, the founder, and I'm excited to have you on board. We're building something special to make customer tracking smarter and more efficient.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Want to stay in the loop? Here's how you can follow our journey:</p>
          
          <ul style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            <li>Follow us on X (Twitter) at <a href="https://x.com/newlytic" style="color: #0066cc; text-decoration: none;">@newlytic</a> for regular updates</li>
            <li>Drop me an email at <a href="mailto:nic@newlytic.co" style="color: #0066cc; text-decoration: none;">nic@newlytic.co</a> with any questions</li>
          </ul>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">I'll be sharing more about our progress soon. Can't wait to show you what we're building!</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Best,<br>Nic</p>
        </div>
      `
    });

    // Update rate limit
    rateLimitMap.set(email, now);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins[0],
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
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
            <li>Follow me on X (Twitter) at <a href="https://twitter.com/niccoatesuk" style="color: #0066cc; text-decoration: none;">@niccoatesuk</a> for regular updates</li>
            <li>Drop me an email at <a href="mailto:nic@newlytic.co" style="color: #0066cc; text-decoration: none;">nic@newlytic.co</a> with any questions</li>
          </ul>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">I'll be sharing more about our progress soon. Can't wait to show you what we're building!</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Best,<br>Nic</p>
        </div>
      `
    });

    return NextResponse.json(
      { success: true, message: 'Successfully joined waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", 
      to: ["abdulsalamkhanwbd@gmail.com"],
      subject: `New Message from ${name} via Portfolio`,
      replyTo: email, 
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
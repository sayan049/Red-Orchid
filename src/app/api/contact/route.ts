import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, serviceType, budgetRange, timeline, message, honeypot } = body;

    // Spam honeypot protection: if hidden field is filled, silently discard
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    // Required field validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, email, and project message." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // In production with Resend or SendGrid:
    // await resend.emails.send({ ... })
    // For now, log and return successful response
    console.log("[INQUIRY TRANSMISSION RECEIVED]", {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      serviceType,
      budgetRange,
      timeline,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been transmitted to Red Orchid Films studio. We typically respond within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[INQUIRY ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal transmission error. Please reach out to hello@redorchidfilms.com directly." },
      { status: 500 }
    );
  }
}

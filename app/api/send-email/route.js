import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "📄 New Resume Submission",
      text: "User submitted a resume for review",
      attachments: [
        {
          filename: file.name || "resume.pdf",
          content: buffer,
        },
      ],
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return Response.json(
      { success: false, error: "Email failed" },
      { status: 500 }
    );
  }
}
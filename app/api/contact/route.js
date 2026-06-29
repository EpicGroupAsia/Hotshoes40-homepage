import nodemailer from "nodemailer";

const REQUIRED = ["name", "email", "enquiry"];

export async function POST(request) {
  try {
    const body = await request.json();

    for (const field of REQUIRED) {
      if (!body[field]?.trim()) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const lines = [
      ["Full Name", body.name],
      ["Company", body.company],
      ["Email", body.email],
      ["Phone", body.phone],
      ["Enquiry Type", body.enquiry],
      ["Purpose", body.purpose],
      ["Objective", body.objective],
      ["Audience", body.audience],
      ["Timeline", body.timeline],
      ["Criteria / Decision Making", body.criteria],
      ["Investment Allocated", body.investment],
      ["Required Response Time", body.response],
      ["Message", body.message],
    ]
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    await transporter.sendMail({
      from: `"Hotshoes Asia Website" <${process.env.SMTP_USER}>`,
      to: "hello@hotshoes.asia",
      subject: `New Enquiry — ${body.enquiry} from ${body.name}`,
      text: `New contact form submission\n\n${lines}`,
      html: `<pre style="font-family:sans-serif;font-size:14px;line-height:1.7">${lines.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>`,
      replyTo: body.email,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}

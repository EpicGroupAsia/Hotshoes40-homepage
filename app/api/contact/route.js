import { Resend } from "resend";

const REQUIRED = ["name", "email", "enquiry"];

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();

    for (const field of REQUIRED) {
      if (!body[field]?.trim()) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

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
      .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#888;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:#fff">${v}</td></tr>`)
      .join("");

    await resend.emails.send({
      from: `Hotshoes Asia Website <${process.env.FROM_EMAIL || "noreply@hotshoes.asia"}>`,
      to: "hello@hotshoes.asia",
      reply_to: body.email,
      subject: `New Enquiry — ${body.enquiry} from ${body.name}`,
      html: `
        <div style="background:#07060F;padding:40px;font-family:sans-serif;max-width:600px">
          <p style="margin:0 0 24px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#1FD0F0">Hotshoes Asia — New Enquiry</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px">
            ${lines}
          </table>
          <p style="margin:32px 0 0;font-size:12px;color:#555">Sent from uat.hotshoes.com.my contact form</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}

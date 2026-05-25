// src/lib/email.ts
// Transactional email via Resend (https://resend.com)

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'audit@spendlens.credex.rocks';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.credex.rocks';

export interface SendAuditEmailParams {
  email: string;
  companyName?: string;
  role?: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  shareToken: string;
  toolCount: number;
  isHighValue: boolean;
}

export async function sendAuditConfirmationEmail(params: SendAuditEmailParams): Promise<boolean> {
  const {
    email,
    companyName,
    totalMonthlySavings,
    totalAnnualSavings,
    shareToken,
    toolCount,
    isHighValue,
  } = params;

  const shareUrl = `${APP_URL}/audit/${shareToken}`;
  const greeting = companyName ? `Hi ${companyName} team` : 'Hi there';

  const savingsLine = totalMonthlySavings > 0
    ? `We found <strong>$${totalMonthlySavings.toLocaleString()}/month ($${totalAnnualSavings.toLocaleString()}/year)</strong> in potential savings across your ${toolCount} AI tool${toolCount > 1 ? 's' : ''}.`
    : `Your AI stack of ${toolCount} tool${toolCount > 1 ? 's' : ''} looks well-optimised — you're spending efficiently.`;

  const credexSection = isHighValue
    ? `
<p>Given the size of your savings opportunity, <strong>Credex can help you capture more</strong>. We source discounted AI credits (Cursor, Claude, ChatGPT Enterprise) from companies that overforecast — typically 20–40% off list price.</p>
<p><a href="https://credex.rocks" style="color:#8b5cf6">Book a free 20-minute consultation →</a></p>
`
    : `
<p>If your AI stack grows or you add new tools, run the audit again — we update our pricing data weekly.</p>
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your SpendLens AI Audit</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d0e14; color: #e8eaf2; margin: 0; padding: 40px 20px;">
  <div style="max-width: 580px; margin: 0 auto; background: #13141b; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px;">
    <div style="margin-bottom: 32px;">
      <span style="font-size: 24px;">🔍</span>
      <span style="font-weight: 800; font-size: 20px; margin-left: 8px; background: linear-gradient(135deg, #8b5cf6, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SpendLens</span>
      <span style="font-size: 11px; color: #6b7280; border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 3px 10px; margin-left: 8px;">by Credex</span>
    </div>

    <h1 style="font-size: 24px; font-weight: 700; color: #e8eaf2; margin: 0 0 12px;">Your AI Spend Audit is Ready</h1>
    <p style="color: #9ca3af; margin: 0 0 24px; line-height: 1.6;">${greeting},</p>
    <p style="color: #d1d5db; line-height: 1.6; margin: 0 0 24px;">${savingsLine}</p>

    <div style="background: #1a1b24; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Your shareable audit link</p>
      <a href="${shareUrl}" style="color: #8b5cf6; font-size: 14px; word-break: break-all;">${shareUrl}</a>
    </div>

    ${credexSection}

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 32px 0;">
    <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
      Built by <a href="https://credex.rocks" style="color: #8b5cf6;">Credex</a> — discounted AI credits for high-growth startups.<br>
      You're receiving this because you requested an AI spend audit. No further emails unless you reach out.
    </p>
  </div>
</body>
</html>
`;

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[email] RESEND_API_KEY not set — saving email locally to .local-emails/ directory instead');
      try {
        const fs = await import('fs');
        const path = await import('path');
        const dir = path.join(process.cwd(), '.local-emails');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        const fileName = `${email.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.html`;
        fs.writeFileSync(path.join(dir, fileName), html, 'utf-8');
        console.log(`[email] Saved test email to: ${path.join(dir, fileName)}`);
        return true; // Pretend it sent successfully so the frontend sees success
      } catch (err) {
        console.error('[email] Failed to save local email mock:', err);
        return false;
      }
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: totalMonthlySavings > 0
        ? `Your SpendLens audit: $${totalMonthlySavings.toLocaleString()}/mo in potential savings`
        : 'Your SpendLens AI Spend Audit',
      html,
    });

    if (error) {
      console.error('[email] Resend error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] Send failed:', err);
    return false;
  }
}

/**
 * Macklemore Fashion - Afro-Luxury Order Receipt & Fulfillment Email Service
 * Powered by Resend REST API (Zero external npm dependency overhead)
 */

export interface OrderEmailItem {
  productId: string;
  productTitle: string;
  brandName: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  destinationCity: string;
  destinationCountry: string;
  currency: string;
  subtotalAmount: number;
  shippingAmount: number;
  dutiesAmount: number;
  totalAmount: number;
  assignedHub: string;
  courierPartner: string;
  waybillNumber: string;
  paymentProvider: string;
  paymentReference: string;
  estimatedTransitDays?: string;
  items: OrderEmailItem[];
}

/**
 * Format currency amounts for emails
 */
function formatEmailCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    CAD: "CAD $",
    USD: "$",
    GBP: "£",
    EUR: "€",
    NGN: "₦",
    GHS: "GH₵",
    KES: "KSh ",
  };
  const sym = symbols[currency] || `${currency} `;
  return `${sym}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate human-friendly hub and waiting time descriptions
 */
function getLogisticsTimeline(payload: OrderEmailPayload) {
  const isNigeria =
    payload.destinationCountry.toLowerCase().includes("nigeria") ||
    payload.assignedHub === "HUB_A_LAGOS";

  const hubLabel = isNigeria
    ? "Nigeria Operations Hub (Hub A · Lagos)"
    : "Toronto Corporate HQ (Hub B · Toronto, Canada)";

  const transitWindow =
    payload.estimatedTransitDays ||
    (isNigeria ? "1-2 Business Days" : "2-4 Business Days");

  return {
    hubLabel,
    transitWindow,
    inspectionTime: "12-24 Hours (Hand Inspection &amp; Preservation Tissue)",
    courierTime: "Within 24 Hours",
    estimatedArrival: transitWindow,
  };
}

/**
 * Build rich Afro-Luxury HTML email receipt template
 */
export function buildOrderReceiptHtml(payload: OrderEmailPayload): string {
  const timeline = getLogisticsTimeline(payload);
  const formattedSubtotal = formatEmailCurrency(payload.subtotalAmount, payload.currency);
  const formattedShipping =
    payload.shippingAmount === 0
      ? "Complimentary"
      : formatEmailCurrency(payload.shippingAmount, payload.currency);
  const formattedDuties =
    payload.dutiesAmount > 0
      ? formatEmailCurrency(payload.dutiesAmount, payload.currency)
      : null;
  const formattedTotal = formatEmailCurrency(payload.totalAmount, payload.currency);

  const itemsHtml = payload.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #EADFD0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-size: 11px; text-transform: uppercase; color: #7A491D; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 4px;">
            ${item.brandName || "Macklemore Fashion"}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #1F1A17; margin-bottom: 4px;">
            ${item.productTitle}
          </div>
          <div style="font-size: 12px; color: #6E6A63;">
            Size: <strong style="color: #1F1A17;">${item.size}</strong> &nbsp;·&nbsp; Qty: <strong style="color: #1F1A17;">${item.quantity}</strong>
          </div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #EADFD0; text-align: right; vertical-align: middle; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 600; color: #1F1A17;">
          ${formatEmailCurrency(item.unitPrice * item.quantity, payload.currency)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${payload.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1A17; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF5EE; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #FFFDF9; border: 1px solid #EADFD0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          
          <!-- Top Accent Ribbon -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #E31E24 0%, #D4860B 25%, #7A491D 50%, #1A7A6E 75%, #E31E24 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid #EADFD0;">
              <h1 style="margin: 0; font-family: 'Times New Roman', Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; color: #1F1A17;">
                Macklemore Fashion
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #7A491D; font-weight: 500;">
                Bespoke African Luxury · Toronto &amp; Lagos
              </p>
            </td>
          </tr>

          <!-- Confirmation Hero -->
          <tr>
            <td style="padding: 32px 36px 24px;">
              <div style="display: inline-block; background-color: #FAF5EE; border: 1px solid #EADFD0; border-radius: 2px; padding: 4px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: #2E6B35; margin-bottom: 12px;">
                ✓ Order Confirmed &amp; Settlement Verified
              </div>
              <h2 style="margin: 0 0 12px; font-family: 'Times New Roman', Georgia, serif; font-size: 24px; font-weight: bold; color: #1F1A17; text-transform: uppercase;">
                Thank you for your order, ${payload.customerName.split(" ")[0] || "Valued Client"}
              </h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5C5147;">
                Your curated pieces have been confirmed and allocated to our master tailoring and preservation desk. Below is your official receipt, delivery timeline, and courier waybill tracking reference.
              </p>
            </td>
          </tr>

          <!-- Key Order Metadata Box -->
          <tr>
            <td style="padding: 0 36px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF5EE; border: 1px solid #EADFD0; border-radius: 4px; padding: 18px 20px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 12px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #7A491D; font-weight: 600;">Order Dossier</div>
                    <div style="font-size: 15px; font-weight: bold; color: #1F1A17; margin-top: 2px;">${payload.orderNumber}</div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 4px;">Settled via <strong>${payload.paymentProvider}</strong></div>
                  </td>
                  <td width="50%" style="vertical-align: top; text-align: right;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #7A491D; font-weight: 600;">Courier Tracking Waybill</div>
                    <div style="font-size: 14px; font-family: monospace; font-weight: bold; color: #1F1A17; margin-top: 2px;">${payload.waybillNumber}</div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 4px;">Partner: <strong>${payload.courierPartner}</strong></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fulfillment Waiting Times & Timeline Section (CRITICAL) -->
          <tr>
            <td style="padding: 0 36px 28px;">
              <div style="border: 1px solid #EADFD0; border-radius: 4px; overflow: hidden; background-color: #FFFFFF;">
                <div style="background-color: #FAF5EE; padding: 12px 18px; border-bottom: 1px solid #EADFD0; font-family: 'Times New Roman', Georgia, serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; color: #1F1A17;">
                  Fulfillment Waiting Times &amp; Delivery Schedule
                </div>
                <div style="padding: 18px;">
                  
                  <!-- Step 1 -->
                  <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; font-weight: bold; color: #7A491D; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px;">
                      Stage 1 · Atelier Quality Inspection &amp; Packaging
                    </div>
                    <div style="font-size: 13px; color: #1F1A17; font-weight: 600;">
                      Waiting Time: ${timeline.inspectionTime}
                    </div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 2px; line-height: 1.4;">
                      Each garment undergoes hand-inspection, steam pressing, tissue wrap preservation, and provenance certificate insertion at <strong>${timeline.hubLabel}</strong>.
                    </div>
                  </div>

                  <!-- Step 2 -->
                  <div style="margin-bottom: 16px; border-top: 1px dashed #EADFD0; padding-top: 14px;">
                    <div style="font-size: 12px; font-weight: bold; color: #7A491D; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px;">
                      Stage 2 · Courier Waybill Activation &amp; Dispatch
                    </div>
                    <div style="font-size: 13px; color: #1F1A17; font-weight: 600;">
                      Waiting Time: ${timeline.courierTime}
                    </div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 2px; line-height: 1.4;">
                      Transferred to <strong>${payload.courierPartner}</strong> under secure waybill <code>${payload.waybillNumber}</code>.
                    </div>
                  </div>

                  <!-- Step 3 -->
                  <div style="border-top: 1px dashed #EADFD0; padding-top: 14px;">
                    <div style="font-size: 12px; font-weight: bold; color: #2E6B35; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px;">
                      Stage 3 · Doorstep Delivery to Recipient
                    </div>
                    <div style="font-size: 14px; color: #1F1A17; font-weight: bold;">
                      Estimated Transit: ${timeline.estimatedArrival}
                    </div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 2px; line-height: 1.4;">
                      Direct delivery to ${payload.destinationCity}, ${payload.destinationCountry}. Courier will contact ${payload.customerPhone || "recipient"} prior to arrival.
                    </div>
                  </div>

                </div>
              </div>
            </td>
          </tr>

          <!-- Curated Garments Table -->
          <tr>
            <td style="padding: 0 36px 28px;">
              <div style="font-family: 'Times New Roman', Georgia, serif; font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; color: #1F1A17; margin-bottom: 12px;">
                Curated Garments
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #EADFD0; border-radius: 4px; overflow: hidden; background-color: #FFFFFF;">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown & Totals -->
          <tr>
            <td style="padding: 0 36px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF5EE; border: 1px solid #EADFD0; border-radius: 4px; padding: 18px 20px;">
                <tr>
                  <td style="font-size: 13px; color: #6E6A63; padding-bottom: 8px;">Garments Subtotal:</td>
                  <td style="font-size: 13px; color: #1F1A17; font-weight: 600; text-align: right; padding-bottom: 8px;">${formattedSubtotal}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6E6A63; padding-bottom: 8px;">Fulfillment &amp; Courier Shipping:</td>
                  <td style="font-size: 13px; color: #1F1A17; font-weight: 600; text-align: right; padding-bottom: 8px;">${formattedShipping}</td>
                </tr>
                ${
                  formattedDuties
                    ? `
                <tr>
                  <td style="font-size: 13px; color: #6E6A63; padding-bottom: 8px;">Estimated Regional Customs &amp; Duties:</td>
                  <td style="font-size: 13px; color: #1F1A17; font-weight: 600; text-align: right; padding-bottom: 8px;">${formattedDuties}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="font-size: 15px; font-weight: bold; color: #1F1A17; padding-top: 10px; border-top: 1px solid #EADFD0; text-transform: uppercase;">
                    Total Settled (${payload.currency}):
                  </td>
                  <td style="font-size: 17px; font-weight: bold; color: #7A491D; text-align: right; padding-top: 10px; border-top: 1px solid #EADFD0;">
                    ${formattedTotal}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address & Recipient Card -->
          <tr>
            <td style="padding: 0 36px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #EADFD0; border-radius: 4px; padding: 16px 20px; background-color: #FFFFFF;">
                <tr>
                  <td>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: #7A491D; margin-bottom: 4px;">
                      Delivery Address
                    </div>
                    <div style="font-size: 13px; font-weight: bold; color: #1F1A17;">
                      ${payload.customerName}
                    </div>
                    <div style="font-size: 13px; color: #5C5147; margin-top: 2px;">
                      ${payload.shippingAddress}
                    </div>
                    <div style="font-size: 12px; color: #6E6A63; margin-top: 4px;">
                      Contact: ${payload.customerPhone || "N/A"} &nbsp;·&nbsp; ${payload.customerEmail}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer & Support Notice -->
          <tr>
            <td style="padding: 28px 36px 36px; background-color: #FAF5EE; border-top: 1px solid #EADFD0; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #6E6A63; line-height: 1.5;">
                Need custom adjustments or assistance with your delivery? Contact our client concierge desk directly:
              </p>
              <div style="font-size: 13px; font-weight: 600; color: #7A491D; margin-bottom: 16px;">
                <a href="mailto:orders@macklemorefashions.com" style="color: #7A491D; text-decoration: none;">orders@macklemorefashions.com</a>
                &nbsp;·&nbsp;
                <span>Lagos &amp; Toronto</span>
              </div>
              <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #8C887B;">
                © 2026 Macklemore Fashion · All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatch Order Confirmation Email via Resend
 */
export async function sendOrderConfirmationEmail(
  payload: OrderEmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string; recipient?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY is not configured in environment.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const html = buildOrderReceiptHtml(payload);
  const preferredFrom =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Macklemore Fashion <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: preferredFrom,
        to: [payload.customerEmail],
        subject: `Order Confirmed: ${payload.orderNumber} · Macklemore Fashion Receipt & Delivery Schedule`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data?.message || "";

      // 1. Handle Resend unverified test recipient restriction:
      // In development/test mode without a verified custom domain, Resend only delivers
      // to the authenticated account owner's email address (e.g. kennylatimore4@gmail.com).
      const isOwnerRestriction =
        errorMessage.includes("You can only send testing emails to your own email address") ||
        errorMessage.includes("testing emails to your own email address");

      if (isOwnerRestriction) {
        const ownerMatch = errorMessage.match(/\(([^)]+@[^)]+)\)/);
        const authorizedRecipient =
          process.env.RESEND_TEST_RECIPIENT?.trim() ||
          ownerMatch?.[1] ||
          "kennylatimore4@gmail.com";

        console.warn(
          `[Resend] Recipient restricted in sandbox mode. Rerouting receipt to verified owner: ${authorizedRecipient}`
        );

        const reroutedHtml = `
          <div style="background-color: #FAF5EE; border-bottom: 2px solid #C4975A; padding: 14px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #5C5147; line-height: 1.5; text-align: center;">
            <strong style="color: #7A491D;">Test Environment Notice:</strong> Receipt dispatched to verified account owner (<strong>${authorizedRecipient}</strong>) for client <strong>${payload.customerName}</strong> (&lt;${payload.customerEmail}&gt;).
          </div>
        ` + html;

        const ownerRetryRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Macklemore Fashion <onboarding@resend.dev>",
            to: [authorizedRecipient],
            subject: `Order Confirmed: ${payload.orderNumber} · Macklemore Fashion Receipt (${payload.customerName})`,
            html: reroutedHtml,
          }),
        });

        const ownerRetryData = await ownerRetryRes.json();
        if (ownerRetryRes.ok && ownerRetryData?.id) {
          return {
            success: true,
            messageId: ownerRetryData.id,
            recipient: authorizedRecipient,
          };
        }
      }

      // 2. Handle Resend unverified sender domain:
      // If error is due to unverified custom from address, retry using onboarding@resend.dev
      if (
        data?.name === "validation_error" &&
        preferredFrom !== "Macklemore Fashion <onboarding@resend.dev>"
      ) {
        console.warn(
          "[Resend] Preferred from address rejected. Retrying with onboarding@resend.dev fallback..."
        );
        const retryRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Macklemore Fashion <onboarding@resend.dev>",
            to: [payload.customerEmail],
            subject: `Order Confirmed: ${payload.orderNumber} · Macklemore Fashion Receipt & Delivery Schedule`,
            html,
          }),
        });
        const retryData = await retryRes.json();
        if (retryRes.ok && retryData?.id) {
          return {
            success: true,
            messageId: retryData.id,
            recipient: payload.customerEmail,
          };
        }

        // If from-retry also failed due to recipient restriction, re-check recipient
        if (
          retryData?.message?.includes("testing emails to your own email address")
        ) {
          const ownerMatch = retryData.message.match(/\(([^)]+@[^)]+)\)/);
          const authorizedRecipient =
            process.env.RESEND_TEST_RECIPIENT?.trim() ||
            ownerMatch?.[1] ||
            "kennylatimore4@gmail.com";

          const ownerRetryRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Macklemore Fashion <onboarding@resend.dev>",
              to: [authorizedRecipient],
              subject: `Order Confirmed: ${payload.orderNumber} · Macklemore Fashion Receipt (${payload.customerName})`,
              html,
            }),
          });
          const ownerRetryData = await ownerRetryRes.json();
          if (ownerRetryRes.ok && ownerRetryData?.id) {
            return {
              success: true,
              messageId: ownerRetryData.id,
              recipient: authorizedRecipient,
            };
          }
        }
      }

      console.warn("[Resend] Email dispatch warning:", data);
      return {
        success: false,
        error: data?.message || "Failed to dispatch email",
      };
    }

    return {
      success: true,
      messageId: data?.id,
      recipient: payload.customerEmail,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.warn("[Resend] Network or API error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

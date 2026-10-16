import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvitePdfData {
  id: string;
  guestName: string;
  guestPhone: string;
  guestCount: number;
  status: string;
  inviteCode: string;
  createdAt: string;
}

export interface PdfOptions {
  celebrant?: string;
  date?: string;
  locale?: 'sw' | 'en';
  hostName?: string;
  hostPhone?: string;
  hostWhatsapp?: string;
  mode?: 'cards' | 'table';
}

const COLORS = {
  brand: [233, 30, 99] as [number, number, number],
  gold: [212, 160, 23] as [number, number, number],
  goldLight: [245, 220, 150] as [number, number, number],
  dark: [26, 26, 26] as [number, number, number],
  darker: [13, 13, 13] as [number, number, number],
  text: [34, 34, 34] as [number, number, number],
  muted: [120, 120, 120] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  cream: [252, 248, 240] as [number, number, number],
};

const T = {
  sw: {
    title: 'MWALIKO WA SHERERE YA UBATIZO',
    subtitle: 'Sherehe ya Ubatizo wa',
    guest: 'Mgeni',
    code: 'NAMBA YA MWALIKO',
    date: 'Tarehe',
    from: 'Familia ya Edsoni',
    signature: 'Kwa Upendo wa Kina',
    help: 'Msaada',
    tableTitle: 'Orodha ya Waalikwa',
    tableSubtitle: 'Sherehe ya Ubatizo wa',
    columns: {
      num: '#',
      name: 'Jina',
      phone: 'Simu',
      guests: 'Wageni',
      code: 'Namba ya Mwaliko',
      status: 'Hali',
    },
    status: {
      pending: 'Wanasubiri',
      confirmed: 'Wamekubali',
      declined: 'Wamekataa',
    },
    page: 'Ukurasa',
  },
  en: {
    title: 'BAPTISM CELEBRATION INVITATION',
    subtitle: 'Baptism Celebration of',
    guest: 'Guest',
    code: 'INVITATION CODE',
    date: 'Date',
    from: 'The Edsoni Family',
    signature: 'With Deep Love',
    help: 'Help',
    tableTitle: 'Guest List',
    tableSubtitle: 'Baptism Celebration of',
    columns: {
      num: '#',
      name: 'Name',
      phone: 'Phone',
      guests: 'Guests',
      code: 'Invite Code',
      status: 'Status',
    },
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      declined: 'Declined',
    },
    page: 'Page',
  },
};

export function generateInvitationCardsPdf(
  invites: InvitePdfData[],
  options: PdfOptions = {},
) {
  const {
    celebrant = 'Erick Edsoni',
    date = 'Jumamosi, 08 Novemba 2026',
    locale = 'sw',
    hostName = 'Familia ya Edsoni',
    hostPhone = '0710 209 220',
    hostWhatsapp = '255710209220',
  } = options;

  const t = T[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  invites.forEach((invite, index) => {
    if (index > 0) doc.addPage();

    // ─── Background ───────────────────────────────
    doc.setFillColor(...COLORS.cream);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Gold outer border
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner thin border
    doc.setDrawColor(...COLORS.goldLight);
    doc.setLineWidth(0.3);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // Top gold shimmer bar
    doc.setFillColor(...COLORS.gold);
    doc.rect(10, 10, pageWidth - 20, 1.5, 'F');

    // Bottom gold shimmer bar
    doc.rect(10, pageHeight - 11.5, pageWidth - 20, 1.5, 'F');

    // ─── Header ornament ───────────────────────────
    const cx = pageWidth / 2;
    let y = 30;

    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.4);
    doc.line(cx - 30, y, cx - 8, y);
    doc.line(cx + 8, y, cx + 30, y);
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gold);
    doc.text('✦   ✦   ✦', cx, y + 1.2, { align: 'center' });

    // ─── Title ─────────────────────────────────────
    y += 12;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.gold);
    doc.text(t.title, cx, y, { align: 'center', charSpace: 1.5 });

    // ─── Invitation line ───────────────────────────
    y += 15;
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(...COLORS.muted);
    doc.text(t.subtitle, cx, y, { align: 'center' });

    // ─── Celebrant name (large script style) ───────
    y += 20;
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(46);
    doc.setTextColor(...COLORS.brand);
    doc.text(celebrant, cx, y, { align: 'center' });

    // ─── Ornamental divider ────────────────────────
    y += 12;
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.4);
    doc.line(cx - 45, y, cx - 12, y);
    doc.line(cx + 12, y, cx + 45, y);
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.gold);
    doc.text('❦', cx, y + 1.8, { align: 'center' });

    // ─── Date block ────────────────────────────────
    y += 15;
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(t.date.toUpperCase(), cx, y, { align: 'center', charSpace: 2.5 });

    y += 8;
    doc.setFont('times', 'italic');
    doc.setFontSize(15);
    doc.setTextColor(...COLORS.text);
    doc.text(date, cx, y, { align: 'center' });

    // ─── Guest + Code dashed box ───────────────────
    y += 12;
    const boxW = pageWidth - 80;
    const boxX = (pageWidth - boxW) / 2;
    const boxH = 62;
    const boxY = y;

    // Dashed border
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(0.5);
    (doc as any).setLineDashPattern([2, 1.5], 0);
    doc.rect(boxX, boxY, boxW, boxH);
    (doc as any).setLineDashPattern([], 0);

    // Cream fill
    doc.setFillColor(...COLORS.cream);
    doc.rect(boxX + 0.3, boxY + 0.3, boxW - 0.6, boxH - 0.6, 'F');

    // Guest label
    let by = boxY + 8;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(t.guest.toUpperCase(), cx, by, { align: 'center', charSpace: 3 });

    by += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.text);
    doc.text(invite.guestName, cx, by, { align: 'center' });

    // Divider inside box
    by += 6;
    doc.setDrawColor(...COLORS.goldLight);
    doc.setLineWidth(0.3);
    doc.line(cx - 12, by, cx + 12, by);
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gold);
    doc.text('✦', cx, by + 1.5, { align: 'center' });

    // Code label
    by += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gold);
    doc.text(t.code, cx, by, { align: 'center', charSpace: 3 });

    // Invite code (large mono)
    by += 10;
    doc.setFont('courier', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...COLORS.brand);
    doc.text(invite.inviteCode, cx, by, { align: 'center', charSpace: 2 });

    // ─── Footer signature ──────────────────────────
    y = boxY + boxH + 20;
    doc.setDrawColor(...COLORS.goldLight);
    doc.setLineWidth(0.3);
    doc.line(cx - 15, y, cx + 15, y);
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gold);
    doc.text('✦ ✦ ✦', cx, y + 1.5, { align: 'center' });

    // Signature label
    y += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(t.signature.toUpperCase(), cx, y, { align: 'center', charSpace: 3 });

    // Host name (script-like)
    y += 12;
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(28);
    doc.setTextColor(...COLORS.gold);
    doc.text(hostName, cx, y, { align: 'center' });

    // ─── Contact footer ────────────────────────────
    const footY = pageHeight - 22;
    doc.setDrawColor(...COLORS.goldLight);
    doc.setLineWidth(0.3);
    doc.line(cx - 30, footY - 6, cx + 30, footY - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `${t.help}: ${hostPhone}  ·  WhatsApp: +${hostWhatsapp}`,
      cx,
      footY,
      { align: 'center' },
    );

    // Page number
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `${t.page} ${index + 1} / ${invites.length}`,
      pageWidth - 18,
      pageHeight - 14,
      { align: 'right' },
    );
  });

  const filename =
    locale === 'sw'
      ? `mwaliko-waalikwa-${Date.now()}.pdf`
      : `invitations-${Date.now()}.pdf`;

  doc.save(filename);
}

export function generateInvitesTablePdf(
  invites: InvitePdfData[],
  options: PdfOptions = {},
) {
  const { celebrant = 'Erick Edsoni', date = '08 Novemba 2026', locale = 'sw' } = options;
  const t = T[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...COLORS.brand);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.text(t.tableTitle, 14, 15);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.goldLight);
  doc.text(`${t.tableSubtitle} ${celebrant}`, 14, 23);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text(date, pageWidth - 14, 23, { align: 'right' });

  // Table
  const rows = invites.map((inv, i) => [
    String(i + 1),
    inv.guestName,
    inv.guestPhone,
    String(inv.guestCount),
    inv.inviteCode,
    t.status[inv.status as keyof typeof t.status] || inv.status,
  ]);

  autoTable(doc, {
    startY: 38,
    head: [[
      t.columns.num,
      t.columns.name,
      t.columns.phone,
      t.columns.guests,
      t.columns.code,
      t.columns.status,
    ]],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2.5,
      textColor: COLORS.text,
      lineColor: COLORS.goldLight,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: COLORS.gold,
      textColor: COLORS.white,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9.5,
    },
    alternateRowStyles: {
      fillColor: COLORS.cream,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 32 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 40, font: 'courier', fontStyle: 'bold' },
      5: { cellWidth: 30, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        data.cell.styles.textColor = COLORS.brand;
      }
      if (data.column.index === 5 && data.section === 'body') {
        const val = String(data.cell.raw);
        if (val === t.status.confirmed) {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === t.status.declined) {
          data.cell.styles.textColor = [220, 38, 38];
        } else {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
  });

  const filename =
    locale === 'sw'
      ? `orodha-ya-waalikwa-${Date.now()}.pdf`
      : `guest-list-${Date.now()}.pdf`;

  doc.save(filename);
}


/**
 * Generate a single-guest invitation PDF (1 page).
 * Used for the per-row print button in admin.
 */
export function generateSingleCardPdf(
  invite: InvitePdfData,
  options: PdfOptions = {},
) {
  return generateInvitationCardsPdf([invite], options);
}

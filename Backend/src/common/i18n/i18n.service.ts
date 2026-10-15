import { Injectable } from '@nestjs/common';

type Lang = 'sw' | 'en';
type Entry = { sw: string; en: string };

const T: Record<string, Entry> = {
  'auth.invalidPhone': { sw: 'Namba ya simu si sahihi. Tumia mfano: 0710209220', en: 'Invalid phone number. Example: 0710209220' },
  'auth.otpSent': { sw: 'Namba ya siri imetumwa kwenye simu yako.', en: 'OTP sent to your phone.' },
  'auth.otpInvalid': { sw: 'Namba ya siri si sahihi au imeisha muda.', en: 'Invalid or expired OTP.' },
  'auth.loginSuccess': { sw: 'Umeingia kwa mafanikio.', en: 'Login successful.' },

  'user.notFound': { sw: 'Mtumiaji hajapatikana.', en: 'User not found.' },

  'tenant.notFound': { sw: 'Mfumo haujapatikana.', en: 'Tenant not found.' },
  'tenant.slugExists': { sw: 'Jina hili la mfumo linatumika.', en: 'Tenant slug taken.' },

  'category.notFound': { sw: 'Aina haipatikani.', en: 'Category not found.' },

  'product.notFound': { sw: 'Bidhaa haipatikani.', en: 'Product not found.' },
  'product.insufficientStock': { sw: 'Bidhaa hazitoshi. Zilizobaki: {{count}}', en: 'Insufficient stock. Remaining: {{count}}' },

  'order.notFound': { sw: 'Oda haipatikani.', en: 'Order not found.' },
  'order.emptyCart': { sw: 'Kikapu chako ni kitupu.', en: 'Your cart is empty.' },
  'order.alreadyPaid': { sw: 'Oda hii imelipwa tayari.', en: 'Order already paid.' },

  'payment.notFound': { sw: 'Malipo hayapatikani.', en: 'Payment not found.' },
  'payment.initiated': { sw: 'Malipo yameanzishwa.', en: 'Payment initiated.' },
  'payment.alreadyConfirmed': { sw: 'Malipo yamethibitishwa tayari.', en: 'Already confirmed.' },
  'payment.awaitingVerification': { sw: 'Tunathibitisha malipo yako.', en: 'We are verifying your payment.' },
  'payment.verified': { sw: 'Malipo yamethibitishwa! Asante.', en: 'Payment verified! Thank you.' },
  'payment.failed': { sw: 'Malipo hayakupokelewa.', en: 'Payment failed.' },
  'payment.expired': { sw: 'Muda wa malipo umeisha.', en: 'Payment expired.' },
  'payment.invalidPhone': { sw: 'Namba ya simu si sahihi.', en: 'Invalid phone number.' },

  'invitation.notFound': { sw: 'Mwaliko haupatikani.', en: 'Invitation not found.' },
  'invitation.duplicate': { sw: 'Mgeni huyu amealikwa tayari.', en: 'Guest already invited.' },

  'uniform.notFound': { sw: 'Sare haipatikani.', en: 'Uniform not found.' },

  'common.serverError': { sw: 'Hitilafu ya mfumo.', en: 'Server error.' },
};

@Injectable()
export class I18nService {
  t(key: string, lang: Lang = 'sw', vars?: Record<string, any>): string {
    const e = T[key];
    if (!e) return key;
    let text = e[lang] || e.sw;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }
    }
    return text;
  }
}

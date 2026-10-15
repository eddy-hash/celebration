'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/store';
import { Container } from '@/components/ui/Container';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  TrophyIcon, TruckIcon, ShieldCheckIcon, PhoneIcon,
  ShoppingBagIcon, ArrowRightIcon, UserIcon, HeartIcon,
  BriefcaseIcon, StarIcon, CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const T = {
  sw: {
    eyebrow: 'Sherehe ya Ubatizo · 08 Novemba 2026',
    celebrationLine: 'Sherehe ya Ubatizo wa',
    celebrant: 'ERICK EDSONI',
    subtitle: 'Tunashauri kwa upendo vitambaa bora kwa ajili ya sherehe ya ubatizo wa ERICK EDSONI. Ubora, Urembo na Thamani.',
    ctaPrimary: 'Chagua Kitambaa',
    ctaLogin: 'Ingia kwa Mwaliko',
    ctaSeeMore: 'Ona Zaidi',
    stats: { invited: 'Waalikwa', quality: 'Ubora', support: 'Msaada' },
    trust: {
      quality: { title: 'Ubora wa Juu', desc: 'Vitambaa bora na vya kudumu' },
      shipping: { title: 'Usafirishaji', desc: 'Ndani na nje ya Tanzania' },
      payment: { title: 'Malipo Salama', desc: 'Lipa kwa Mixx by Yas' },
      support: { title: 'Huduma Bora', desc: 'Tupo kwa ajili yako kila wakati' },
    },
    categories: {
      eyebrow: 'VITAMBAA VYETU',
      title: 'Aina za Kitambaa',
      subtitle: 'Chagua aina inayokufaa kutoka kwenye vitambaa vyetu bora',
      men: { title: 'Kwa Wanaume', desc: 'Mashati na suruali za kisasa' },
      women: { title: 'Kwa Wanawake', desc: 'Mavazi ya kihifari na ya heshima' },
      accessories: { title: 'Vifaa Vingine', desc: 'Viatu, mikoba na mengineyo' },
      viewProducts: 'Ona Kitambaa',
    },
    cta: {
      eyebrow: 'Karibu Sasa',
      title: 'Tayari kuchagua kitambaa chako?',
      subtitle: 'Ingia kwa namba yako ya mwaliko na uanze kuagiza kwa urahisi.',
    },
    visual: {
      title: 'Floral Kitambaa',
      subtitle: 'Premium · Tanzania',
      badge: 'Bora Zaidi',
      est: 'Est. 2026',
    },
    accountant: 'Mhasibu',
  },
  en: {
    eyebrow: 'Baptism Celebration · 08 November 2026',
    celebrationLine: 'Baptism Celebration of',
    celebrant: 'ERICK EDSONI',
    subtitle: 'We lovingly curate the finest fabrics for the baptism celebration of ERICK EDSONI. Quality, Beauty, and Value.',
    ctaPrimary: 'Choose Your Fabric',
    ctaLogin: 'Sign In with Invite',
    ctaSeeMore: 'See More',
    stats: { invited: 'Invited', quality: 'Quality', support: 'Support' },
    trust: {
      quality: { title: 'Premium Quality', desc: 'Finest and durable fabrics' },
      shipping: { title: 'Fast Delivery', desc: 'Within and outside Tanzania' },
      payment: { title: 'Secure Payment', desc: 'Pay with Mixx by Yas' },
      support: { title: 'Great Support', desc: 'We are here for you always' },
    },
    categories: {
      eyebrow: 'OUR FABRICS',
      title: 'Fabric Categories',
      subtitle: 'Choose the category that fits you from our premium fabrics',
      men: { title: 'For Men', desc: 'Modern shirts and trousers' },
      women: { title: 'For Women', desc: 'Elegant and dignified attire' },
      accessories: { title: 'Accessories', desc: 'Shoes, bags and more' },
      viewProducts: 'View Fabrics',
    },
    cta: {
      eyebrow: 'Welcome Now',
      title: 'Ready to choose your fabric?',
      subtitle: 'Sign in with your invite code and start ordering with ease.',
    },
    visual: {
      title: 'Floral Kitambaa',
      subtitle: 'Premium · Tanzania',
      badge: 'Best Choice',
      est: 'Est. 2026',
    },
    accountant: 'Accountant',
  },
};

export default function HomePage() {
  const { lang } = useI18n();
  const { isLoggedIn } = useAuth();
  const logged = isLoggedIn();
  const text = T[lang];

  const categories = [
    { slug: 'wanaume', Icon: UserIcon, key: 'men' as const },
    { slug: 'wanawake', Icon: HeartIcon, key: 'women' as const },
    { slug: 'vifaa', Icon: BriefcaseIcon, key: 'accessories' as const },
  ];

  const trust = [
    { icon: TrophyIcon, key: 'quality' as const },
    { icon: TruckIcon, key: 'shipping' as const },
    { icon: ShieldCheckIcon, key: 'payment' as const },
    { icon: PhoneIcon, key: 'support' as const },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-bg-base relative">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

          <Container className="relative py-12 sm:py-20 lg:py-28">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1"
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                  className="inline-flex items-center gap-3"
                >
                  <span className="h-px w-6 sm:w-8 bg-gold" />
                  <span className="text-gold text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase">
                    {text.eyebrow}
                  </span>
                  <span className="h-px w-6 sm:w-8 bg-gold" />
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="space-y-2"
                >
                  <p className="text-text-secondary text-xs sm:text-sm font-medium uppercase tracking-[0.2em]">
                    {text.celebrationLine}
                  </p>
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white">
                    <span className="text-brand">{text.celebrant}</span>
                  </h1>
                </motion.div>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  {text.subtitle}
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start"
                >
                  <Link href={logged ? '/kitambaa' : '/ingia'}
                    className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center">
                    <ShoppingBagIcon className="h-5 w-5" />
                    {logged ? text.ctaPrimary : text.ctaLogin}
                  </Link>
                  <a href="#categories"
                    className="btn-ghost text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center">
                    {text.ctaSeeMore}
                    <ArrowRightIcon className="h-5 w-5" />
                  </a>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="pt-4 sm:pt-6 border-t border-border-subtle max-w-lg mx-auto lg:mx-0"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12">
                    {[
                      { value: '300+', label: text.stats.invited },
                      { value: '100%', label: text.stats.quality },
                      { value: '24/7', label: text.stats.support },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white">{s.value}</div>
                        <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="lg:col-span-5 relative order-1 lg:order-2"
              >
                <div className="relative aspect-[4/5] max-w-sm mx-auto w-full rounded-3xl overflow-hidden border border-border-subtle shadow-card">
                  <img src="/fabric.jpg" alt="Kitambaa" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-bg-base/30" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-xl sm:text-2xl text-white">{text.visual.title}</div>
                      <div className="text-white/80 text-[10px] sm:text-xs mt-0.5">{text.visual.subtitle}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-gold/25 backdrop-blur border border-gold/40 flex-shrink-0">
                      <span className="text-gold text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
                        {text.visual.badge}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-bg-base/70 backdrop-blur border border-border-subtle">
                    <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-wider">
                      {text.visual.est}
                    </span>
                  </div>
                </div>
                <div className="hidden lg:block absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand/15 blur-3xl" />
                <div className="hidden lg:block absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
              </motion.div>
            </div>
          </Container>
        </section>

        {/* TRUST */}
        <section className="border-y border-border-subtle bg-bg-elevated/30">
          <Container className="py-6 sm:py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trust.map(({ icon: Icon, key }, i) => (
                <motion.div key={key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border border-brand/30 bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="font-semibold text-white text-xs sm:text-sm truncate">
                      {text.trust[key].title}
                    </div>
                    <div className="text-text-muted text-[10px] sm:text-xs mt-0.5 leading-snug line-clamp-2">
                      {text.trust[key].desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="py-16 sm:py-20 lg:py-28">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto px-2"
            >
              <p className="eyebrow">{text.categories.eyebrow}</p>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white mt-3 sm:mt-5 leading-tight">
                {text.categories.title}
              </h2>
              <p className="text-text-secondary text-xs sm:text-base mt-3 sm:mt-4 leading-relaxed">
                {text.categories.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
              {categories.map((c, i) => {
                const Icon = c.Icon;
                return (
                  <motion.div key={c.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}>
                    <Link href={logged ? `/kitambaa?cat=${c.slug}` : '/ingia'}
                      className="card group block h-full p-5 sm:p-6 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/25 transition-colors duration-500" />
                      <div className="relative">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-brand group-hover:scale-105 transition-all duration-300">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
                          {text.categories[c.key].title}
                        </h3>
                        <p className="text-text-secondary text-xs sm:text-sm mt-2 leading-relaxed">
                          {text.categories[c.key].desc}
                        </p>
                        <div className="mt-4 sm:mt-5 pt-4 border-t border-border-subtle flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium text-brand">
                            {text.categories.viewProducts}
                          </span>
                          <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="pb-16 sm:pb-20 lg:pb-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 via-bg-elevated to-gold/5 p-6 sm:p-12 lg:p-16 text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative max-w-3xl mx-auto">
                <p className="eyebrow">{text.cta.eyebrow}</p>
                <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white mt-3 sm:mt-4 leading-tight">
                  {text.cta.title}
                </h3>
                <p className="text-text-secondary mt-4 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  {text.cta.subtitle}
                </p>
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Link href={logged ? '/kitambaa' : '/ingia'}
                    className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl justify-center">
                    <ShoppingBagIcon className="h-5 w-5" />
                    {logged ? text.ctaPrimary : text.ctaLogin}
                  </Link>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* DATE BANNER */}
        <section className="pb-16 sm:pb-20">
          <Container>
            <div className="flex items-center justify-center gap-3 flex-wrap text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
                <CalendarDaysIcon className="h-4 w-4 text-gold" />
                <span className="text-gold text-xs sm:text-sm font-semibold tracking-wide">
                  {lang === 'sw' ? 'Jumamosi, 08 Novemba 2026' : 'Saturday, 08 November 2026'}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30">
                <StarIcon className="h-4 w-4 text-brand" />
                <span className="text-brand text-xs sm:text-sm font-semibold tracking-wide">
                  {text.celebrationLine} {text.celebrant}
                </span>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

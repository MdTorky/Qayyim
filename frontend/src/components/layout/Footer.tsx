import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
      <div className="brand-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              {language === "ar" ? "قيّم" : "QAYYIM"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {language === "ar"
                ? "قيم ليست مجرد أزياء بل انعكاس للقيم، والتاريخ، والهوية الإسلامية بأسلوب عصري."
                : "More than fashion. A reflection of values, history, and identity expressed through modern design."}
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://instagram.com/official_qayyim.eg" icon={Instagram} />
              {/* <SocialLink href="https://facebook.com" icon={Facebook} /> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t.nav.shop}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/products?gender=Men" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.nav.men}
                </Link>
              </li>
              <li>
                <Link to="/products?gender=Women" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.nav.women}
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hoodies" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.products.hoodies}
                </Link>
              </li>
              <li>
                <Link to="/products?category=Pants" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.products.pants}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">{t.footer.faq}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>

          {/* Newsletter (Simplified) */}
          {/* <div>
            <h3 className="font-bold text-lg mb-6">{language === 'ar' ? 'انضم إلينا' : 'Stay Connected'}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {language === 'ar' ? 'اشترك للحصول على آخر التحديثات.' : 'Subscribe for the latest drops and exclusives.'}
            </p>
            <div className="flex border-b border-gray-700 py-2">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 w-full px-0 text-sm"
              />
              <button className="text-white hover:text-gray-300 transition-colors">
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>{t.footer.copyright}</p>
          {/* <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 brightness-0 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 brightness-0 invert" />
          </div> */}
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
  >
    <Icon className="h-5 w-5" />
  </a>
)

export default Footer;

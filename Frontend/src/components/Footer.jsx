import React from "react";
import {
  FaLinkedin,
  FaTwitterSquare,
  FaYoutube,
  FaFacebookSquare,
  FaPinterest,
  FaWordpress,
} from "react-icons/fa";

const quickLinks = [
  { value: "Terms & Conditions", href: "#!" },
  { value: "Privacy Policy", href: "#!" },
  { value: "Refund Policy", href: "#!" },
];

const socialMedia = [
  { value: "Facebook", href: "#!" },
  { value: "Instagram", href: "#!" },
  { value: "LinkedIn", href: "#!" },
  { value: "Twitter", href: "#!" },
];

const jobInfo = [
  { value: "Select", href: "#!" },
  { value: "Service", href: "#!" },
  { value: "Payment", href: "#!" },
];

const language = [
  { value: "en", text: "US Dollars $" },
  { value: "bn", text: "UK Dollars $" },
];

const currency = [
  { value: "en", text: "English" },
  { value: "bn", text: "Bangla" },
];

const socialIcons = [
  { icon: <FaLinkedin />, href: "#!" },
  { icon: <FaTwitterSquare />, href: "#!" },
  { icon: <FaYoutube />, href: "#!" },
  { icon: <FaFacebookSquare />, href: "#!" },
  { icon: <FaPinterest />, href: "#!" },
  { icon: <FaWordpress />, href: "#!" },
];

const Footer = () => {
  return (
    <section className="bg-white text-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:underline">
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="font-semibold mb-4">Social Media</h5>
            <ul className="space-y-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
              {socialMedia.map((media, i) => (
                <li key={i}>
                  <a href={media.href} className="hover:underline">
                    {media.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Info */}
          <div>
            <h5 className="font-semibold mb-4">Job Info</h5>
            <ul className="space-y-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
              {jobInfo.map((job, i) => (
                <li key={i}>
                  <a href={job.href} className="hover:underline">
                    {job.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Language & Currency */}
          <div>
            <h5 className="font-semibold mb-4">Language</h5>
            <select className="w-full p-2 rounded bg-gray-100 text-sm mb-4">
              {language.map((lang, i) => (
                <option key={i} value={lang.value}>
                  {lang.text}
                </option>
              ))}
            </select>
            <h5 className="font-semibold mb-4">Currency</h5>
            <select className="w-full p-2 rounded bg-gray-100 text-sm">
              {currency.map((cur, i) => (
                <option key={i} value={cur.value}>
                  {cur.text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-10">
          <ul className="flex justify-center md:justify-start space-x-6 text-2xl opacity-50 hover:opacity-100 transition-opacity">
            {socialIcons.map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <div className="mt-6 text-sm text-center md:text-left text-gray-500">
            <span>Copyright &copy; Easy Frontend, All rights reserved</span>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
              {quickLinks.map((link, i) => (
                <a key={i} href={link.href} className="hover:underline">
                  {link.value}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;

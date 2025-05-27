import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaBuilding,
  FaPhone,
} from "react-icons/fa";
import { motion } from "framer-motion";

const socialLinks = [
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/pankaj-s-15633a259",
    label: "LinkedIn",
    bgColor: "bg-[#0A66C2]",
  },
  {
    icon: <FaInstagram />,
    href: "https://www.instagram.com/mr.pankaj_.67?igsh=bWFvdW5scGdiMGJp",
    label: "Instagram",
    bgColor: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  {
    icon: <FaGithub />,
    href: "https://github.com/pankaj-learnscode",
    label: "GitHub",
    bgColor: "bg-[#181717]",
  },
  {
    icon: <FaTwitter />,
    href: "https://x.com/PankajSuma86910",
    label: "Twitter",
    bgColor: "bg-[#1DA1F2]",
  },
  {
    icon: <FaFacebook />,
    href: "https://www.facebook.com/share/15jCxQ6ppV/",
    label: "Facebook",
    bgColor: "bg-[#1877F2]",
  },
];

const contactLinks = [
  {
    icon: <FaEnvelope className="text-indigo-600" />,
    href: "mailto:pankajsuman806041@gmail.com",
    label: "Personal Email",
    text: "pankajsuman806041@gmail.com",
  },
  {
    icon: <FaBuilding className="text-blue-600" />,
    href: "mailto:pankajsuman2204517@dei.ac.in",
    label: "Corporate Email",
    text: "pankajsuman2204517@dei.ac.in",
  },
  {
    icon: <FaPhone className="text-green-600" />,
    href: "tel:+917351240931",
    label: "Phone Number",
    text: "+91 7351240931",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#eef2ff] via-[#dbeafe] to-[#c7d2fe] text-gray-800 py-10 px-6 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Developer Info */}
          <div>
            <motion.h5
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900"
            >
              About the Developer
            </motion.h5>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-3 text-sm text-gray-600 leading-relaxed"
            >
              Pankaj Suman is a passionate full-stack developer crafting modern,
              mobile-first web experiences.
            </motion.p>
            <div className="mt-5 space-y-4">
              {contactLinks.map((contact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  {contact.icon}
                  <a
                    href={contact.href}
                    className="text-sm text-gray-700 hover:text-indigo-600 transition"
                  >
                    {contact.text}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h5
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900"
            >
              Quick Links
            </motion.h5>
            <ul className="mt-4 space-y-3">
              {["Projects", "Blog", "Resume", "Contact"].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                >
                  <a
                    href="#"
                    className="text-sm text-gray-700 hover:text-indigo-600 transition hover:underline"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <motion.h5
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900"
            >
              Connect With Me
            </motion.h5>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 text-sm text-gray-600"
            >
              Follow me on social media for more tech content and updates!
            </motion.p>
            <div className="mt-5 flex flex-wrap gap-4">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  className={`w-11 h-11 rounded-full ${link.bgColor} text-white flex items-center justify-center text-xl shadow hover:scale-105 transition-transform`}
                  aria-label={`Visit Pankaj's ${link.label}`}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 pt-6 border-t border-gray-300 text-center"
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Pankaj Suman. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built with ❤️ using React, Tailwind CSS & Framer Motion.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

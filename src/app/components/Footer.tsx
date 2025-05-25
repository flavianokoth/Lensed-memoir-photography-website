import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#05554F] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Company Info & Social Links - aligned left */}
        <div className="flex flex-col justify-between text-left">
          <div>
            <h3 className="text-2xl font-bold mb-4">Lensed Memoir</h3>
            <p className="text-sm text-gray-300 mb-6 max-w-xs">
              Capturing timeless moments with creativity and heart.
            </p>
          </div>
          <div className="flex space-x-4 text-xl">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook"><FaFacebookF /></Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram"><FaInstagram /></Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter"><FaTwitter /></Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><FaLinkedinIn /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="#about" className="hover:underline">About Us</Link></li>
            <li><Link href="#services" className="hover:underline">Services</Link></li>
            <li><Link href="#gallery" className="hover:underline">Gallery</Link></li>
            <li><Link href="#contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Photography Services</h3>
          <ul className="space-y-2">
            <li>Wedding Photography</li>
            <li>Portrait Photography</li>
            <li>Event Photography</li>
            <li>Product Photography</li>
            <li>Lifestyle & Candid Shoots</li>
            <li>Landscape Photography</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
          <p className="mb-4 text-sm text-gray-300">
            Get updates on our latest shoots, photography tips, and special offers.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md text-gray-800"
              required
            />
            <button
              type="submit"
              className="bg-[#ff7b00] hover:bg-[#ff9433] text-white px-6 py-2 rounded-md font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="mt-10 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Lensed Memoir. All rights reserved.
      </div>
    </footer>
  );
}

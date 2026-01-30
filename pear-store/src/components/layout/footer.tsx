import Link from "next/link";

const footerLinks = {
  shop: [
    { name: "PearPhone", href: "/shop/pearphone" },
    { name: "PearBook", href: "/shop/pearbook" },
    { name: "PearPad", href: "/shop/pearpad" },
    { name: "PearWatch", href: "/shop/pearwatch" },
    { name: "PearPods", href: "/shop/pearpods" },
    { name: "Accessories", href: "/shop/accessories" },
  ],
  account: [
    { name: "Manage Your Account", href: "/account" },
    { name: "Order Status", href: "/account/orders" },
    { name: "Your Devices", href: "/account/devices" },
  ],
  support: [
    { name: "Support Home", href: "/support" },
    { name: "Product Support", href: "/product-support" },
    { name: "Contact Us", href: "/support/contact" },
    { name: "Store Locator", href: "/stores" },
  ],
  company: [
    { name: "About Pear", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Newsroom", href: "/newsroom" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-dark">
              Shop and Learn
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-medium hover:text-gray-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-dark">Account</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-medium hover:text-gray-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-dark">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-medium hover:text-gray-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-dark">
              Pear Computer
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-medium hover:text-gray-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-300 pt-8">
          <p className="text-xs text-gray-medium text-center">
            &copy; {new Date().getFullYear()} Pear Computer Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

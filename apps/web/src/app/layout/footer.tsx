import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-28">
      <footer className="flex flex-col gap-2 sm:flex-row py-4 sm:py-6 border-t border-gray-300">
        <p className="text-xs text-gray-500">
          © 2024 Acme Inc. All rights reserved.
        </p>
        <nav className="mt-2 sm:mt-0 sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;

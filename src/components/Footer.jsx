const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center text-gray-600 text-sm flex items-center justify-center gap-2">
          <span>Powered by</span>
          <a
            href="https://www.ariantechsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#222fb9] hover:underline font-semibold"
          >
            Ariantech Solutions
          </a>
          v-1.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;

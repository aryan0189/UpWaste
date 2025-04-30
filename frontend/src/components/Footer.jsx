const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-600 text-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-200">
          <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} UpWaste. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-green-600">Privacy</a>
            <a href="#" className="hover:text-green-600">Terms</a>
            <a href="#" className="hover:text-green-600">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
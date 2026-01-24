function Footer() {
  return (
    <>
      <footer className="w-full bg-[#72A6BB]">
        <div className="pt-12 pb-12 px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Services */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <h1 className="text-white font-nunito font-bold text-lg">
                Services
              </h1>
              <p className="text-white font-nunito font-light">
                Channel Your Doctor
              </p>
               <p className="text-white font-nunito font-light">
                Make Refund
              </p>
              <p className="text-white font-nunito font-light">
                Ongoing Number Check
              </p>
              <p className="text-white font-nunito font-light">
                Audio/Video Consultation
              </p>
              <p className="text-white font-nunito font-light">Lab Reports</p>
              <p className="text-white font-nunito font-light">Health Mart</p>
            </div>

            {/* DocChannel */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <h1 className="text-white font-nunito font-bold text-lg">
                DocChannel
              </h1>
              <p className="text-white font-nunito font-light">Partners</p>
              <p className="text-white font-nunito font-light">About Us</p>
              <p className="text-white font-nunito font-light">
                Terms & Conditions
              </p>
              <p className="text-white font-nunito font-light">
                Privacy Notice
              </p>
              <p className="text-white font-nunito font-light">Contact Us</p>
              <p className="text-white font-nunito font-light">FAQ</p>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <h1 className="text-white font-nunito font-bold text-lg">
                Follow DocChannel
              </h1>
              <p className="text-white font-nunito font-light">Facebook</p>
              <p className="text-white font-nunito font-light">Twitter</p>
              <p className="text-white font-nunito font-light">Google Plus</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

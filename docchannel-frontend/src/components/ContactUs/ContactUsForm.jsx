import { IoSend } from "react-icons/io5";

function ContactUsForm() {
  return (
    <>
      <div className="p-8 flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="font-nunito font-bold text-black mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full font-nunito bg-[#72A6BB]/34 backdrop-blur-sm rounded-lg px-4 py-2.5 placeholder:text-black focus:outline-none focus:ring-2 focus:ring-black/50 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-nunito font-bold text-black mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full font-nunito bg-[#72A6BB]/34 backdrop-blur-sm rounded-lg px-4 py-2.5 placeholder:text-black focus:outline-none focus:ring-2 focus:ring-black/50 transition"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-nunito font-bold text-black mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter your Subject"
            className="w-full font-nunito bg-[#72A6BB]/34 backdrop-blur-sm rounded-lg px-4 py-2.5 placeholder:text-black focus:outline-none focus:ring-2 focus:ring-black/50 transition"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-nunito font-bold text-black mb-1">
            Description
          </label>
          <textarea
            type="text"
            placeholder="Enter your Description"
            className="w-full font-nunito bg-[#72A6BB]/34 backdrop-blur-sm rounded-lg px-4 py-2.5 placeholder:text-black focus:outline-none focus:ring-2 focus:ring-black/50 transition"
          />
        </div>
        {/* <div className="flex flex-col"> */}
        <div className="flex bg-[#72A6BB] py-4 flex-row rounded-lg px-2 w-auto md:w-[245px] md:justify-around justify-center items-center gap-2">
          <button className="text-white font-nunito font-bold">
            Get In Touch
          </button>
          <IoSend size={20} color="#ffffff" />
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default ContactUsForm;

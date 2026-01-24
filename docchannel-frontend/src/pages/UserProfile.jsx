import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";

function UserProfile() {
  return (
    <>
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"User Profile"} />

        <div className="py-5">
          <div className="flex md:flex-row flex-col gap-2 p-2 bg-[#D9D9D9]/42 rounded-2xl items-center justify-around">
            <div className="flex flex-col gap-3 p-2 items-center">
              <img
                src="data:image/jpeg;base64,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"
                alt=""
                srcset=""
                className="object-cover object-center rounded-full w-[200px] h-[200px]"
              />
              <div className="flex w-full p-2 bg-[#72A6BB] rounded-2xl">
                <button className="font-nunito font-bold text-white px-3">
                  Change Profile Image
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                <div className="flex flex-col gap-1 justify-start">
                  <label className="font-nunito font-bold">Name</label>
                  <span className="font-nunito font-semibold">
                    Hiranye Vithanage
                  </span>
                </div>
                <div className="flex flex-col gap-1 justify-start">
                  <label className="font-nunito font-bold">Email</label>
                  <span className="font-nunito font-semibold">
                    hiran@gmail.com
                  </span>
                </div>
                <div className="flex flex-col gap-1 justify-start">
                  <label className="font-nunito font-bold">
                    Registred Date
                  </label>
                  <span className="font-nunito font-semibold">2026-01-23</span>
                </div>
              </div>
              <div className="flex w-full bg-[#FF002F] rounded-2xl justify-center items-center p-4">
                <button className="font-nunito text-white font-bold">
                  Log Out
                </button>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <Accordion>
              <AccordionItem
                header="Profile Information"
                className={"font-nunito font-bold text-black"}
              >
                
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;

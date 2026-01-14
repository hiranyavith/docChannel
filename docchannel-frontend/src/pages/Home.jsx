import NavBar from "../components/NavBar/NavBar";
import Hero from "../components/Hero/Hero";
import HeroSectionTwo from "../components/Hero/HeroSectionTwo";
import DoctorSearchMain from "../components/DoctorSearch/DoctorSearchMain";
import OtherServicesMain from "../components/Other_Service_Section/OtherServiceMain";
import { otherServices, specializations } from "../data/servicesData";
import GetServiceSection from "../components/GetServiceSction/GetServiceSection";
import ServiceSectionTopic from "../components/Other_Service_Section/SectionTopic";
import ContactUsForm from "../components/ContactUs/ContactUsForm";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      {/* GRADIENT SECTION */}
      <div className="bg-gradient-to-r from-white from-60% to-[#72A6BB] min-h-screen overflow-visible w-full">
        <NavBar />

        <div className="pt-24 px-6 md:px-16">
          <Hero />
        </div>
      </div>
      <div className="pt-10 pb-10 flex items-center justify-center content-center">
        <HeroSectionTwo />
      </div>

      {/* Doctor Search Section Here */}

      <div className="flex justify-center items-center py-8 md:py-12">
        <DoctorSearchMain />
      </div>

      {/* Doctor Search Section Here */}

      {/* Other Services Section */}

      <div className="pt-12 pb-12 px-6 md:px-12">
        <OtherServicesMain
          mainTopic="Other Services"
          subTopic="Services That You Can Experience With Us"
          services={otherServices}
        />
      </div>
      {/* Other Services Section */}

      {/* Specialization Category */}
      <div className="pt-12 pb-12 px-6 md:px-12">
        <OtherServicesMain
          mainTopic="Specialization Category"
          subTopic="Specialization Department That We Offer"
          services={specializations}
        />
      </div>
      {/* Specialization Category */}

      {/* Get Service Section */}
      <section className="w-full bg-[#72A6BB] px-6 md:px-12">
        <GetServiceSection />
      </section>
      {/* Get Service Section */}

      {/* Contact Us Form */}
      <div className="pt-12 pb-12 px-6 md:px-12 flex justify-center items-center flex-col">
        <div className="flex justify-center items-center flex-col pb-12">
          <ServiceSectionTopic
            Topic={"Get In Touch With Us"}
            Sub_Topic={"Get Contact With Us"}
          />
        </div>

        <section className="w-full border-2 border-[#72A6BB] rounded-3xl">
          <ContactUsForm />
        </section>
      </div>
      {/* Contact Us Form */}

      {/* Footer */}

      <Footer />

      {/* Footer */}
    </>
  );
}

export default Home;

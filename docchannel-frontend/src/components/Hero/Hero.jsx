import HeroButton from "./HeroButton";
import heroImage from "../../assets/HeroSectionAssets/doctor-img-hero.svg";
import { FaCircle } from "react-icons/fa";



function Hero() {
  return (
    <section className="max-w-7xl mx-auto min-h-[calc(100vh-96px)] flex items-center">
      <div className="flex flex-col gap-6">
        <h1 className="text-6xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-rubik">
          Premium Treatments <br />
          for a Healthy Lifestyle
        </h1>
        <p className="leading-relaxed max-w-xl z-10 text-sm sm:text-base md:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus egestas,
          ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac
          rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi
          convallis convallis diam sit amet lacinia. Aliquam in elementum
          tellus.
        </p>
        <HeroButton text={"Get Started"} />
      </div>
       <div className="hidden md:flex flex-col justify-center items-center text-center pointer-events-auto flex-1 ">
            <div className="bg-white rounded-full flex items-center justify-center px-3 gap-2 mb-2">
                <FaCircle size={10} color="#08DD3D"/>
              <p className="text-black font-semibold">100+ Doctors Online</p>
            </div>
            <img src={heroImage} alt="Hero Image" className="w-[507px]" />
          </div>
    </section>
  );
}

export default Hero;

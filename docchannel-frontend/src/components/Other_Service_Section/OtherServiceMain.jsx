import FeatureCard from "../FeatureCard/FeatureCard";
import ServiceSectionTopic from "./SectionTopic";

function OtherServicesMain({mainTopic,subTopic,services}) {
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <ServiceSectionTopic
          Topic={mainTopic}
          Sub_Topic={subTopic}
        />
      </div>
      <div className="grid grid-cols-2 place-items-center gap-3 py-12 md:flex md:justify-around">
       {services.map((service, index) => (
          <FeatureCard
            key={index}
            icon={service.icon}
            img_alt={service.alt}
            topic={service.title}
          />
        ))}
       </div>
    </>
  );
}

export default OtherServicesMain;

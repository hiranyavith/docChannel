
function FeatureCard({icon, img_alt, topic}) {
  return (
    <>
      <div className="md:w-[206px] md:h-[206px] w-[133px] h-[133px] border border-2 border-[#E5E5E5] rounded-lg flex flex-col shadow justify-center items-center gap-3">
        <img
          src={icon}
          alt={img_alt}
          className="object-cover md:w-[100px] w-[50px]"
        />
        <h1 className="font-nunito font-bold">{topic}</h1>
      </div>
    </>
  );
}

export default FeatureCard;

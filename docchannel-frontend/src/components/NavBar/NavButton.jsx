function NavButton({ text }) {
  return (
    <>
      <button className="bg-white text-[#000000] px-3 py-1 md:px-5 md:py-2 md:overflow-hidden rounded-full font-medium hover:bg-gray-100 transition font-nunito font-semibold">
        {text}
      </button>
    </>
  );
}

export default NavButton;

import {useNavigate } from "react-router-dom";

function HeaderDocChannel({Title}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-[#72A6BB] flex flex-row justify-center items-center p-3 rounded-full">
        <h1
          className="text-white font-nunito font-extrabold text-xl"
          onClick={() => {
            navigate("/");
          }}
        >
          {Title}
        </h1>
      </div>
    </>
  );
}

export default HeaderDocChannel;

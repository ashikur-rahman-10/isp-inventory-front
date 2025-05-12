import React from "react";
import { Vortex } from "react-loader-spinner";

const CustomLoader = () => {
  return (
    <div>
      <div className="w-full min-h-screen flex justify-center items-center bg-white">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    </div>
  );
};

export default CustomLoader;

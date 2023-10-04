import React from "react";

const NotFound = () => {
  return (
    <div className="m-auto flex items-center h-full justify-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold text-ghost-white">
          <span className="font-semibold">404</span> |{" "}
          <span className="font-semibold">Recurso no disponible</span>
        </h1>
        <p className="text-ghost-white mt-2">
          La página que estás buscando no existe.
        </p>
      </div>
    </div>
  );
};

export default NotFound;

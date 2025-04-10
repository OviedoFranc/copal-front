import { Link, useLocation } from "react-router-dom";

import "../styles/Breadcrumbs.css";

const pathNameMap = {
  socio: "Detalle de Socio",

  socios: "Todos los Socios",

  formsocio: "Formulario de Socio",

  editsocio: "Editar Socio",
};

function Breadcrumbs() {
  let location = useLocation();
//console.log(location.state.id);
  let pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="breadcrumbs">
      <Link className="Link" to="/">
        Inicio
      </Link>

      {pathnames.map((value, index) => {
        let pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        let nameUrl = decodeURIComponent(value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "));
        return (
          <span key={index}>
            {"/ "}

            <Link
              to={pathTo}
              state={location.state ? { id: location.state.id } : null}
            >
              {pathNameMap[value] || nameUrl}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;

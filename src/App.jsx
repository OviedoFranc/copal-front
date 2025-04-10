import "./styles/App.css";

//REACT ROUTER
import { Routes, Route, useLocation } from "react-router-dom";

//PAGES
import Index from "./pages";
import AllSocios from "./pages/allSocios";
import Socio from "./pages/socio";
import FormSocio from "./pages/formSocio";
import Breadcrumbs from "./components/Breadcrumbs";
import NavBar from "./components/NavBar";

//INICIALIZAR ESTADOS GLOBALES
import { sociosStore } from "./store/sociosStore";
import { typeSociosStore } from "./store/typeSociosStore";
import { departmentStore } from "./store/departmentStore";
import useUserStore from "./store/usuariosStore";
import { useEffect } from "react";
import { Footer } from "./components/Footer";
import AllDepto from "./pages/AllDepto";
import FormDepartamento from "./pages/FormDepartamento";
import Depto from "./pages/Depto";
import AllEvent from "./pages/AllEvent";
import Evento from "./pages/Evento";
import Invitacion from "./pages/inviteEvent";
import FormEvento from "./pages/FormEvento";
import AllReservas from "./pages/AllReservas";
import FormReserva from "./pages/FormReserva";
import Reserva from "./pages/Reserva";

function App() {
  const getSocios = sociosStore((state) => state.getSocios);
  const getDepartments = departmentStore((state) => state.getDepartments);
  const getTypeSocios = typeSociosStore((state) => state.getTypeSocios);
  const getAllUsers = useUserStore((state) => state.fetchUsuarios);
  const getPuestos = useUserStore((state) => state.fetchPuestos);
  const getStatusSocios = sociosStore((state) => state.setStatusSocios);

  useEffect(() => {
    getDepartments();
    getTypeSocios();
    getSocios();
    getAllUsers();
    getPuestos();
    getStatusSocios();
  }, []);

  const location = useLocation();

  const renderNavBarAndBreadcrumbs = () => {
    const { pathname } = location;
    return !(pathname.includes("/crearReserva") || pathname.includes("/invitacion"));
  };

  return (
    <>
      <NavBar renderLinks={renderNavBarAndBreadcrumbs()} />
      {renderNavBarAndBreadcrumbs() && <Breadcrumbs/>}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/socios/socio" element={<Socio />} />
        <Route path="/socios" element={<AllSocios />} />
        <Route path="/formsocio" element={<FormSocio />} />
        <Route path="/departamentos" element={<AllDepto />} />
        <Route
          path="/crearDepartamento"
          element={<FormDepartamento accion="crear" />}
        />
        <Route path="/departamentos/:title" element={<Depto />} />
        <Route path="/eventos" element={<AllEvent />} />
        <Route path="/eventos/ver_evento" element={<Evento />} />
        <Route path="/invitacion/:uuid" element={<Invitacion />} />

        <Route path="/crear_Evento" element={<FormEvento />} />
        <Route path="/modificar_Evento" element={<FormEvento />} />

        <Route path="/reservas" element={<AllReservas />} />
        <Route path="/crearReserva" element={<FormReserva />} />
        <Route path="/reservas/reserva" element={<Reserva />} />

        <Route path="*" element={<h1>Pagina no encontrada - 404</h1>} />
      </Routes>

      <Footer></Footer>
    </>
  );
}

export default App;

import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";
import { dropdownStyle, options } from "../styles/stylesComponent";

export const MenuOptions = (
  <Menu style={dropdownStyle}>
    <Menu.Item key="opcion1">
      <NavLink style={options} to="/departamentos">
        Departamentos
      </NavLink>
    </Menu.Item>
    <Menu.Item key="opcion2">
      <NavLink style={options} to="/crearDepartamento">
        Crear Departamento
      </NavLink>
    </Menu.Item>
  </Menu>
);
export const EventOptions = () => (
  <Menu style={dropdownStyle}>
    <Menu.Item key="opcion3">
      <NavLink style={options} to="/eventos">
        Eventos
      </NavLink>
    </Menu.Item>
    <Menu.Item key="opcion4">
      <NavLink
        style={options}
        to="/crear_Evento"
        state={{ stateModoEdicion: false, stateEvento: {} }}
      >
        Crear Eventos
      </NavLink>
    </Menu.Item>
  </Menu>
);
export const SociosOptions = () => (
  <Menu style={dropdownStyle}>
    <Menu.Item key="opcion5">
      <NavLink style={options} to="/socios">
        Socios
      </NavLink>
    </Menu.Item>
    <Menu.Item key="opcion6">
      <NavLink style={options} to="/formsocio">
        Crear Socio
      </NavLink>
    </Menu.Item>
  </Menu>
);
export const ReservasOptions = () => (
  <Menu style={dropdownStyle}>
    <Menu.Item key="opcion7">
      <NavLink style={options} to="/reservas">
        Reservas
      </NavLink>
    </Menu.Item>
    <Menu.Item key="opcion8">
      <NavLink style={options} to="/crearReserva">
        Crear Reserva
      </NavLink>
    </Menu.Item>
  </Menu>
);

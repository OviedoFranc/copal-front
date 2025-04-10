import { NavLink, Link } from "react-router-dom";
import "../styles/NavBar.css";
import { Dropdown } from "antd";
import PropTypes from "prop-types";
import {
  MenuOptions,
  EventOptions,
  SociosOptions,
  ReservasOptions,
} from "./MenuOptions";

const NavBar = ({ renderLinks }) => {
  return (
    <>
      <div className="pre-nav">
        <div className="perfil"></div>
      </div>
      <nav>
        <div>
          <Link to="/">
            <img src="../src/assets/logo-copal.svg"></img>
          </Link>
        </div>
        {renderLinks && (
          <>
            <div className="links">
              <Dropdown overlay={ReservasOptions} placement="bottomLeft">
                <NavLink
                  to="/reservas"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Reservas
                </NavLink>
              </Dropdown>

              <Dropdown overlay={EventOptions} placement="bottomLeft">
                <NavLink
                  to="/eventos"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Eventos
                </NavLink>
              </Dropdown>

              <Dropdown overlay={MenuOptions} placement="bottomLeft">
                <NavLink
                  to="/departamentos"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Departamentos
                </NavLink>
              </Dropdown>

              <Dropdown overlay={SociosOptions} placement="bottomLeft">
                <NavLink
                  to="/socios"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Socios
                </NavLink>
              </Dropdown>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

NavBar.defaultProps = {
  renderLinks: true,
};

NavBar.propTypes = {
  renderLinks: PropTypes.bool,
};

export default NavBar;

import { create } from "zustand";
import axios from "axios";

export const departmentStore = create((set, get) => ({
  departments: [],
  departmentsNames: [],

  getDepartments: async () => {
    const response = await axios("https://copal-back.onrender.com/dpto/departamentos");
    set({departments:response.data});
  },

  getDepartmentById: (id) => {
    return new Promise((resolve, reject) => {
      const department = get().departments.find(
        (department) => department.id === id
      );
      if (department) {
        resolve(department);
      } else {
        reject(`Departmento con ID ${id} no encontrado.`);
      }
    });
  },
  addDepartment: async (department) => {
    const newDptoSendBack = {
      nombre: department.name,
      objetivo: department.objective,
      estaActivo: department.estado === "activo",
    };

    const response = await axios.post(
      "https://copal-back.onrender.com/dpto/altaDepartamento",
      newDptoSendBack
    );

    await get().getDepartments();
    return response;
  },
}));

export const getDepartmentsName = async () => {
  const response = await axios("https://copal-back.onrender.com/dpto/obtenerNombres");
  return response.data;
};
export const getDepartments = async () => {
  const response = await axios("https://copal-back.onrender.com/dpto/departamentos");
  return response.data;
};

export const fetchDeptoById = (id) => {
  return axios
    .get(`https://copal-back.onrender.com/dpto/departamento/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching department by ID:", error);
      return null;
    });
};

export const getPuestos = async () => {
  try {
    const response = await axios("https://copal-back.onrender.com/autoridad/Puestos");
    const puestos = await response.data;
    return puestos;
  } catch (error) {
    console.error("Error al obtener los puestos posibles:", error);
    throw error;
  }
};

export const getUsuarios = async () => {
  try {
    const response = await axios("https://copal-back.onrender.com/usuario/usuarios");
    const usuarios = await response.data;

    return usuarios;
  } catch (error) {
    console.error("Error al obtener los nombres de los usuarios:", error);
    throw error;
  }
};

export const cargarAutoridad = async (idDpto, autoridades) => {
  try {
    const respuesta = await axios.post(
      `https://copal-back.onrender.com/autoridad/agregarAutoridad/${idDpto}`,
      autoridades
    );
    console.log("Autoridad subida con éxito:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error("Error al subir la Autoridad:", error);
    throw error;
  }
};
export const updateDepartment = async (id, departmentData) => {
  try {
    console.log("Actualizando departamento con ID:", id);

    const { autoridades, ...restDepartmentData } = departmentData;

    // console.log("Datos del departamento a actualizar:", restDepartmentData);
    const responseDept = await axios.put(
      `https://copal-back.onrender.com/dpto/editarDepartamento/${id}`,
      restDepartmentData
    );

    if (autoridades && autoridades.length > 0) {
      //      console.log("Autoridades a actualizar:", autoridades);
      const responseAuth = await axios.put(
        `https://copal-back.onrender.com/autoridad/editarAutoridades/${id}`,
        autoridades
      );
      return {
        departamento: responseDept.data,
        autoridades: responseAuth.data,
      };
    }

    return { departamento: responseDept.data };
  } catch (error) {
    console.error("Error al actualizar:", error.response);
    throw error;
  }
};

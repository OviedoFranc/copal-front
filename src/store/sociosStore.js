import { create } from "zustand";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 *
 * @param {{address: string, admin: boolean, category: number, cuit: number, dateCreation: Date, dateUnion: Date, department: [number], description: string, id: number, image: string, mail: string, name: string, password: string, phone: number, status: boolean}} socio
 */
const translatorSocio = (socio, departmentStore, typeSociosStore) => {
  const departments = departmentStore((state) => state.departments);
  const typeSocios = typeSociosStore((state) => state.typeSocios);
  const categorySocio = typeSocios.find((type) => type.id === socio.category);
  const departmentsSocio = departments.filter((department) =>
    socio.department.includes(department.id)
  );
  return {
    ...socio,
    category: categorySocio,
    department: departmentsSocio,
  };
};

export const sociosStore = create((set, get) => ({
  listSocios: [],
  socioSelectDetail: null,
  statusSocios: [],

  getSocios: async () => {
    const response = await axios("https://copal-back.onrender.com/socio/socios");
    const listSocios = await response.data;
    set((state) => ({
      listSocios,
    }));
  },
  setSocioSelectDetail: (id) => {
    const existSocio = get().listSocios.find((socio) => socio.id === id);
    existSocio ? set((state) => ({ socioSelectDetail: id })) : null;
  },
  getSocioDetail: () => {
    /*
        const socio = get().listSocios.find(socio => socio.id === get().socioSelectDetail)
        return translatorSocio(socio, departmentStore, typeSociosStore)
        */
    return get().listSocios.find(
      (socio) => socio.id === get().socioSelectDetail
    );
  },
  cleanSocioSelectDetail: () => {
    set((state) => ({ socioSelectDetail: null }));
  },
  deleteSocioSelectect: async (id) => {
    const response = await axios.put(
      `https://copal-back.onrender.com/socio/bajaSocio/${id}`
    );
    get().getSocios();
  },
  reactivarSocioSelectect: async (socio) => {
    const socioAEnviar = {
      ...socio,
      estado: true,
    };
    const response = await axios.put(
      `https://copal-back.onrender.com/socio/editarSocio/${socioAEnviar.id}`,
      socioAEnviar
    );
    get().getSocios();
  },
  modifySocio: async (socio) => {
    const modifySocioSendToBack = {
      ...socio,
      // category: socio.category.id ,
      // department: socio.department.map(department=>department.id) ,
      image: null,
      imagen: null,
    }; //PARA ENVIAR AL BACK UNA VEZ TENIENDOLO

    const response = await axios.put(
      `https://copal-back.onrender.com/socio/editarSocio/${modifySocioSendToBack.id}`,
      modifySocioSendToBack
    );
    // console.log(await response.data)
    get().getSocios();

    // const newList = get().listSocios.filter(socio => socio.id !== socio.id)
    // set(state => ({
    //     listSocios: [...newList, socio]
    // }))
  },
  getStatusSocios: () => get().statusSocios,
  setStatusSocios: async () => {
    try {
      /*
          const response = await axios.get("https://copal-back.onrender.com/socio/status");
          if (response.data && Array.isArray(response.data)) {
            set({ statusSocios: ["Activo", "Inactivo"] });
          }*/
      set({ statusSocios: ["Activo", "Inactivo"] });
    } catch (error) {
      console.error("Error al obtener estados de socios:", error);
    }
  },
  addSocio: async (socio) => {
    // console.log(socio)

    const newSocioSendToBack = {
      ...socio,
      // category: socio.category.id ,
      // department: socio.department.map(department=>department.id) ,
      image: null,
      imagen: null,
      dateUnion: new Date(),
      estado: true,
    }; //PARA ENVIAR AL BACK UNA VEZ TENIENDOLO

    const response = await axios.post(
      "https://copal-back.onrender.com/socio/alta",
      newSocioSendToBack
    );
    await get().getSocios(); //esto para actualizar la lista de socios

    return response;

    /*
        await axios.post("url", newSocioSenToBack)
        get().getSocio() //esto para actualizar la lista de socios
        */

    /*
        await axios.post("url", newSocioSenToBack)
        get().getSocio() //esto para actualizar la lista de socios
        */

    // const newSocio = {
    //     ...socio,
    //     status: true, //por ahora
    //     id: get().listSocios.reduce((maxSocio, socio) => socio.id > maxSocio.id ? socio : maxSocio, get().listSocios[0]).id + 1
    // }
    // // console.log(newSocio)
    // set(state => ({
    //     listSocios: [...state.listSocios, newSocio]
    // }))
  },

  // TODO: REFACTORIZAR ESTO ES UN CUSTOM HOOK
  listDepartament: () => {
    const [deptos, setDeptos] = useState(null);

    useEffect(() => {
      axios.get("https://copal-back.onrender.com/dpto/departamentos").then((response) => {
        setDeptos(response.data);
      });
    }, []);
    // console.log(deptos);

    return deptos;
  }, // TODO: REFACTORIZAR ESTO ES UN CUSTOM HOOK
  deptoForId: (id) => {
    const [deptos, setDeptos] = useState(null);

    useEffect(() => {
      axios
        .get(`https://copal-back.onrender.com/dpto/departamento/${id}`)
        .then((response) => {
          setDeptos(response.data);
        });
    }, []);
    return deptos;
  },
}));

/*
{
    "name": "tobias",
    "description": "una descripcion",
    "mail": "tobias@gmial.com",
    "phone": 1160873455,
    "category": 2,
    "image": "http://urlimagen",
    "address": "http://hola",
    "cuit": 44886004,
    "department": [1,2],
    "dateUnion": "2003-01-05"
}
*/

export const disableDepto = (id) => {
  // axios.put(`https://copal-back.onrender.com/dpto/bajaDepartamento/${id}`)
  //     .then((response) => {
  //         return response;
  //     });
  return new Promise((resolve, reject) => {
    axios
      .put(`https://copal-back.onrender.com/dpto/bajaDepartamento/${id}`)
      .then((response) => {
        resolve(response); // Resuelve la Promesa con la respuesta exitosa
      })
      .catch((error) => {
        reject(error); // Rechaza la Promesa con el error
      });
  });
};

export const getSocioById = (id) => {
  try {
    const response = axios.get(
      `https://copal-back.onrender.com/socio/obtenerSocio/${id}`
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getEtiquetas = async () => {
  try {
    const response = await axios.get(`https://copal-back.onrender.com/etiquetas`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

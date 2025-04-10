import axios from "axios";
import defaultImage from "../assets/defaultImage.jpg";

export const subirImagenDpto = async (id, imagenArchivo) => {
	const formData = new FormData();
	formData.append('imagen', imagenArchivo);

	try {
		const respuesta = await axios.post(
      `https://copal-back.onrender.com/api/imagenes/subirImgDpto/${id}`,
      formData
    );
		console.log('Imagen subida con éxito:', respuesta.data);
		return respuesta.data;
	} catch (error) {
		console.error('Error al subir la imagen:', error);
		throw error;
	}
};

export const subirImagenSocio = async (id, imagenArchivo) => {
	const formData = new FormData();
	formData.append('imagen', imagenArchivo);

	try {
		const respuesta = await axios.post(
      `https://copal-back.onrender.com/api/imagenes/subirImgSocio/${id}`,
      formData
    );
		console.log('Imagen subida con éxito:', respuesta.data);
		return respuesta.data;
	} catch (error) {
		console.error('Error al subir la imagen:', error);
		throw error;
	}
};



export const obtenerImagenDpto = async (id) => {
  try {
      const respuesta = await axios.get(
          `https://copal-back.onrender.com/api/imagenes/obtenerImgDpto/${id}`,
          {
              responseType: "blob",
          }
      );
      const blob = new Blob([respuesta.data], {
          type: 'image/jpeg'
      });

      return URL.createObjectURL(blob);
  } catch (error) {
     // console.error("Error al obtener la imagen desde la API", error);
      return null;
  }
};

export const obtenerImagenSocio = async (id) => {
    try {
        const respuesta = await axios.get(
            `https://copal-back.onrender.com/api/imagenes/obtenerImgSocio/${id}`,
            {
                responseType: "blob",
            }
        );
        const blob = new Blob([respuesta.data], {
            type: 'image/jpeg'
        });
  
        return URL.createObjectURL(blob);
    } catch (error) {
       return defaultImage;
    }
};
  

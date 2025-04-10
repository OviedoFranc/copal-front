import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = "https://copal-back.onrender.com";

const useUserStore = create((set) => ({
    users: [],
    puestos: [],
    fetchUsuarios: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/usuario/usuarios`);
            if (response.status === 200) {
                set({ users: response.data });
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        }
    },
    darDeAltaUsuario: async (usuarioDTO) => {
        try {
            const response = await axios.post(`${BASE_URL}/usuario/altaUsuario`, usuarioDTO);
            if (response.status === 201) {
                set(state => ({ users: [...state.users, response.data] }));
            }
        } catch (error) {
            console.error("Error al dar de alta al usuario:", error);
        }
    },
    darDeBajaUsuario: async (id) => {
        try {
            const response = await axios.put(`${BASE_URL}/usuario/bajaUsuario/${id}`);
            if (response.status === 204) {
                set(state => ({ users: state.users.filter(user => user.id !== id) }));
            }
        } catch (error) {
            console.error("Error al dar de baja al usuario:", error);
        }
    },
    actualizarUsuario: async (id, usuarioDTO) => {
        try {
            const response = await axios.put(`${BASE_URL}/usuario/actualizarUsuario/${id}`, usuarioDTO);
            if (response.status === 200) {
                set(state => ({
                    users: state.users.map(user => user.id === id ? response.data : user)
                }));
            }
        } catch (error) {
            console.error("Error al actualizar al usuario:", error);
        }
    },
    fetchPuestos: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/autoridad/Puestos`);
            if (response.status === 200) {
                set({ puestos: response.data });
            }
        } catch (error) {
            console.error("Error al obtener los roles:", error);
        }
    }
}));

export default useUserStore;

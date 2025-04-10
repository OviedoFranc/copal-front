import { create } from "zustand"
import axios from "axios"

export const typeSociosStore = create((set, get) => ({
    typeSocios: [],
    getTypeSocios : async ()=> {
        const response = await axios("https://copal-back.onrender.com/categorias")
        const typeSocios = await response.data

        set(state => ({
            typeSocios
        }))
    },
    getTypeSocioById : (id)=>{
        return get().typeSocios.find(type => type.id === id)
    }
}))
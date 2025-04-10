import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

export const buttonEditar = {
  padding: "18.5px 30px",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
};
export const buttonEliminar = {
  backgroundColor: "#fff",
  border: "1px solid #76B8C3",
  color: "#283549",
  cursor: "pointer",
  padding: "17.5px 29px",
  textTransform: "uppercase",
};

export const dropdownStyle = {
  marginTop: "35px",
  borderRadius: 0,
  backgroundColor: "#283549",
  padding: "20px 50px",
  alingItem: "center",
  gap: "10px",
};

export const options = {
  color: "#FFFFFF",
  fontSize: "14px",
};

export const inputText = {
  width: "359px",
  borderColor: "#0000FF",
};

export const inputObjetivos = {
  width: "100%",
  //   height: "113px",
  // padding: "0 13px",
  //   borderColor: "#0000FF",
  //backgroundColor: "#0F0"
  //   border: "1px solid #76B8C3",
};

export const iconElement = {
  color: "#D55453",
  width: "16px",
  height: "16px",
};

export const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#76B8C3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#76B8C3",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#76B8C3",
    },
  },
});
export const estilosBarraBusqueda = {
  width: "100%",
  height:"52px",
  backgroundColor: "white",
  border: "1px solid #000000",
  padding:"10px 23px"
};
export const iconEditar = {
  color: "#D9D9D9",
  width: "20px",
  height: "20px",
};
export const iconSuspendido = {
  color: "#EB9B23",
};
export const iconActivo = {
  color: "#1BEC17",
};

export const iconCancelado = {
  color: "#F11513",
};
export const iconFinalizado = {
  color: "#908E8E",
};

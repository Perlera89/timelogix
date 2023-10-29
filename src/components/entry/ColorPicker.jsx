import { ColorPicker, Divider } from "antd";

const App = ({ selectedColor, handleColorChange }) => {
  console.log("selectedColor", selectedColor);

  const colorMap = {
    "#FFFF00": "yellow",
    "#FFD700": "gold",
    "#FFA500": "orange",
    "#FF0000": "red",
    "#FF1493": "pink",
    "#9400D3": "mangenta",
    "#800080": "purple",
    "#0000FF": "blue",
    "#008000": "green",
    "#00FF00": "lime",
    "#4682B4": "geekblue",
    "#800000": "brown",
    "#5F0000": "cyan",
  };

  return (
    <ColorPicker
      color={selectedColor}
      defaultValue="#808080"
      showText
      format="hex"
      onChange={handleColorChange}
      className="w-36"
      renderLabel={(color) => <span style={{ color }}>{color.label}</span>}
      presets={[
        {
          label: "Recommended",
          colors: [
            "#FFFF00", // Amarillo
            "#FFD700", // Oro
            "#FFA500", // Naranja
            "#FF8C00", // Naranja oscuro
            "#FF4500", // Rojo anaranjado
            "#FF0000", // Rojo
            "#FF1493", // Rosa claro
            "#FF69B4", // Rosa
            "#9400D3", // Violeta
            "#800080", // Púrpura
            "#8A2BE2", // Azul violeta
            "#4B0082", // Índigo
            "#0000FF", // Azul
            "#008080", // Verde azulado
            "#008000", // Verde
            "#32CD32", // Verde lima claro
            "#00FF00", // Verde lima
            "#7FFF00", // Verde chartreuse
            "#556B2F", // Verde oliva
            "#2E8B57", // Verde mar
            "#5F9EA0", // Azul cadete
            "#4682B4", // Azul acero
            "#D2691E", // Chocolate
            "#8B0000", // Marrón oscuro
            "#800000", // Marrón
            "#A52A2A", // Marrón rojizo
            "#5F0000", // Rojo oscuro
          ],
        },
      ]}
      panelRender={(_, { components: { Picker, Presets } }) => (
        <div
          className="custom-panel"
          style={{
            display: "flex",
            width: 468,
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <Presets />
          </div>
          <Divider
            type="vertical"
            style={{
              height: "auto",
            }}
          />
          <div
            style={{
              width: 234,
            }}
          >
            <Picker />
          </div>
        </div>
      )}
    />
  );
};

export default App;

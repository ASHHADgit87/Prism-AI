import { X } from "lucide-react";
import  { useEffect, useState } from "react";

interface EditorPanelProps {
  selectedElement: {
    tagName: string;
    className: string;
    text: string;
    styles: {
      padding: string;
      margin: string;
      backgroundColor: string;
      color: string;
      fontSize: string;
    };
  } | null;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const EditorPanel = ({
  selectedElement,
  onUpdate,
  onClose,
}: EditorPanelProps) => {
  const [values, setValues] = useState(selectedElement);

  useEffect(() => {
    setValues(selectedElement);
  }, [selectedElement]);

  if (!selectedElement || !values) return null;

  const handleChange = (field: string, value: string) => {
    const newValues = {
      ...values,
      [field]: value,
    };
    if (field in values.styles) {
      newValues.styles = {
        ...values.styles,
        [field]: value,
      };
    }
    setValues(newValues);
    onUpdate({ [field]: value });
  };

  const handleStyleChange = (styleName: string, value: string) => {
    const newStyles = { ...values.styles, [styleName]: value };
    setValues({ ...values, styles: newStyles });
    onUpdate({ styles: { [styleName]: value } });
  };

  return (
    <div
      className="absolute top-4 right-4 w-80 rounded-lg shadow-xl border p-4 z-50 animate-fade-in fade-in"
      style={{
        backgroundColor: "#004d1a",
        borderColor: "#005c2a",
        color: "white",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold" style={{ color: "white" }}>
          Edit Element
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#005c2a] transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: "#a3f7c1" }}
          >
            Text Content
          </label>
          <textarea
            value={values.text}
            onChange={(e) => handleChange("text", e.target.value)}
            className="w-full text-sm p-2 rounded-md focus:ring-2 outline-none transition-all"
            style={{
              backgroundColor: "#00331a",
              color: "white",
              border: "1px solid #005c2a",
              minHeight: "5rem",
            }}
          />
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: "#a3f7c1" }}
          >
            Class Name
          </label>
          <input
            type="text"
            value={values.className || ""}
            onChange={(e) => handleChange("className", e.target.value)}
            className="w-full text-sm p-2 rounded-md focus:ring-2 outline-none transition-all"
            style={{
              backgroundColor: "#00331a",
              color: "white",
              border: "1px solid #005c2a",
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#a3f7c1" }}
            >
              Padding
            </label>
            <input
              type="text"
              value={values.styles.padding}
              onChange={(e) => handleStyleChange("padding", e.target.value)}
              className="w-full text-sm p-2 rounded-md focus:ring-2 outline-none transition-all"
              style={{
                backgroundColor: "#00331a",
                color: "white",
                border: "1px solid #005c2a",
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#a3f7c1" }}
            >
              Margin
            </label>
            <input
              type="text"
              value={values.styles.margin}
              onChange={(e) => handleStyleChange("margin", e.target.value)}
              className="w-full text-sm p-2 rounded-md focus:ring-2 outline-none transition-all"
              style={{
                backgroundColor: "#00331a",
                color: "white",
                border: "1px solid #005c2a",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#a3f7c1" }}
            >
              Font Size
            </label>
            <input
              type="text"
              value={values.styles.fontSize}
              onChange={(e) => handleStyleChange("fontSize", e.target.value)}
              className="w-full text-sm p-2 rounded-md focus:ring-2 outline-none transition-all"
              style={{
                backgroundColor: "#00331a",
                color: "white",
                border: "1px solid #005c2a",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#a3f7c1" }}
            >
              Background
            </label>
            <div
              className="flex items-center gap-2 rounded-md p-1"
              style={{
                border: "1px solid #005c2a",
                backgroundColor: "#00331a",
              }}
            >
              <input
                type="color"
                value={
                  values.styles.backgroundColor === "rgba(0, 0, 0, 0)"
                    ? "#ffffff"
                    : values.styles.backgroundColor
                }
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                className="w-6 h-6 cursor-pointer"
              />
              <span className="text-xs truncate" style={{ color: "white" }}>
                {values.styles.backgroundColor}
              </span>
            </div>
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#a3f7c1" }}
            >
              Text Color
            </label>
            <div
              className="flex items-center gap-2 rounded-md p-1"
              style={{
                border: "1px solid #005c2a",
                backgroundColor: "#00331a",
              }}
            >
              <input
                type="color"
                value={values.styles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
              <span className="text-xs truncate" style={{ color: "white" }}>
                {values.styles.color}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;

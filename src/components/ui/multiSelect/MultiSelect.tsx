import { useState } from "react";

type optionsType = string[];

const MultiSelect = () => {
  const options: optionsType = ["React", "Node.js", "MongoDB", "Tailwind", "TypeScript"];
  const [selected, setSelected] = useState<optionsType>([]);

  const toggleSelect = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <label className="block text-lg font-medium mb-2 text-gray-700">
        Select Technologies:
      </label>

      <div className="border rounded-lg p-2 shadow-sm">
        {options.map((option) => (
          <div key={option} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleSelect(option)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-800">{option}</label>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {item}
                <button
                  onClick={() =>
                    setSelected(selected.filter((i) => i !== item))
                  }
                  className="ml-2 text-blue-500 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

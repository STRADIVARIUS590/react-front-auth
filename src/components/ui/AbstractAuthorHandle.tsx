export const AbstractAuthorHandle = ({ values, setValues }: { values: string[], setValues: React.Dispatch<React.SetStateAction<string[]>> }) => {
  
  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = event.target.value; 

      // If the value is empty, remove the input at the given index
      if (newValues[index] === '') {
        newValues.splice(index, 1); // Remove the empty input
      }

      return newValues;
    });
  };

  const addInput = () => {
    setValues((prevValues) => [...prevValues, ""]); // Add a new empty input field
  };

  return (
    <div className="space-y-4">
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={value}
            onChange={(e) => handleChange(index, e)}
            placeholder={`Autor ${index + 1}`}
          />
        </div>
      ))}
      
      <button 
        type="button"
        onClick={addInput}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        + Agregar Autor
      </button>
    </div>
  );
};

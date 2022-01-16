interface Props {
  label: string;
}

export default function Checkbox(props: Props) {
  const { label } = props;

  return (
    <label
      className="inline-block text-gray-800 form-check-label"
      htmlFor={label.toLowerCase()}
    >
      <input
        className="float-left w-4 h-4 mt-1 ml-3 mr-1 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-sm appearance-none cursor-pointer form-check-input checked:bg-purple-600 checked:border-purple-600 focus:outline-none"
        type="checkbox"
        value=""
        id={label.toLowerCase()}
      />
      {label}
    </label>
  );
}

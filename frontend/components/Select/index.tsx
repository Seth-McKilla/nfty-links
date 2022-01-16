import { useState } from "react";

interface Props {
  options: string[];
  [key: string]: any;
}

export default function Select(props: Props) {
  const { options, ...rest } = props;

  const [selected, setSelected] = useState(props.options[0]);
  return (
    <div className="flex justify-center">
      <div className="mb-3 xl:w-96">
        <select
          className="cursor-pointer form-select appearance-none block w-full px-3 py-1.5 text-basefont-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-purple-600 focus:outline-none"
          aria-label="Default select example"
          {...rest}
        >
          {options.map((option, idx) => (
            <option
              key={`${idx}-${option}`}
              value={option.toLowerCase()}
              onClick={(e) => setSelected((e.target as HTMLInputElement).value)}
              selected={selected === option.toLowerCase()}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

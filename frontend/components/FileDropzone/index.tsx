import { ChangeEvent } from "react";
import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

interface Props {
  name: string;
  control: any;
  [key: string]: any;
}

export default function FileDropzone(props: Props) {
  const { name, control, ...rest } = props;

  return (
    <Controller
      render={({ field: { onChange } }) => (
        <Dropzone
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.files![0])
          }
          {...rest}
        />
      )}
      name={name}
      control={control}
      defaultValue=""
      rules={{ required: true }}
    />
  );
}

interface DropzoneProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Dropzone = ({ onChange, ...rest }: DropzoneProps) => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: "image/*",
    ...rest,
  });

  return (
    <div
      className="relative w-full h-24 mb-5 border border-gray-400 border-dashed rounded-md cursor-pointer"
      {...getRootProps()}
    >
      <h2 className="grid h-full text-center text-gray-500 place-items-center">
        Drag Image <br /> or <br /> Click to Select
      </h2>
      <input {...getInputProps({ onChange })} />
      <h2>{`Filename: ${
        acceptedFiles.length > 0 ? acceptedFiles[0].name : "None..."
      }`}</h2>
    </div>
  );
};

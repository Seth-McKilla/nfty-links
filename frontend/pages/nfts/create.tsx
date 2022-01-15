import { NextPage } from "next";
import { NFTStorage, File } from "nft.storage";
import { useForm, SubmitHandler } from "react-hook-form";
import { Layout, Button } from "../../components";

type Inputs = {
  name: string;
  description: string;
  image: File;
};

declare const process: {
  env: {
    NEXT_PUBLIC_NFT_STORAGE_API_KEY: string;
  };
};

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY,
});

const Create: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <Layout>
      <div className="grid h-screen place-items-center ">
        <form
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block mb-2 text-lg font-bold text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full px-5 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Image name"
              {...register("name", { required: true })}
            />
            {errors.name && <span>This field is required</span>}
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-lg font-bold text-gray-700 "
              htmlFor="description"
            >
              Description
            </label>
            <input
              className="w-full px-5 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Image description"
              {...register("description", { required: true })}
            />
            {errors.description && <span>This field is required</span>}
          </div>

          <Button type="submit" loading={false}>
            Submit
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Create;

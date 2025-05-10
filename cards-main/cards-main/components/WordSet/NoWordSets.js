import { Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import image from "@/assets/no_sets.svg";

export default function NoWordSets() {
  const router = useRouter();

  const handleCreateSetClick = () => {
    router.push("/word-sets/create");
  };

  return (
    <div
      className={`
          bg-gray-50 w-screen h-screen flex items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-6">
        <div>
          <Image alt="no sets yet" src={image} className="w-auto" />
        </div>
        <div>
          <p className="text-5xl font-bold text-gray-300">No sets yet</p>
        </div>
        <div>
          <Chip
            label="Create your first set"
            onClick={handleCreateSetClick}
            className="font-extrabold text-md text-gray-500 p-1"
          />
        </div>
      </div>
    </div>
  );
}

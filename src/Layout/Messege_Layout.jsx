
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ConnectedUser from "../components/ConnectedUser";
import ConnectedProf from "../components/ConnectedProf";

function Messege_Layout() {
  return (
    <section className="flex flex-col min-h-screen">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex justify-center flex-grow mt-12">
        <div className="grid grid-cols-1 md:grid-cols-7 w-[90%] gap-4 flex-grow">
          <div className="md:col-span-2 border rounded-lg overflow-hidden shadow-sm">
            <ConnectedUser />
          </div>
          <div className="md:col-span-3 flex flex-col flex-grow">
            <Outlet />
          </div>
          <div className="md:col-span-2 overflow-hidden">
            <ConnectedProf />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Messege_Layout;
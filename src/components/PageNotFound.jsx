import { Link } from "react-router-dom";
import pageNotFound from "../assets/404-error-page-templates.jpg";

function PageNotFound() {
  //   const error = useRouteError();
  //   // console.error(error);

  //   const style = {
  //     backgroundImage: `url(${pageNotFound})`
  //   };

  return (
    <section>
      <Link to="/">
        <div className="flex flex-col items-center justify-center h-[100vh]">
          <div className="w-[100%]">
            <img src={pageNotFound} alt="" className="w-[100%]" />
          </div>
        </div>
      </Link>
    </section>
  );
}

export default PageNotFound;

import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, matchPath, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";

import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

export const NavbarModel = ({ setConfirmationModalNav }) => {
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false); // Toggle for catalog dropdown

  useEffect(() => {
    const fetchAllCategory = async () => {
      setLoading(true);
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        // console.log("result category", result);
        setSubLinks(result.data.data);
      } catch (error) {
        console.error("Could not fetch Categories", error);
      }
      setLoading(false);
    };
    fetchAllCategory();
  }, []);

  //   console.log("length", subLinks?.length);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleCatalogClick = () => {
    setIsCatalogOpen((prevState) => !prevState); // Toggle the dropdown
  };

  return (
    <div>
      <div className="fixed lg:hidden md:hidden inset-0 z-[100] overflow-y-hidden  grid place-items-start  justify-items-end mt-14 overflow-auto transition- duration-1000">
        <div className="w-5/12 h-screen max-w-[350px]  border-richblack-400 bg-richblack-900  bg-opacity-95 p-6 transition-transform  duration-1000">
          <div>
            <button
              onClick={() => setConfirmationModalNav(false)}
              className="text-white -mt-1"
            >
              <RxCross2 size={30} />
            </button>
          </div>
          <hr className="text-white opacity-50 mb-5" />
          <div className="flex flex-col w-11/12 max-w-maxContent items-center justify-between">
            {/* Navigation links */}
            <nav className="flex">
              <ul className="flex flex-col gap-y-7 text-richblack-25 font-semibold">
                {NavbarLinks.map((link, index) => (
                  <li key={index}>
                    {link.title === "Catalog" ? (
                      <>
                        <div
                          className={`flex cursor-pointer items-center gap-1 ${
                            matchRoute("/catalog/:catalogName")
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          }`}
                          onClick={handleCatalogClick} // Toggle on click
                        >
                          <p>{link.title}</p>
                          <BsChevronDown />
                        </div>
                        {isCatalogOpen && ( // Display dropdown if open
                          <div className="absolute left-[50%] top-[1%] z-[1000] flex translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-100 transition-all duration-150 lg:w-[300px] md:w-[250px] w-[150px]">
                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                            {loading ? (
                              <p className="text-center">Loading...</p>
                            ) : subLinks?.length ? (
                              <>
                                {subLinks.map((subLink, i) => (
                                  <Link
                                    to={`/catalog/${subLink.name
                                      .split(" ")
                                      .join("-")
                                      .toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-richblack-500"
                                    key={i}
                                  >
                                    <p>{subLink.name}</p>
                                  </Link>
                                ))}
                              </>
                            ) : (
                              <p className="text-center">No Courses Found</p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link to={link?.path}>
                        <p
                          className={`${
                            matchRoute(link?.path)
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          }`}
                        >
                          {link.title}
                        </p>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

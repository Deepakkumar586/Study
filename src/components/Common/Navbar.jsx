import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../../components/core/Auth/ProfileDropdown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { NavbarModel } from "./NavbarModel";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [confirmationModalNav, setConfirmationModalNav] = useState(false);
  const dispatch = useDispatch();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);

  const fetchSublinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.data);
      setFilteredLinks(result.data.data);
    } catch (err) {
      console.error("Could not fetch the category list.", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  useEffect(() => {
    const filtered = subLinks.filter((link) =>
      link.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLinks(filtered);
  }, [searchQuery, subLinks]);

  const matchRoute = (route) => {
    return matchPath({ path: route, end: true }, location.pathname);
  };

  const handleClick = () => {
    setIsCatalogOpen((prev) => !prev); // Toggle catalog open/close on click
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      {confirmationModalNav && (
        <NavbarModel setConfirmationModalNav={setConfirmationModalNav} />
      )}
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="Logo" width={130} height={32} loading="lazy" />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link?.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                    onClick={handleClick} // Toggle dropdown on click
                  >
                    <p>{link?.title}</p>
                    <IoIosArrowDown />
                    {isCatalogOpen && (
                      <div
                        className="absolute left-[50%] top-[50%] z-[1000] flex w-[300px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-100 transition-all duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        <input
                          type="text"
                          placeholder="Search Catalog..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full mb-4 p-2 rounded-lg border border-richblack-300 bg-richblack-200 text-richblack-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : filteredLinks?.length ? (
                          filteredLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50"
                              key={i}
                            >
                              {subLink.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-center">No Matches Found</p>
                        )}
                      </div>
                    )}
                  </div>
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

        <div className="flex items-center gap-x-3">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to="/login">
                <button className=" rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 ml-1">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
        <button
          className="mr-4 md:hidden lg:hidden"
          onClick={() => setConfirmationModalNav(true)}
        >
          <AiOutlineMenu fontSize={30} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

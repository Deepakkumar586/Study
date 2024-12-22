import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../components/Common/Footer";
import Course_Card from "../components/core/Catalog/Course_Card";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas";
import Error from "./Error";

function Catalog() {
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const category_id = res?.data?.data?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName.split(" ").join("-").toLowerCase()
      )[0]._id;

      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true);
      try {
        const res = await getCatalogPageData(categoryId);
        if (res.success) {
          setCatalogPageData(res);
        } else {
          setCatalogPageData(null);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-richblack-100 mx-auto text-3xl">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4 py-12">
        <div className="mx-auto flex flex-col justify-center gap-4 max-w-7xl">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
          <p className="max-w-3xl text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mx-auto box-content w-full max-w-7xl px-4 py-12">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${active === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"}`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${active === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"}`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <Course_Slider Courses={catalogPageData?.data?.selectedCategory?.courses} />
        </div>
      </div>

      {/* Section 2 */}
      <div className="mx-auto box-content w-full max-w-7xl px-4 py-12">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          <Course_Slider Courses={catalogPageData?.data?.differentCategory?.courses} />
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto box-content w-full max-w-7xl px-4 py-12">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;

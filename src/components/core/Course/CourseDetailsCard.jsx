import React from "react";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }
    if (token) {
      dispatch(addToCart(course))
        .then(() => toast.success("Added to Cart"))
        .catch(() => toast.error("Failed to add to cart"));
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add to Cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const isEnrolled = user && course?.studentsEnrolled?.includes(user?._id);

  return (
    <div className="flex flex-col gap-4 p-4 bg-richblack-700 rounded-md text-richblack-5">
      {/* Thumbnail and Share Button */}
      <div className="relative w-full h-48 md:h-64">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="object-cover w-full h-full rounded-md"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-yellow-500 rounded-full hover:bg-yellow-600"
          onClick={handleShare}
        >
          <FaShareSquare size={20} />
        </button>
      </div>

      {/* Course Details */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">Rs. {course.price}</span>
          {isEnrolled && (
            <span className="font-semibold text-green-500">Enrolled</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 md:flex-row">
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={
              isEnrolled
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {isEnrolled ? "Go To Course" : "Buy Now"}
          </button>
          {!isEnrolled && (
            <button
              className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          30-Day Money-Back Guarantee
        </div>

        {/* Course Includes */}
        <div>
          <h3 className="text-lg font-semibold">This Course Includes:</h3>
          <ul className="text-sm text-gray-300 list-disc list-inside">
            {course.instructions?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsCard;

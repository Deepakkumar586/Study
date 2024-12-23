import React from "react";
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
      // Show a toast informing the user to log in
      toast.error(
        "Please log in to your account to add this course to your cart.",
        {
          duration: 5000, // Show for 5 seconds
        }
      );

      // Optionally, open a login prompt or redirect to login
      // setConfirmationModal({
      //   text1: "You are not logged in!",
      //   text2: "Please login to add to Cart.",
      //   btn1Text: "Login",
      //   btn2Text: "Cancel",
      //   btn1Handler: () => navigate("/login"),
      //   btn2Handler: () => setConfirmationModal(null),
      // });
    }
  };

  const isEnrolled = user && course?.studentsEnrolled?.includes(user?._id);

  return (
    <div className="flex flex-col gap-6 p-6 bg-richblack-700 rounded-lg text-richblack-5 shadow-lg transition-transform duration-300 transform hover:scale-105">
      {/* Image and Share Button */}
      <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="object-cover w-full h-full rounded-lg"
        />
        <button
          className="absolute top-4 right-4 p-3 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors duration-300"
          onClick={handleShare}
        >
          <FaShareSquare size={20} />
        </button>
      </div>

      {/* Course Info Section */}
      <div className="flex flex-col gap-4">
        {/* Price & Enrollment Status */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-richblack-5">
            Rs. {course.price}
          </span>
          {isEnrolled && (
            <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
              Enrolled
            </span>
          )}
        </div>

        {/* Buy Now & Add to Cart Buttons */}
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <button
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
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
              className="w-full md:w-auto px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Money-Back Guarantee */}
        <div className="text-center text-sm text-gray-400 mt-4">
          30-Day Money-Back Guarantee
        </div>

        {/* Course Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-richblack-5">
            This Course Includes:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-richblack-200">
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

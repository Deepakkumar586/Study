import { useDispatch, useSelector } from "react-redux";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import Footer from "../../../Common/Footer";

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 30;

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        {courses?.length === 0 ? (
          <div className="text-center text-xl font-semibold text-richblack-100">
            No courses found
          </div>
        ) : (
          courses?.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4 md:gap-8 border border-richblack-800"
            >
              <div className="flex-shrink-0">
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-richblack-5">
                  {course.courseName}
                </h3>
                <p className="text-sm text-richblack-300">
                  {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                    ? course.courseDescription
                        .split(" ")
                        .slice(0, TRUNCATE_LENGTH)
                        .join(" ") + "..."
                    : course.courseDescription}
                </p>
                <p className="text-xs text-richblack-500">
                  Created: {formatDate(course.createdAt)}
                </p>

                <div className="mt-2 flex items-center">
                  {course.status === COURSE_STATUS.DRAFT ? (
                    <p className="flex items-center text-sm text-pink-100 bg-richblack-700 py-1 px-2 rounded-full">
                      <HiClock size={14} className="mr-2" />
                      Drafted
                    </p>
                  ) : (
                    <p className="flex items-center text-sm text-yellow-100 bg-richblack-700 py-1 px-2 rounded-full">
                      <FaCheck size={12} className="mr-2" />
                      Published
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button
                  disabled={loading}
                  onClick={() => {
                    navigate(`/dashboard/edit-course/${course._id}`);
                  }}
                  className="text-caribbeangreen-300 hover:text-caribbeangreen-400 transition-all"
                  title="Edit"
                >
                  <FiEdit2 size={24} />
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Do you want to delete this course?",
                      text2:
                        "All the data related to this course will be deleted",
                      btn1Text: !loading ? "Delete" : "Loading...  ",
                      btn2Text: "Cancel",
                      btn1Handler: !loading
                        ? () => handleCourseDelete(course._id)
                        : () => {},
                      btn2Handler: !loading
                        ? () => setConfirmationModal(null)
                        : () => {},
                    });
                  }}
                  className="text-red-600 hover:text-red-700 transition-all"
                  title="Delete"
                >
                  <RiDeleteBin6Line size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

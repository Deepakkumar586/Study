import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BuyCourse } from "../services/operations/studentFeaturesAPI.js";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import RatingStars from "../components/Common/RatingStars";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import Footer from "../components/Common/Footer.jsx";
import GetAvgRating from "../utils/avgRating.js";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        if (result.success) {
          setCourseData(result);
          const count = GetAvgRating(result.data.courseDetails.ratingAndReviews);
          setAvgReviewCount(count);
          let lectures = 0;
          result.data.courseDetails.courseContent.forEach(
            (sec) => (lectures += sec.subSection.length || 0)
          );
          setTotalNoOfLectures(lectures);
        } else {
          toast.error("Could not get course details");
        }
      } catch (error) {
        toast.error("Failed to fetch course details");
      }
    };

    getCourseFullDetails();
  }, [courseId]);

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch);
    } else {
      setConfirmationModal({
        text1: "You are not logged in",
        text2: "Please login to purchase the course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const isEnrolled = courseData?.data?.courseDetails?.studentsEnrolled?.includes(user?._id);

  if (!courseData) return <div className="text-center">Loading...</div>;

  const {
    courseName,
    description,
    thumbnail,
    price,
    whatWillYouLearn,
    instructor,
    createdAt,
  } = courseData.data.courseDetails;

  return (
    <>
      <div className="relative w-full bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src={thumbnail}
                alt={courseName}
                className="rounded-md mb-4 w-full h-auto"
              />
              <h1 className="text-3xl font-bold mb-4">{courseName}</h1>
              <p className="text-gray-300 mb-6">{description}</p>

              <div className="flex items-center gap-4 mb-4">
                <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                <span className="text-yellow-500">{avgReviewCount.toFixed(1)}</span>
                <span className="text-gray-400">({courseData.data.courseDetails.ratingAndReviews.length} Reviews)</span>
              </div>

              <p className="text-sm text-gray-400 mb-2">Created by {instructor.firstName}</p>
              <p className="text-sm text-gray-400">Published on {formatDate(createdAt)}</p>
            </div>

            <CourseDetailsCard
              course={courseData.data.courseDetails}
              handleBuyCourse={handleBuyCourse}
              isEnrolled={isEnrolled}
              setConfirmationModal={setConfirmationModal}
            />
          </div>
        </div>
      </div>

  

      {/* <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]'> */}
        {/* <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]'> */}
          {/* <div className='my-8 border border-richblack-600 p-8'> */}
            {/* <p className='text-3xl font-semibold'>What You Will Learn</p> */}
            {/* <div className='mt-5'> */}
              {/* {whatWillYouLearn} */}
            {/* </div> */}
          {/* </div> */}

          {/* <div className='max-w-[830px]'> */}

            {/* <div className='flex flex-col gap-3'> */}
              {/* <p className='text-[28px] font-semibold'>Course Content:</p> */}

              {/* <div className='flex flex-wrap justify-between gap-2'> */}
                {/* <div className='flex gap-2'> */}
                  {/* <span>{courseContent.length} section(s)</span>
                  <span>{totalNoOfLectures} lectures</span>
                  <span>{courseData.data?.totalDuration} total length</span> */}
                {/* </div> */}
                {/* <div> */}
                  {/* <button
                    className='text-yellow-25'
                    onClick={() => setIsActive([])}>
                    Collapse all Sections
                  </button> */}
                {/* </div> */}
              {/* </div> */}

            {/* </div> */}

            {/* <div className='py-4'> */}
              {/* {courseContent.map((section) => ( */}
                {/* <div key={section._id} className='overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0'> */}
                  {/* Section */}
                  {/* <div onClick={() => handleActive(section._id)}>
                    <div className='flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]'>
                      <div className='flex items-center gap-2'>
                        {isActive.includes(section._id) ? (
                          <i className='-rotate-90'><MdOutlineArrowForwardIos /></i>
                        ) : (
                          <i className='rotate-90'><MdOutlineArrowForwardIos /></i>
                        )}
                        <span className='font-semibold'>{section?.sectionName}</span>
                      </div>
                      <p className='text-xs'>{section?.subSection?.length} lectures</p>
                    </div>
                  </div> */}

                  {/* <div className={isActive.includes(section._id) ? "block text-richblack-200" : "hidden"}>
                    <div className='px-7'>
                      {section?.subSection?.map((subSection, index) => (
                        <div key={index} className='flex cursor-pointer items-center justify-between gap-2 py-3 text-sm'>
                          <div className='flex items-center gap-2'>
                            <i><BiVideo /></i>
                            <span>{subSection?.title}</span>
                          </div>
                          <p className='text-xs'>{subSection?.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div> */}
                {/* </div> */}
              {/* ))} */}
            {/* </div> */}
          {/* </div> */}
        {/* </div> */}
      {/* </div> */}


      {confirmationModal && (
        <ConfirmationModal
          text1={confirmationModal.text1}
          text2={confirmationModal.text2}
          btn1Text={confirmationModal.btn1Text}
          btn2Text={confirmationModal.btn2Text}
          btn1Handler={confirmationModal.btn1Handler}
          btn2Handler={confirmationModal.btn2Handler}
        />
      )}

      <Footer />
    </>
  );
};

export default CourseDetails;
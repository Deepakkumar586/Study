import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../Common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-8 sm:mb-14 text-2xl sm:text-4xl font-medium text-richblack-5">
        My Profile
      </h1>
      <div className="flex flex-col sm:flex-row sm:justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 mb-6 sm:mb-10">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] sm:w-[100px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg sm:text-xl font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm sm:text-base text-richblack-300">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 lg:flex justify-end  w-8 h-10">
          {" "}
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            className=""
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      {/* About Section */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:p-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg sm:text-xl font-semibold text-richblack-5">
            About
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm sm:text-base font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Personal Details Section */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:p-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg sm:text-xl font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* Personal info layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:max-w-[600px] gap-y-6 sm:gap-y-0">
          <div className="flex flex-col gap-y-6 sm:w-[45%]">
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                First Name
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                Email
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                Gender
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-6 sm:w-[45%]">
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                Last Name
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                Phone Number
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm sm:text-base text-richblack-600">
                Date Of Birth
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

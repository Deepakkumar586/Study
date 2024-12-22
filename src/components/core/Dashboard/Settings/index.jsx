import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  return (
    <>
      <h1 className="mb-8 sm:mb-14 text-2xl sm:text-3xl lg:text-4xl font-medium text-richblack-5">
        Edit Profile
      </h1>
      <div className="space-y-6 sm:space-y-10">
        {/* Change Profile Picture */}
        <div className="w-full p-4 sm:p-6 rounded-md border border-richblack-700 bg-richblack-800">
          <ChangeProfilePicture />
        </div>

        {/* Edit Profile */}
        <div className="w-full p-4 sm:p-6 rounded-md border border-richblack-700 bg-richblack-800">
          <EditProfile />
        </div>

        {/* Update Password */}
        <div className="w-full p-4 sm:p-6 rounded-md border border-richblack-700 bg-richblack-800">
          <UpdatePassword />
        </div>

        {/* Delete Account */}
        <div className="w-full p-4 sm:p-6 rounded-md border border-richblack-700 bg-richblack-800">
          <DeleteAccount />
        </div>
      </div>
    </>
  );
}

import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="w-full max-w-[400px] rounded-lg bg-richblack-900 p-6 shadow-xl transform transition-all ease-in-out duration-300">
        <p className="text-2xl font-semibold text-richblack-5">{modalData?.text1}</p>
        <p className="mt-3 mb-6 text-richblack-200">{modalData?.text2}</p>

        <div className="flex justify-center gap-x-6 mt-4">
          {/* First Button */}
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition-all duration-200"
          />
          {/* Second Button */}
          <button
            className="cursor-pointer rounded-md bg-red-600 hover:bg-red-700 text-white py-2 px-5 font-semibold transition-all duration-200"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}

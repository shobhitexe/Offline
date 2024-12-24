import { ChangeName, DashboardHeading, ResetPassword } from "@/components";

export default async function AccountSettings() {
  return (
    <div className="sm:w-[70%] w-[90%] mx-auto mb-10">
      <DashboardHeading heading={"My Profile"} />

      <div className="bg-cardBG sm:p-10 p-5 sm:rounded-3xl rounded-xl sm:mt-10 mt-5">
        <div className="text-xl text-main font-medium">Profile</div>
        <Break />

        <ChangeName />
        <div className="mt-5" />
        <Break />

        <div className="text-xl mt-3 text-main font-medium">Reset Password</div>
        <ResetPassword />

        <div className="mt-5" />
        <Break />
      </div>

      <div className="pb-10" />
    </div>
  );
}

function Break() {
  return (
    <div className="w-full h-px overflow-auto mt-2 border border-t border-main border-dotted" />
  );
}

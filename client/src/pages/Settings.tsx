import {
  AccountSettingsCards,
  ChangePasswordCard,
  DeleteAccountCard,
} from "@daveyplate/better-auth-ui";

const Settings = () => {
  return (
    <div
      className="
        w-full flex justify-center items-center min-h-[90vh]
        flex-col gap-6 py-12 px-4
        bg-gradient-to-b from-[#004d1a] to-[#0073b3]
      "
    >
      <AccountSettingsCards
        classNames={{
          card: {
            base: "bg-black/20 backdrop-blur-md ring ring-[#00331a] max-w-xl mx-auto text-white",
            footer: "bg-black/20 ring ring-[#00331a]",
          },
        }}
      />

      <div className="w-full">
        <ChangePasswordCard
          classNames={{
            base: "bg-black/20 backdrop-blur-md ring ring-[#00331a] max-w-xl mx-auto text-white",
            footer: "bg-black/20 ring ring-[#00331a]",
          }}
        />
      </div>

      <div className="w-full">
        <DeleteAccountCard
          classNames={{
            base: "bg-black/20 backdrop-blur-md ring ring-[#00331a] max-w-xl mx-auto text-white",
          }}
        />
      </div>
    </div>
  );
};

export default Settings;

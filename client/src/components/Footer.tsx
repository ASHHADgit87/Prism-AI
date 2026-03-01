

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const yearText = currentYear === 2025 ? "2025" : `2025-${currentYear}`;

  return (
    <div className=" bg-[#0073b3] text-center py-6 text-white text-md font-semibold border  mt-auto">
      <p>
        Copyright © {yearText} Prism AI - Muhammad Ashhadullah Zaheer. All
        rights reserved
      </p>
    </div>
  );
};

export default Footer;

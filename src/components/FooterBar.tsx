import React from "react";

export default function FooterBar() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="fixed w-screen bottom-0 z-1100 p-4 flex items-center justify-between bg-secondary shadow-md">
      <div className="text-sm">Created by <b>Teguh Kurniawan</b> &copy; {currentYear}</div>
    </div>
  );
}

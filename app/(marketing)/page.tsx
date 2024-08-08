import { Button } from "@/components/ui/button";
import Image from "next/image";
import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";
import Footer from "./_components/Footer";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div
        className="flex flex-col items-center justify-center
      md:justify-start text-center gap-y-8 flex-1"
      >
        <Heading />
        <Heroes />
      </div>

      <Footer />
    </div>
  );
};
export default MarketingPage;

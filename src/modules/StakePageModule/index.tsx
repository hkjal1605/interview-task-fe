import { Page, PageHeading } from "../../components/ui/page";
import { StakeCard } from "./components/StakeCard";

export function StakePageModule() {
  return (
    <Page>
      <div className="mx-auto w-full max-w-[440px]">
        <div className="text-center">
          <PageHeading title="Stake SUI" description="Stake SUI with Aftermath and receive afSUI in your wallet." />
        </div>
        <StakeCard />
      </div>
    </Page>
  );
}

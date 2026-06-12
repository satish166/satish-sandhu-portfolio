
import "./main.scss";
import MainBanner from "../pages/main-banner/banner";
import About from "../pages/about/about";
import Skills from "../pages/skills/skills";
import Work from "../pages/work/work";
import Contact from "../pages/contact/contact";
import PersonalProject from "../pages/personal-project/personal-project";

interface MainContentProps {
  data: any;
}

export default function MainContent({ data }: MainContentProps) {
  return (
    <>
      <div className="main-content">
        <MainBanner profile={data?.profile} socials={data?.socials} />
        <About profile={data?.profile} />
        <Skills skills={data?.skills} />
        <Work projects={data?.liveProjects} />
        <PersonalProject projects={data?.personalProjects} />
        <Contact profile={data?.profile} socials={data?.socials} />
      </div>
    </>
  );
}
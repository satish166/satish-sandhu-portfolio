export default function DownloadResumeButton() {
  return (
    <a href="/satish-resume.pdf" download="Satish-Kumar-Resume.pdf" className="button button-primary d-inline-flex align-items-center justify-content-center" style={{ textDecoration: 'none' }}>
      Download Resume (PDF)
    </a>
  );
}
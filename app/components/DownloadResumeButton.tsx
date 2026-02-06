'use client';

export default function DownloadResumeButton() {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/satish-resume.pdf';                  // put PDF in /public
    a.download = 'Satish-Kumar-Resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <button onClick={handleDownload} className="button button-primary">
      Download Resume (PDF)
    </button>
  );
}
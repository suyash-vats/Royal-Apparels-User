import { BRAND_NAME } from "../utils";

export default function IntroLoader() {
  const introWords = ["White", "Navy", "Grace"];

  return (
    <div className="intro-loader" aria-hidden="true">
      <div className="intro-loader__frame" />
      <div className="intro-loader__glow" />
      <div className="intro-loader__stage">
        <div className="intro-loader__wordmark intro-loader__wordmark--brand">
          <div className="intro-loader__line">
            <span className="intro-loader__brand">{BRAND_NAME}</span>
          </div>
        </div>
        <div className="intro-loader__wordmark intro-loader__wordmark--accent">
          {introWords.map((word, index) => (
            <div key={word} className="intro-loader__line">
              <span className={`intro-loader__accent intro-loader__accent--${index + 1}`}>
                {word}
              </span>
            </div>
          ))}
        </div>
        <div className="intro-loader__progress" aria-hidden="true">
          <span className="intro-loader__progress-bar" />
        </div>
      </div>
    </div>
  );
}

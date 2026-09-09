import { useState, useMemo } from "react";
import { PLATFORM_LIMITS } from "./platformConfig";
import CharacterCounter from "./CharacterCounter";

function PostComposer() {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState(["Twitter"]);
  const [media, setMedia] = useState(null);

  const togglePlatform = (p) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const errors = useMemo(() => {
    return platforms.map((p) => {
      const limit = PLATFORM_LIMITS[p];
      const issues = [];
      if (content.length > limit.maxChars) {
        issues.push(`${p}: exceeds ${limit.maxChars} characters`);
      }
      if (limit.mediaRequired && !media) {
        issues.push(`${p}: media attachment required`);
      }
      const tags = (content.match(/#\w+/g) || []).length;
      if (tags > limit.maxHashtags) {
        issues.push(`${p}: exceeds ${limit.maxHashtags} hashtags`);
      }
      return { platform: p, issues };
    });
  }, [content, platforms, media]);

  const maxChars = platforms.length
    ? Math.min(...platforms.map((p) => PLATFORM_LIMITS[p].maxChars))
    : 280;

  const hasErrors = errors.some((e) => e.issues.length > 0);

  return (
    <div className="composer">
      <h2>Post Composer</h2>
      <p>Select Platform:</p>
      {Object.keys(PLATFORM_LIMITS).map((p) => (
        <label key={p}>
          <input
            type="checkbox"
            checked={platforms.includes(p)}
            onChange={() => togglePlatform(p)}
          />
          {p}
        </label>
      ))}
      <p>Write Your Post:</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="Write your post..."
      />
      <p>
        Characters: <CharacterCounter current={content.length} max={maxChars} />
      </p>
      <input type="file" onChange={(e) => setMedia(e.target.files[0] || null)} />
      {errors.map((e) =>
        e.issues.map((msg, i) => (
          <p key={`${e.platform}-${i}`} className="error">
            {msg}
          </p>
        ))
      )}
      <p className={hasErrors ? "not-ready" : "ready"}>
        {hasErrors ? "Fix issues before posting" : "Ready to post"}
      </p>
      <button disabled={hasErrors}>Save Draft</button>
    </div>
  );
}

export default PostComposer;

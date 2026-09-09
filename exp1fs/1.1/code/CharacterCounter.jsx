function CharacterCounter({ current, max }) {
  const remaining = max - current;
  const isWarning = remaining < max * 0.1;
  const isError = remaining < 0;

  return (
    <span className={isError ? "count-error" : isWarning ? "count-warning" : "count-ok"}>
      {current} / {max}
    </span>
  );
}

export default CharacterCounter;

// // Idea from: https://css-tricks.com/snippets/css/typewriter-effect/
import classnames from "classnames";
import { useEffect, useState } from "react";
import styles from "../styles/Typewriter.module.scss";

export enum TextCycle {
  LOOP = "loop",
  ADDITION = "addition",
}

interface TypewriterProps {
  phrases: string[] | string[][];
  variation: TextCycle;
  loop?: string[] /** Only include if variation is ADDITION */;
}

const Typewriter = ({ phrases, variation, loop }: TypewriterProps) => {
  /** The index of the current phrase in the list of phrases */
  const [currentPhrase, setCurrentPhrase] = useState(0);
  /** The index of the current character in the current phrase */
  const [currentChar, setCurrentChar] = useState(0);
  /** Whether the typewriter is deleting */
  const [isDeleting, setIsDeleting] = useState(false);

  const endOfPhraseDelay = 500;
  const typeSpeed = 200 - Math.random() * 100;

  let joinedPhrases;
  if (variation === TextCycle.ADDITION) {
    joinedPhrases = phrases.join("<br>");
  }

  /** Helper function to change state to deleting with delay */
  const beginDeleting = () => {
    setTimeout(() => {
      setIsDeleting(true);
    }, endOfPhraseDelay);
  };

  const incrementPhrase = () => {
    setIsDeleting(false);
    if (currentPhrase < phrases.length - 1) {
      setCurrentPhrase(currentPhrase + 1);
    } else {
      setCurrentPhrase(0);
    }
  };

  enum CycleType {
    WHOLE = "whole",
    ENDING = "ending",
  }

  const cyclePhrases = (type: CycleType) => {
    switch (isDeleting) {
      case true:
          currentChar > 0 ? setCurrentChar(currentChar - 1) : incrementPhrase();
        break;
      case false:
        if (type === CycleType.WHOLE) {
          currentChar < phrases[currentPhrase].length
            ? setCurrentChar(currentChar + 1)
            : beginDeleting();
        } else {
          currentChar < loop[currentPhrase].length + joinedPhrases.length
            ? setCurrentChar(currentChar + 1)
            : beginDeleting();
        }
        break;
    }
  };

  const buildPhrases = () => {
    if (
      currentChar < joinedPhrases.length &&
      joinedPhrases[currentChar] !== "<"
    ) {
      setCurrentChar(currentChar + 1);
    } else if (currentChar === joinedPhrases.length) {
      cyclePhrases(CycleType.ENDING);
    } else {
      setTimeout(() => {
        setCurrentChar(currentChar + 2);
      }, endOfPhraseDelay);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      switch (variation) {
        case TextCycle.ADDITION:
          buildPhrases();
          break;
        case TextCycle.LOOP:
          cyclePhrases(CycleType.WHOLE);
          break;
      }
    }, typeSpeed);
  });

  const typeWrittenText =
    variation === TextCycle.ADDITION
      ? joinedPhrases.replace(/`/g, "").substring(0, currentChar) + (loop[currentPhrase] as string).substring(0, currentChar)
      : (phrases[currentPhrase] as string).substring(0, currentChar);

  return (
    <div>
      <span
        dangerouslySetInnerHTML={{
          __html: typeWrittenText,
        }}
      />
      <span className={styles.cursor}>{"▎"}</span>
    </div>
  );
};

export default Typewriter;

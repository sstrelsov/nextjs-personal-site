// // Idea from: https://css-tricks.com/snippets/css/typewriter-effect/
import { useEffect, useState } from "react";
import styles from "../styles/Typewriter.module.scss";

export enum TextCycle {
  LOOP = "loop",
  ADDITION = "addition",
}

interface TypewriterProps {
  phrases: string[];
  variation: TextCycle;
}

const Typewriter = ({ phrases, variation }: TypewriterProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newLine, setNewLine] = useState(false);

  const endOfPhraseDelay = 2000;
  const newLineDelay = 1000;
  const typeSpeed = 200 - Math.random() * 100;

  const beginDeleting = () => {
    setTimeout(() => {
      setIsDeleting(true);
    }, endOfPhraseDelay);
  };

  const addNewLine = () => {
    setTimeout(() => {
      setNewLine(true);
      setCurrentPhrase(currentPhrase + 1);
      setCurrentChar(0);
    }, newLineDelay);
  };

  useEffect(() => {
    setTimeout(() => {
      switch (isDeleting) {
        case true:
          if (currentChar > 0) {
            setCurrentChar(currentChar - 1);
          } else {
            setIsDeleting(false);
            if (currentPhrase < phrases.length - 1) {
              setCurrentPhrase(currentPhrase + 1);
            } else {
              setCurrentPhrase(0);
            }
          }
          break;
        case false:
          if (currentChar < phrases[currentPhrase].length) {
            setCurrentChar(currentChar + 1);
          } else {
            variation === TextCycle.LOOP ? beginDeleting() : addNewLine();
          }
          break;
      }
    }, typeSpeed);
  });

  return (
    <div className={styles.container}>
      <span>
        {newLine ? <br /> : ""}
        {phrases[currentPhrase].substring(0, currentChar)}
        <span className={styles.cursor}>{"▎"}</span>
      </span>
    </div>
  );
};

export default Typewriter;

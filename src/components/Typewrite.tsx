// // Idea from: https://css-tricks.com/snippets/css/typewriter-effect/
import { useEffect, useState } from 'react';
import styles from '../styles/Typewriter.module.scss';

interface TypewriterProps {
  addedPhrases: string[] | string[][];
  loopedPhrases: string[];
  loopNewLine: boolean;
}

const Typewriter = ({ addedPhrases, loopedPhrases, loopNewLine }: TypewriterProps) => {
  /** The index of the current phrase in the list of phrases */
  const [currentAddTypePhrase, setCurrentAddTypePhrase] = useState(0);
  /** The index of the current character in the current phrase */
  const [currentAddTypeChar, setCurrentAddTypeChar] = useState(0);
  /** Whether the typewriter is deleting */
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopFlag, setLoopFlag] = useState(false);
  const [currentLoopTypePhrase, setCurrentLoopTypePhrase] = useState(0);
  const [currentLoopTypeChar, setCurrentLoopTypeChar] = useState(0);

  const endOfPhraseDelay = 1500;
  const typeSpeed = 150 - Math.random() * 100;

  let addTypeCombinedPhrases = (loopNewLine ? addedPhrases.join('<br>') + '<br>' : addedPhrases.join('<br>')) + '|';

  /** Helper function to change state to deleting with delay */
  const beginDeleting = () => {
    setTimeout(() => {
      setIsDeleting(true);
    }, endOfPhraseDelay);
  };

  const incrementPhrase = () => {
    setIsDeleting(false);
    if (currentLoopTypePhrase < loopedPhrases.length - 1) {
      setCurrentLoopTypePhrase(currentLoopTypePhrase + 1);
    } else {
      setCurrentLoopTypePhrase(0);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        (currentAddTypeChar < addTypeCombinedPhrases.length && addTypeCombinedPhrases[currentAddTypeChar] !== '<') ||
        loopFlag
      ) {
        if (loopFlag) {
          switch (isDeleting) {
            case true:
              currentLoopTypeChar > 0 ? setCurrentLoopTypeChar(currentLoopTypeChar - 1) : incrementPhrase();
              break;
            case false:
              currentLoopTypeChar < loopedPhrases[currentLoopTypePhrase].length
                ? setCurrentLoopTypeChar(currentLoopTypeChar + 1)
                : beginDeleting();
              break;
          }
        } else {
          if (addTypeCombinedPhrases[currentAddTypeChar] === '|') {
            setLoopFlag(true);
          }
          setCurrentAddTypeChar(currentAddTypeChar + 1);
        }
      } else {
        setTimeout(() => {
          setCurrentAddTypeChar(currentAddTypeChar + 2);
        }, endOfPhraseDelay);
      }
    }, typeSpeed);
  });

  const typeWrittenAddTypeText = addTypeCombinedPhrases.replace(/\|/g, '').substring(0, currentAddTypeChar);

  const typeWrittenLoopTypeText = loopedPhrases[currentLoopTypePhrase].substring(0, currentLoopTypeChar);

  return (
    <div>
      <span
        dangerouslySetInnerHTML={{
          __html: typeWrittenAddTypeText + typeWrittenLoopTypeText
        }}
      />
      <span className={styles.cursor}>{'▎'}</span>
    </div>
  );
};

export default Typewriter;

import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Progress, Button } from "@nextui-org/react";
import { Play } from "react-iconly";
import { HiPause } from "react-icons/hi";
import styles from "./player.module.css";
import { useAtom } from "jotai";
import { trackPlayingAtom } from "state/player";

/**
 * Primary UI component for user interaction
 */
export const Player = ({ previewTrackUrl, id, ...props }) => {
  const [isPlay, setIsPlay] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [trackPlaying, setTrackPlaying] = useAtom(trackPlayingAtom);

  const audio = React.useRef();

  function audioEnded() {
    setIsPlay(false);
  }

  function changeTimelinePosition() {
    try {
      const percentagePosition =
        (100 * audio.current.currentTime) / audio.current.duration;
      setTime(percentagePosition);
    } catch (error) {}
  }

  React.useEffect(() => {
    if (audio.current) {
      audio.current.ontimeupdate = changeTimelinePosition;
      audio.current.onended = audioEnded;
    }

    () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      audio = React.useRef();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      timeline = React.useRef();
    };

    // timeline.current.addEventListener("change", changeSeek);
  }, []);

  React.useEffect(() => {
    if (audio.current) {
      if (trackPlaying === id) {
        audio.current.play();
      } else {
        audio.current.pause();
        setIsPlay(false);
      }
    }
  }, [trackPlaying]);

  return (
    <Container css={{ pl: 0 }}>
      <audio
        style={{ display: "none" }}
        ref={audio}
        src={previewTrackUrl}
      ></audio>
      <Row justify="start" align="center">
        {!isPlay ? (
          <Play
            className={styles.hoverCursor}
            size={54}
            set="bold"
            primaryColor="#1cb050"
            onClick={() => {
              setTrackPlaying(id);
              audio.current.play();
              setIsPlay(true);
            }}
          />
        ) : (
          <HiPause
            className={styles.hoverCursor}
            fill="#1cb050"
            size={54}
            onClick={() => {
              audio.current.pause();
              setIsPlay(false);
            }}
          />
        )}
        <Progress
          animated={false}
          value={time}
          color="success"
          status="success"
        />
      </Row>
    </Container>
  );
};

Player.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  src: PropTypes.string,
};

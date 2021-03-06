import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { IGetTvSerieseResult, ITvSeriese } from "../api";
import { makeImagePath } from "../utils";

const Slider = styled.div`
  position: relative;
  padding-top: 18%;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  top: 0;
  width: 100%;
  grid-template-columns: repeat(7, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 250px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.1,
      duaration: 0.2,
      type: "tween",
    },
  },
};

const padding = 30;

const rowVariants = {
  hidden: (isBack: boolean) => {
    return {
      x: !isBack ? window.innerWidth - padding : -window.innerWidth + padding,
      transition: {
        duration: 0.1,
      },
    };
  },
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => {
    return {
      x: !isBack ? -window.innerWidth + padding : window.innerWidth - padding,
      transition: {
        duration: 0.1,
      },
    };
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.2,
    y: -60,
    transition: {
      type: "tween",
      delay: 0.1,
      duration: 0.2,
    },
  },
};

interface ISliderProps {
  data: IGetTvSerieseResult;
  setClickedTvSeriese: Dispatch<SetStateAction<ITvSeriese>>;
}

function SlideComponent({ data, setClickedTvSeriese }: ISliderProps) {
  const offset = 7;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const history = useHistory();

  const increaseSlide = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvSeries = data.results.length - 1;
      const maxIndex = Math.floor(totalTvSeries / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseSlide = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvSeries = data.results.length - 1;
      const maxIndex = Math.floor(totalTvSeries / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (tvSeries: ITvSeriese) => {
    setClickedTvSeriese({
      id: tvSeries.id,
      backdrop_path: tvSeries.backdrop_path,
      poster_path: tvSeries.poster_path,
      name: tvSeries.name,
      overview: tvSeries.overview,
      original_name: "",
    });
    history.push(`${process.env.PUBLIC_URL}/tv/${tvSeries.id}`);
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    if (info.velocity.x < -100) {
      setIsBack(false);
      increaseSlide();
    }
    if (info.velocity.x > 100) {
      setIsBack(true);
      decreaseSlide();
    }
  };

  return (
    <Slider>
      <AnimatePresence
        custom={isBack}
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <Row
          custom={isBack}
          variants={rowVariants}
          drag="x"
          dragSnapToOrigin
          onDragEnd={handleDragEnd}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((tvSeries) => (
              <Box
                layoutId={tvSeries.id + ""}
                key={tvSeries.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                transition={{ type: "tween" }}
                onTap={() => onBoxClicked(tvSeries)}
                bgPhoto={makeImagePath(
                  tvSeries.backdrop_path ?? tvSeries.poster_path,
                  "w500"
                )}
              >
                <Info variants={infoVariants}>
                  <h4>{tvSeries.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default SlideComponent;

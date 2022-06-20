import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SearchResult } from "../api";
import { makeImagePath } from "../utils";

const Slider = styled.div`
  position: relative;
  padding-top: 14%;
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
  height: 200px;
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
  data: SearchResult[] | undefined;
  keyword: string | null;
}

function SearchTvSeriesComponent({ data, keyword }: ISliderProps) {
  const offset = 7;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const history = useHistory();

  const increaseSlide = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvSeries = data.length - 1;
      const maxIndex = Math.floor(totalTvSeries / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseSlide = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvSeries = data.length - 1;
      const maxIndex = Math.floor(totalTvSeries / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  const onTvSeriesClicked = (tvSeriesId: number) => {
    history.push(`${process.env.PUBLIC_URL}/search/tv/${tvSeriesId}?keyword=${keyword}`);
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
          {data &&
            data
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
                  onTap={() => onTvSeriesClicked(tvSeries.id)}
                  bgPhoto={makeImagePath(tvSeries.poster_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>{tvSeries.title}</h4>
                  </Info>
                </Box>
              ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default SearchTvSeriesComponent;

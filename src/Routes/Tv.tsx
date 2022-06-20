import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getLatestTvSeries,
  getPopularTvSeries,
  getTopRatedTvSeries,
  IGetTvSerieseResult,
  ITvSeriese,
} from "../api";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SlideComponent from "../Components/TvSlideComponent";

const Wrapper = styled.div`
  overflow-x: hidden;
  padding: 0 0 60px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-bottom: 4rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-position: top center;
  background-size: cover;
  background-position: top center;
  background-size: 130%;
`;

const Title = styled.h2`
  font-size: 42px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;

const BannerDetailButton = styled(motion.div)`
  cursor: pointer;
  display: inline-block;
  padding: 0.8em 1.2em;
  margin-top: 2em;
  background-color: white;
  border-radius: 8px;
  color: ${(props) => props.theme.black.lighter};
`;

const GroupSection = styled.main`
  margin-top: 0;
`;

const SlideGroup = styled.section`
  padding: 0 15px;
  margin-bottom: 3rem;
`;

const SlideTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1em;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 34px;
  position: relative;
  top: -80px;
`;

const SmallTitle = styled.h5`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  top: -80px;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  position: relative;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  font-size: 15px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -70,
    transition: {
      duaration: 0.1,
      type: "tween",
    },
  },
};

function Tv() {
  const { data: latest, isLoading: latestLoading } =
    useQuery<IGetTvSerieseResult>(["tvSeries", "lated"], () =>
      getLatestTvSeries()
    );

  const { data: popular, isLoading: popularLoading } =
    useQuery<IGetTvSerieseResult>(["tvSeries", "popular"], () =>
      getPopularTvSeries()
    );

  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetTvSerieseResult>(["tvSeries", "topRated"], () =>
      getTopRatedTvSeries()
    );

  const { scrollY } = useViewportScroll();
  const history = useHistory();
  const [clickedTvSeries, setClickedTvSeriese] = useState<ITvSeriese>({
    id: 0,
    backdrop_path: "",
    poster_path: "",
    name: "",
    overview: "",
    original_name: "",
  });
  const tvDetailMatch = useRouteMatch<{ tvSeriesId: string }>(
    `${process.env.PUBLIC_URL}/tv/:tvSeriesId`
  );

  const onBoxClicked = (tvSeries: any) => {
    setClickedTvSeriese({
      id: tvSeries.id,
      backdrop_path: tvSeries.backdrop_path,
      poster_path: tvSeries.poster_path,
      name: tvSeries.name,
      overview: tvSeries.overview,
      original_name: tvSeries.original_name,
    });
    history.push(`${process.env.PUBLIC_URL}/tv/${tvSeries.id}`);
  };

  const onOverlayClick = () => {
    setClickedTvSeriese({
      id: 0,
      backdrop_path: "",
      poster_path: "",
      name: "",
      overview: "",
      original_name: "",
    });
    history.push(`${process.env.PUBLIC_URL}/tv`);
  };

  useEffect(() => {
    console.log("data: ", latest);
  }, [latest]);

  return (
    <Wrapper>
      {latestLoading && popularLoading && topRatedLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 상단 배너 */}
          <Banner
            bgPhoto={makeImagePath(latest?.results[0].backdrop_path || "")}
          >
            <Title>{latest?.results[0].name}</Title>
            <Overview>{latest?.results[0].overview}</Overview>
            <div>
              <BannerDetailButton
                variants={boxVariants}
                initial="normal"
                transition={{ type: "tween" }}
                onTap={() => onBoxClicked(latest?.results[0])}
                layoutId={latest?.results[0].id + ""}
              >
                자세히 보기
              </BannerDetailButton>
            </div>
          </Banner>
          {/* 미디어 슬라이드 */}
          <GroupSection>
            <SlideGroup>
              <SlideTitle>현재 방영 중</SlideTitle>
              <SlideComponent
                data={latest!}
                setClickedTvSeriese={setClickedTvSeriese}
              />
            </SlideGroup>
            <SlideGroup>
              <SlideTitle>인기가 많은</SlideTitle>
              <SlideComponent
                data={popular!}
                setClickedTvSeriese={setClickedTvSeriese}
              />
            </SlideGroup>
            <SlideGroup>
              <SlideTitle>가장 평점이 높은</SlideTitle>
              <SlideComponent
                data={topRated!}
                setClickedTvSeriese={setClickedTvSeriese}
              />
            </SlideGroup>
          </GroupSection>
          {/* 미디어 디테일 */}
          <AnimatePresence>
            {tvDetailMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={tvDetailMatch.params.tvSeriesId}
                >
                  {clickedTvSeries && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTvSeries.poster_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTvSeries.name}</BigTitle>
                      <SmallTitle>{clickedTvSeries.original_name}</SmallTitle>
                      <BigOverview>{clickedTvSeries.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;

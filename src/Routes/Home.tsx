import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getLatestMovies,
  getTopMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SlideComponent from "../Components/SlideComponent";

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

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    () => getLatestMovies()
  );

  const { data: topRatedMovie, isLoading: isTopRatedLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], () => getTopMovies());

  const { data: upcomingMovie, isLoading: isUpcomingMovie } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], () =>
      getUpcomingMovies()
    );

  const movieDetailMatch = useRouteMatch<{ movieId: string }>(
    `${process.env.PUBLIC_URL}/movies/:movieId`
  );

  const { scrollY } = useViewportScroll();
  const history = useHistory();
  const [clickedMovie, setClickedMovie] = useState<IMovie>({
    id: 0,
    backdrop_path: "",
    poster_path: "",
    title: "",
    overview: "",
    original_title: "",
  });

  const onBoxClicked = (movie: any) => {
    setClickedMovie({
      id: movie.id,
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      title: movie.title,
      overview: movie.overview,
      original_title: movie.original_title,
    });

    history.push(`${process.env.PUBLIC_URL}/movies/${movie.id}`);
  };

  const onOverlayClick = () => {
    setClickedMovie({
      id: 0,
      backdrop_path: "",
      poster_path: "",
      title: "",
      overview: "",
      original_title: "",
    });
    history.push(`${process.env.PUBLIC_URL}`);
  };

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  return (
    <Wrapper>
      {isLoading && isTopRatedLoading && isUpcomingMovie ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* ?????? ?????? */}
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <div>
              <BannerDetailButton
                variants={boxVariants}
                initial="normal"
                transition={{ type: "tween" }}
                onTap={() => onBoxClicked(data?.results[0])}
                layoutId={data?.results[0].id + ""}
              >
                ????????? ??????
              </BannerDetailButton>
            </div>
          </Banner>
          {/* ????????? ???????????? */}
          <GroupSection>
            <SlideGroup>
              <SlideTitle>?????? ?????? ???</SlideTitle>
              <SlideComponent data={data!} setClickedMovie={setClickedMovie} />
            </SlideGroup>
            <SlideGroup>
              <SlideTitle>?????? ????????? ??????</SlideTitle>
              <SlideComponent
                data={topRatedMovie!}
                setClickedMovie={setClickedMovie}
              />
            </SlideGroup>
            <SlideGroup>
              <SlideTitle>?????? ??????</SlideTitle>
              <SlideComponent
                data={upcomingMovie!}
                setClickedMovie={setClickedMovie}
              />
            </SlideGroup>
          </GroupSection>
          {/* ????????? ????????? */}
          <AnimatePresence>
            {movieDetailMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={movieDetailMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <SmallTitle>{clickedMovie.original_title}</SmallTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
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
export default Home;

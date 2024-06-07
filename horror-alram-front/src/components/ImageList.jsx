import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

export default function UpcomingImageList({ movies, error, handleOpen, guideText }) {
    const isMobile = useMediaQuery('(min-width:756px)');
    const handleClickOpen = (movie) => {
        handleOpen(movie);
    }

    const Div = styled('div')({
        margin: 10,
        color: 'white',
        textAlign: 'center',
    });

    return (
        <ImageList className="image-list" sx={{
            width: '100%',
            height: '100%',
            display: 'flex', // flex 레이아웃으로 변경
            flexDirection: isMobile ? 'row' : 'column', // 방향 설정
            flexWrap: 'nowrap', // 한 줄로 배치
            overflowY: isMobile ? 'auto' : 'initial', // 세로 스크롤 설정
            gap: 10,
        }}>
            {error && <Div>서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.</Div>}
            {!error && movies.length === 0 && <Div>{guideText}</Div>}
            {!error && movies.length > 0 && movies.map((movie) => (
                <ImageListItem className='image-item' key={movie.id} onClick={() => handleClickOpen(movie)} sx={{ height: 150 }}>
                    <img src={`${process.env.REACT_APP_POSTER_API_URL}${movie.posterPath}`} alt={movie.title} />
                    <ImageListItemBar
                        title={movie.title}
                        subtitle={movie.releaseDate}
                        position="overlay"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
import { expect, test, vi } from 'vitest'
import { getUpcomingMovies } from '../functions/upcoming'
import { release } from 'os'

// 테스트 데이터 정의
const successResponse = {
    movies: [
        {
            id: 1,
            title: 'test',
            posterPath: 'test.jpg',
            overview: 'test overview',
            theaters: ['test1', 'test2'],
            releaseDate: '2021-10-10'
        }
    ],
    error: undefined
}

const errorResponse = {
    movies: undefined,
    error: {
        data: {
            message: 'error',
            status: 500
        }
    }
}
// 모킹할 함수 정의
vi.mock('../functions/upcoming')

test('getUpcomingMovies 성공', async () => {
    vi.mocked(getUpcomingMovies).mockResolvedValue(successResponse)
    const result = await getUpcomingMovies()
    expect(result).toEqual(successResponse)
})

test('getUpcomingMovies 실패', async () => {
    vi.mocked(getUpcomingMovies).mockResolvedValue(errorResponse)
    const result = await getUpcomingMovies()
    expect(result).toEqual(errorResponse)
})

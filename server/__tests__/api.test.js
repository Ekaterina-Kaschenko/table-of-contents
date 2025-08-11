const request = require('supertest');
const app = require('../app');

const SAMPLE = {
  entities: {
    pages: {
      A: { id: 'A', title: 'Root', pages: ['B', 'C', 'D'] },
      B: { id: 'B', title: 'React Basics', parentId: 'A', pages: [] },
      C: { id: 'C', title: 'Vue', parentId: 'A', pages: [] },
      D: { id: 'D', title: 'Café Tools', parentId: 'A', pages: [] },
    },
  },
  topLevelIds: ['A'],
};

let consoleErrorSpy;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => SAMPLE,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /api/mockedData', () => {
  test('returns full data when no searchParams is provided', async () => {
    const res = await request(app).get('/api/mockedData');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(SAMPLE);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('filters by searchParams (case-insensitive substring) and keeps ancestors', async () => {
    const res = await request(app).get('/api/mockedData').query({ searchParams: 'react' });
    expect(res.status).toBe(200);

    const { entities, topLevelIds } = res.body;
    expect(topLevelIds).toEqual(['A']); // A remains as ancestor

    // only A and B should be present; B child list empty, A pruned to only matched child
    expect(Object.keys(entities.pages).sort()).toEqual(['A', 'B']);
    expect(entities.pages.A.pages).toEqual(['B']);
    expect(entities.pages.B.title).toBe('React Basics');
  });

  test('diacritics are ignored (query "cafe" matches "Café Tools")', async () => {
    const res = await request(app).get('/api/mockedData').query({ searchParams: 'cafe' });
    expect(res.status).toBe(200);

    const { entities, topLevelIds } = res.body;
    expect(topLevelIds).toEqual(['A']);
    expect(Object.keys(entities.pages).sort()).toEqual(['A', 'D']);
    expect(entities.pages.A.pages).toEqual(['D']);
    expect(entities.pages.D.title).toBe('Café Tools');
  });

  test('returns empty tree when there are no matches', async () => {
    const res = await request(app).get('/api/mockedData').query({ searchParams: 'does-not-exist' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ entities: { pages: {} }, topLevelIds: [] });
  });

  test('propagates 500 when upstream fetch fails', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 503 });
    const res = await request(app).get('/api/mockedData').query({ searchParams: 'react' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch external data' });
  });
});

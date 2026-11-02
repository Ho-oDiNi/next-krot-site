import { act, renderHook, waitFor } from "@testing-library/react";
import type { ArticleWithRelations } from "@/entities/article/model";
import { useInfiniteArticles } from "./useInfiniteArticles";

const article = (id: number) => ({ id }) as ArticleWithRelations;
const initial = Array.from({ length: 10 }, (_, id) => article(id + 1));
const fetchMock = jest.fn();
const response = (articles: ArticleWithRelations[], hasMore = false) => ({
    ok: true,
    json: async () => ({ articles, hasMore }),
});

beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
});

test.each([
    ["HTTP error", () => Promise.resolve({ ok: false })],
    ["network error", () => Promise.reject(new Error("offline"))],
    [
        "invalid JSON",
        () =>
            Promise.resolve({
                ok: true,
                json: async () => {
                    throw new Error("invalid JSON");
                },
            }),
    ],
    [
        "invalid response",
        () =>
            Promise.resolve({
                ok: true,
                json: async () => ({ error: "failed" }),
            }),
    ],
])(
    "keeps the feed usable after %s and retries the same page",
    async (_, result) => {
        fetchMock
            .mockImplementationOnce(result)
            .mockResolvedValueOnce(response([article(11)]));
        const { result: hook } = renderHook(() => useInfiniteArticles(initial));
        await act(async () => {
            await hook.current.retry();
        });
        expect(hook.current.articles).toEqual(initial);
        expect(hook.current.error).toBeTruthy();
        expect(hook.current.isLoading).toBe(false);
        await act(async () => {
            await hook.current.retry();
        });
        expect(hook.current.articles.map((a) => a.id)).toEqual([
            ...initial.map((a) => a.id),
            11,
        ]);
        expect(hook.current.error).toBeNull();
        expect(hook.current.hasMore).toBe(false);
        expect(
            fetchMock.mock.calls.map(([url]) =>
                new URL(url, "http://localhost").searchParams.get("page"),
            ),
        ).toEqual(["2", "2"]);
    },
);

test("locks concurrent requests and removes overlapping article IDs", async () => {
    let resolve!: (value: unknown) => void;
    fetchMock.mockImplementationOnce(
        () =>
            new Promise((done) => {
                resolve = done;
            }),
    );
    const { result } = renderHook(() => useInfiniteArticles(initial));
    let pending!: Promise<void>;
    act(() => {
        pending = result.current.retry();
        void result.current.retry();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => {
        resolve(response([article(10), article(11), article(11)]));
        await pending;
    });
    expect(result.current.articles.map((a) => a.id)).toEqual([
        ...initial.map((a) => a.id),
        11,
    ]);
});

test("ignores a stale response after filters change even if fetch ignores abort", async () => {
    let resolve!: (value: unknown) => void;
    fetchMock.mockImplementationOnce(
        () =>
            new Promise((done) => {
                resolve = done;
            }),
    );
    const { result, rerender } = renderHook(
        ({ tagId }) => useInfiniteArticles(initial, { tagId }),
        { initialProps: { tagId: 1 } },
    );
    let pending!: Promise<void>;
    act(() => {
        pending = result.current.retry();
    });
    const signal = fetchMock.mock.calls[0][1].signal;
    rerender({ tagId: 2 });
    expect(signal.aborted).toBe(true);
    await act(async () => {
        resolve(response([article(99)]));
        await pending;
    });
    expect(result.current.articles).toEqual(initial);
    expect(result.current.error).toBeNull();
});

test("observer stops automatic retries after an error and disconnects on unmount", async () => {
    let intersect!: IntersectionObserverCallback;
    const disconnect = jest.fn();
    global.IntersectionObserver = jest.fn((cb) => {
        intersect = cb;
        return { observe: jest.fn(), disconnect };
    }) as unknown as typeof IntersectionObserver;
    fetchMock.mockResolvedValue({ ok: false });
    const { result, unmount } = renderHook(() => {
        const hook = useInfiniteArticles(initial);
        hook.loaderRef.current = document.createElement("div");
        return hook;
    });
    act(() => {
        intersect(
            [{ isIntersecting: true }] as IntersectionObserverEntry[],
            {} as IntersectionObserver,
        );
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalled();
    unmount();
});

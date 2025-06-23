import PostItem from '@/components/post-item';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Index() {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const posts = props.posts || [];
    const user = props.user || [];

    const [shuffledPosts, setShuffledPosts] = useState([]);

    const [filtredPosts, setFiltredPosts] = useState([]);

    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [searchVal, setSearchVal] = useState('');

    function onSubmit(e) {
        e.preventDefault();
    }

    useEffect(() => {
        setFiltredPosts(posts);
    }, []);

    function searchBarOnchange(e) {
        const searchVal = e.currentTarget.value.toLowerCase();

        console.log(searchVal);

        setSearchVal(searchVal);

        if (searchVal == '') {
            setFiltredPosts(posts);
        } else {
            const filterThePosts = posts.filter((item) => {
                if (item.title.toLowerCase().includes(searchVal) || item.title.toLowerCase() == searchVal) {
                    return item;
                }
            });

            setFiltredPosts(filterThePosts);
        }
    }

    useEffect(() => {
        setShuffledPosts(shuffleArray(filtredPosts));
    }, [filtredPosts]);

    function shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    const scrollToIndex = (index) => {
        const container = containerRef.current;
        const postElements = container?.children;

        if (postElements && postElements[index]) {
            postElements[index].scrollIntoView({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }
    };

    const scrollUp = () => {
        if (currentIndex == 0) {
            setCurrentIndex(containerRef.current.children.length - 1);
            scrollToIndex(containerRef.current.children.length - 1);
        } else {
            const newIndex = Math.max(currentIndex - 1, 0);
            setCurrentIndex(newIndex);
            scrollToIndex(newIndex);

            console.log(containerRef.current.children.length);
        }
    };

    const scrollDown = () => {
        if (currentIndex == containerRef.current.children.length - 1) {
            setCurrentIndex(0);
            scrollToIndex(0);

            console.log('SETTED');
        } else {
            const newIndex = Math.min(currentIndex + 1, shuffledPosts.length - 1);
            setCurrentIndex(newIndex);
            scrollToIndex(newIndex);

            console.log(newIndex);
        }
    };

    return (
        <AuthenticatedLayout header={''}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex-1">
                            <form onSubmit={onSubmit} className="h-[20] max-w-md p-6">
                                <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                        <svg
                                            className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="se[arch"
                                        id="default-search"
                                        className="light:border-gray-600 light:bg-gray-700 light:text-white light:placeholder-gray-400 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Search up items"
                                        onChange={searchBarOnchange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 text-gray-900">
                            <a href={'/posts/create'}>
                                <button
                                    className="rounded-lg bg-blue-500 p-4 text-xl font-bold text-white transition-all hover:bg-blue-600"
                                    type="submit"
                                >
                                    Create Post{' '}
                                </button>
                            </a>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mb-4 mt-4 rounded bg-green-500 p-4 font-bold text-green-700 text-white shadow">{successMessage}</div>
                    )}

                    <div></div>
                </div>

                {searchVal == '' ? (
                    <div className="relative mt-5 h-screen overflow-hidden">
                        {/* Scrollable Post Container */}
                        <div ref={containerRef} className="h-full w-full overflow-hidden scroll-smooth" style={{ scrollSnapType: 'y mandatory' }}>
                            {shuffledPosts.map((element) => (
                                <div key={element.id} className="scroll-snap-start flex h-screen items-center justify-center">
                                    <PostItem user={user} post={element} />
                                </div>
                            ))}
                        </div>

                        {/* Floating Scroll Buttons – bottom right */}
                        <div className="fixed bottom-10 right-6 z-10 flex flex-col items-center gap-3">
                            <button onClick={scrollUp} className="rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-100">
                                ↑
                            </button>
                            <button onClick={scrollDown} className="rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-100">
                                ↓
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {filtredPosts.map((element) => (
                                <PostItem key={element.id} user={user} post={element} />
                            ))}
                        </div>
                    </div>
                )}

                {/* <div className="flex justify-center">
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {filtredPosts.map((element) => (
                            <PostItem key={element.id} user={user} post={element} />
                        ))}
                    </div>
                </div>  */}
            </div>
        </AuthenticatedLayout>
    );
}

import { router } from '@inertiajs/react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput({ type = 'text', name, post, className = '', isFocused = false, user, ...props }, ref) {
    const localRef = useRef(null);
    const [isMyPosts, setIsMyPosts] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    console.log(post);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }

        if (post.user_id == user.id) {
            setIsMyPosts(true);
        }
    }, [isFocused]);

    const handleDelete = () => {
        router.delete(`/posts/delete/${post.id}`);
    };

    return (
        <div
            {...props}
            name={name}
            ref={localRef}
            className={
                'ligt:border-gray-700 ligt:bg-gray-800 mt-10 w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm ' + className
            }
        >
            <div className="flex">
                <span className="m-4 flex-1 justify-end text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>

                <span className="m-4 justify-start text-sm text-gray-400">{post.quantity} left</span>
            </div>

            <h1 className="flex justify-center p-8 text-xl font-bold">{post.title}</h1>
            <div className="group block overflow-hidden rounded-lg p-4">
                <div className="relative h-[16rem] w-[30rem] sm:h-[25rem] sm:w-[35rem] md:h-[30rem] md:w-[40rem]">
                    <a href={`/posts/show/${post.id}`}>
                        <img
                            src={`/storage/${post.image}`}
                            alt="product image"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                    </a>
                </div>
            </div>

            <div className="px-5 pb-5">
                <h5 className="light:text-white h-[9rem] break-words pl-1 text-xl font-semibold tracking-tight text-gray-900">
                    {post.description.split('').length > 100 ? (
                        <span className="light:text-white text-xl font-bold text-gray-900">
                            {post.description.substring(0, 100)}
                            <span>.... </span>
                            <a className="text-blue-400 transition-all hover:text-blue-800" href={`/posts/show/${post.id}`}>
                                read more
                            </a>
                        </span>
                    ) : (
                        <span className="light:text-white text-2xl font-bold text-gray-900">{post.description}</span>
                    )}

                    {/* {post.description}  */}
                </h5>
                <div className="mt-5 flex items-center justify-between">
                    <span className="light:text-white text-3xl font-bold text-gray-900">{post.price} SEK</span>
                    {!isMyPosts ? (
                        <a
                            href={`/posts/show/${post.id}`}
                            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Visit product
                        </a>
                    ) : (
                        <>
                            <div className="flex gap-3">
                                <a
                                    href={`/posts/edit/${post.id}`}
                                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Edit
                                </a>

                                <button
                                    onClick={handleDelete}
                                    type="submit"
                                    className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

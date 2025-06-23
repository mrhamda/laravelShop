import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const post = props.post || [];
    const user = props.user || [];
    const postUser = props.postUser || [];

    const isMyPost = user.id == post.user_id;

    const existing = JSON.parse(localStorage.getItem(`myItems${user.id}`)) || [];

    const existingItemIndex = existing.findIndex((item) => Number(item.id) === post.id);

    const [amount, setAmount] = useState(existingItemIndex !== -1 ? existing[existingItemIndex]?.quantity || 0 : 0);

    function addToCart() {
        if (amount < post.quantity) {
            const existing = JSON.parse(localStorage.getItem(`myItems${user.id}`)) || [];

            window.dispatchEvent(new Event('storageUpdate'));

            // Try to find if the item already exists
            const existingItemIndex = existing.findIndex((item) => Number(item.id) === post.id);

            if (existingItemIndex === -1) {
                const newItem = {
                    name: post.title,
                    quantity: 1,
                    cost: post.price,
                    img: post.image,
                    id: post.id,
                };

                setAmount(1);

                existing.push(newItem);
            } else {
                existing[existingItemIndex].quantity += 1;
                setAmount((prev) => prev + 1);
            }

            localStorage.setItem(`myItems${user.id}`, JSON.stringify(existing));

            console.log(JSON.parse(localStorage.getItem(`myItems${user.id}`)));
        }
    }

    function decrementCart() {
        const existing = JSON.parse(localStorage.getItem(`myItems${user.id}`)) || [];

        // Find the index of the item
        const existingItemIndex = existing.findIndex((item) => Number(item.id) === post.id);

        // If not found, do nothing
        if (existingItemIndex === -1) return;

        // If quantity is 1, remove the item
        if (existing[existingItemIndex].quantity === 1) {
            existing.splice(existingItemIndex, 1);
            setAmount(0);
        } else {
            // Otherwise, decrement quantity
            existing[existingItemIndex].quantity -= 1;
            setAmount((prev) => prev - 1);
        }

        // Save updated array to localStorage
        localStorage.setItem(`myItems${user.id}`, JSON.stringify(existing));

        window.dispatchEvent(new Event('storageUpdate'));

        console.log(JSON.parse(localStorage.getItem(`myItems${user.id}`)));
    }

    const handleDelete = () => {
        router.delete(`/posts/delete/${post.id}`);
    };

    return (
        <AuthenticatedLayout header={''}>
            {successMessage && (
                <div className="mb-4 mt-4 rounded bg-green-400 p-4 text-xl font-bold text-green-700 opacity-70 shadow">{successMessage}</div>
            )}
            <div className="flex justify-center">
                <div className={'ligt:border-gray-700 ligt:bg-gray-800 sshadow-sm mt-5 w-full max-w-sm rounded-lg border border-gray-200 bg-white'}>
                    <div className="flex">
                        <span className="m-4 flex-1 justify-end text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>

                        <span className="m-4 justify-start text-sm text-gray-400">{post.quantity} left</span>
                    </div>

                    <div className="p-4">
                        <h1 className="text-xl font-bold"> Seller:</h1>

                        <h1 className="inline text-gray-500">
                            <a className="text-blue-400 transition-all hover:text-blue-600" href={`/posts/user/${postUser.id}`}>
                                {postUser.email}
                            </a>
                        </h1>
                    </div>

                    <h1 className="flex justify-center p-8 text-xl font-bold">{post.title}</h1>
                    <a href="#" className="group block overflow-hidden rounded-lg p-4">
                        <div className="relative h-[20rem] w-[30rem] sm:h-[25rem] sm:w-[35rem] md:h-[30rem] md:w-[40rem]">
                            <img
                                src={`/storage/${post.image}`}
                                alt="product image"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            />
                        </div>
                    </a>

                    <div className="px-5 pb-5">
                        <div className="w-full whitespace-normal break-words">
                            <h5 className="light:text-white pl-1 text-xl font-semibold tracking-tight text-gray-900">{post.description}</h5>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <span className="light:text-white text-3xl font-bold text-gray-900">{post.price} SEK</span>

                            {!isMyPost ? (
                                <>
                                    {amount === 0 && (
                                        <a
                                            onClick={() => {
                                                addToCart();
                                                window.dispatchEvent(new Event('storageUpdate'));
                                            }}
                                            className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 hover:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Add to cart
                                        </a>
                                    )}

                                    {amount > 0 && (
                                        <div className="flex gap-5">
                                            <a
                                                onClick={() => {
                                                    decrementCart();
                                                }}
                                                className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 hover:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                -
                                            </a>

                                            <a className="mt-2">{amount}</a>
                                            <a
                                                onClick={() => {
                                                    addToCart();
                                                }}
                                                className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 hover:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                +
                                            </a>
                                        </div>
                                    )}
                                </>
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
            </div>
        </AuthenticatedLayout>
    );
}

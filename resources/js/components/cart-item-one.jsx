import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CartItemOne({ className = '', image, user, children, cost, quantity, name, ...props }) {
    const [isItView, setView] = useState(false);
    const { component } = usePage();
    const { id } = props;

    useEffect(() => {
        setView(component == 'posts/view');
        console.log(isItView);
    }, []);

    function removeItem() {
        const data = JSON.parse(localStorage.getItem(`myItems${user.id}`));

        const index = data.findIndex((x) => x.id == id);

        if (index !== -1) {
            data.splice(index, 1);
            localStorage.setItem(`myItems${user.id}`, JSON.stringify(data));

            window.dispatchEvent(new Event('storageUpdate'));
        }
    }

    async function addToCart() {
        const res = await fetch(`/posts/find/${id}`);
        const data = await res.json();

        const existing = JSON.parse(localStorage.getItem(`myItems${user.id}`)) || [];
        const index = existing.findIndex((item) => Number(item.id) === id);

        if (index === -1) {
            if (data.quantity > 0) {
                existing.push({
                    name: data.title,
                    quantity: 1,
                    cost: data.price,
                    img: data.image,
                    id: data.id,
                });
            }
        } else {
            if (existing[index].quantity < data.quantity) {
                existing[index].quantity += 1;
            }
        }

        localStorage.setItem(`myItems${user.id}`, JSON.stringify(existing));
        window.dispatchEvent(new Event('storageUpdate'));
    }

    function decrementCart() {
        const existing = JSON.parse(localStorage.getItem(`myItems${user.id}`)) || [];

        // Find the index of the item
        const existingItemIndex = existing.findIndex((item) => Number(item.id) === id);

        // If not found, do nothing
        if (existingItemIndex === -1) return;

        // If quantity is 1, remove the item
        if (existing[existingItemIndex].quantity === 1) {
            existing.splice(existingItemIndex, 1);
        } else {
            // Otherwise, decrement quantity
            existing[existingItemIndex].quantity -= 1;
        }

        // Save updated array to localStorage
        localStorage.setItem(`myItems${user.id}`, JSON.stringify(existing));

        window.dispatchEvent(new Event('storageUpdate'));

        console.log(JSON.parse(localStorage.getItem(`myItems${user.id}`)));
    }

    return (
        <li className={'py-3 sm:py-4' + className} {...props}>
            <div className="flex items-center">
                <div className="shrink-0">
                    <img className="h-8 w-8 rounded-full" src={image} alt="Neil image" />
                </div>
                <div className="ms-4 min-w-0 flex-1">
                    <p className="light:text-white truncate text-sm font-medium text-gray-900">{name}</p>

                    {!isItView ? (
                        <p className="light:text-gray-400 truncate text-sm text-gray-500">
                            {quantity} X {cost} SEK
                        </p>
                    ) : (
                        <>
                            <div className="mb-3 flex gap-3">
                                <div className="flex items-center justify-between space-x-4">
                                    <p className="light:text-gray-400 text-sm text-gray-500">
                                        {quantity}st X {cost} SEK
                                    </p>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={decrementCart}
                                            className="rounded-md bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                                        >
                                            −
                                        </button>
                                        <button
                                            onClick={addToCart}
                                            className="rounded-md bg-green-500 px-3 py-1 text-white transition hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="light:text-white mt-2 inline-flex items-center text-base font-semibold text-gray-900">
                    {quantity * cost} SEK
                    <div
                        className="ml-5 flex h-[2rem] w-[2rem] cursor-pointer items-center justify-center bg-red-500 text-white hover:opacity-75"
                        onClick={removeItem}
                    >
                        X
                    </div>
                </div>
            </div>
        </li>
    );
}

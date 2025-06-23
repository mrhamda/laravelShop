import { router } from '@inertiajs/react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput({ type = 'text', transcation, className = '', isFocused = false, ...props }, ref) {
    const localRef = useRef(null);

    const [user, setUser] = useState(null);
    const [estimatedDelievry, setEstimatedDelievry] = useState('2025-06-24');

    const { title, quantity, total, to_user_id, from_user_id, id, created_at } = transcation;

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    async function findUser() {
        const res = await fetch(`/get-user/${to_user_id}`);

        const data = await res.json();

        console.log(data);

        setUser(data.user);
    }

    useEffect(() => {
        findUser();
    }, []);

    async function deleteInfo(id) {
        const res = router.delete(`/soldinfo/${id}`);
    }

    async function findEstimatedDeleiveryTime() {
        try {
            const res = await fetch(
                'https://api2.postnord.com/rest/shipment/v1/deliverycheck.json?fromPostalCode=41118&toPostalCode=11356&countryCode=SE&apikey=YOUR_API_KEY',
            );

            const resJson = await res.json();

            setEstimatedDelievry(resJson.earliestDeliveryDate);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div
            {...props}
            ref={localRef}
            className={
                'relative mt-10 w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm ' +
                'transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800' +
                className
            }
        >
            {/* Remove button */}
            <button
                type="button"
                onClick={() => {
                    deleteInfo(id);
                }}
                className="absolute right-2 top-2 text-gray-400 hover:text-red-600 focus:outline-none"
                aria-label="Remove"
                title="Remove"
            >
                {/* Simple X icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="mb-1 font-semibold text-gray-800 dark:text-gray-200">Title: {title}</div>
            <div className="mb-1 text-gray-700 dark:text-gray-300">Quantity: {quantity}</div>
            {user !== null && <div className="mb-1 text-gray-700 dark:text-gray-300">Pick the item at service point: {user.closestService}</div>}

            <div className="mb-1 text-gray-700 dark:text-gray-300">Bought at: {new Date(created_at).toLocaleDateString()}</div>

            {estimatedDelievry && <div className="mb-1 text-gray-700 dark:text-gray-300">Estimated delievery at: {estimatedDelievry}</div>}

            <div className="mb-3 text-gray-700 dark:text-gray-300">Total: {total} SEK</div>

            {user !== null && (
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>
                        Bought from:{' '}
                        <a
                            href={route('user.about', {
                                id: user.id,
                            })}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {user.name}
                        </a>
                    </span>
                    <img className="h-8 w-8 rounded-full object-cover" src={`/storage/${user.avatar}`} alt={user.name} />
                </div>
            )}
        </div>
    );
});

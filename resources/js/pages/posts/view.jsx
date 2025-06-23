import CartItemOne from '@/components/cart-item-one';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function View() {
    const { props } = usePage();
    const { user, paypalClientId, csrfToken } = props;

    const [myItems, setMyItems] = useState(JSON.parse(localStorage.getItem(`myItems${user.id}`)));

    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const handleStorageUpdate = () => {
            try {
                const theItems = JSON.parse(localStorage.getItem(`myItems${user.id}`));
                setMyItems(theItems || []);
                window.dispatchEvent(new Event('storageUpdate'));
            } catch (error) {
                console.error('Parsing error:', error);
                setMyItems([]);
                window.dispatchEvent(new Event('storageUpdate'));
            }
        };

        window.addEventListener('storageUpdate', handleStorageUpdate);

        return () => window.removeEventListener('storageUpdate', handleStorageUpdate);
    }, []);

    async function clearPosts() {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const res = await fetch('/posts/erase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(myItems || []),

                credentials: 'same-origin',
            });

            // Change window location to this for csrf token  router.visit('/posts/history');

            if (!res.ok) {
                const text = await res.text();
                console.error('Response error:', res.status, text);
                return;
            }

            localStorage.removeItem(`myItems${user.id}`);

            window.dispatchEvent(new Event('storageUpdate'));

            const data = await res.json();
            console.log(data);
            window.location = '/posts/history';
        } catch (e) {
            console.log(e);
            window.location = '/posts/view';
        }
    }

    useEffect(() => {
        setTotalCost(0);

        if (myItems !== null) {
            myItems.forEach((item) => {
                setTotalCost((prev) => (prev += item.cost * item.quantity));
            });
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${props.paypalClientId}&currency=SEK&intent=capture`;
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            window.paypal
                .Buttons({
                    createOrder: async function () {
                        return fetch('/create/' + totalCost)
                            .then((response) => response.text())
                            .then((id) => id);
                    },

                    onApprove: function () {
                        return fetch('/complete', {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            },
                        })
                            .then((response) => response.json())
                            .then((order_details) => {
                                console.log(order_details);
                                clearPosts();

                                document.getElementById('paypal-success').style.display = 'block';
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    },

                    onCancel(data) {
                        console.log('Payment cancelled:', data);
                    },

                    onError(err) {
                        console.error('PayPal error:', err);
                    },
                })
                .render('#payment_options');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [totalCost]);

    // useEffect(() => {
    //     clearPosts();
    // }, []);

    // SEND MAIL JOB NOW TO ONE THAT BOUGHT, FIX THE ADRESS, FIX SO THAT THE OWNER CAN COLLECT THE MONEY
    //ALSO THE CSRF TOKEN IS KINDA OFF

    return (
        <AuthenticatedLayout header={''}>
            {' '}
            {csrfToken !== null && <meta name="csrf-token" content={csrfToken} />}
            <div className="flex h-[100vh] flex-col items-center justify-center space-y-4 overflow-hidden">
                <div className="light:border-gray-700 light:bg-gray-800 h-[40rem] w-full max-w-md overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h5 className="light:text-white text-xl font-bold leading-none text-gray-900">My list</h5>
                    </div>
                    <div className="flow-root list-none">
                        {myItems !== null &&
                            myItems.map((item) => (
                                <CartItemOne
                                    key={item.id}
                                    name={item.name}
                                    image={`/storage/${item.img}`}
                                    cost={item.cost}
                                    quantity={item.quantity}
                                    id={item.id}
                                    user={user}
                                />
                            ))}
                    </div>
                </div>

                {myItems.length !== 0 && (
                    <div className="flex w-full max-w-md flex-col items-center justify-center space-y-4">
                        {/* Success Message */}
                        <span className="text-lg font-bold">Total: {totalCost} SEK</span>
                        <div id="paypal-success" className="hidden w-full rounded bg-green-100 p-4 text-green-800 shadow">
                            You have paid for the items: Check your gmail for more information
                        </div>

                        <div id="payment_options" className="w-full" />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

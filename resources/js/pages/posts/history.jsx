import OneBoughtTrans from '@/components/one-bought-trans';
import OneManagesBought from '@/components/one-manages-bought';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Admin() {
    const { props } = usePage();

    const { boughtInfo, allManages, moneyToCollect } = props;

    const successMessage = props.flash?.success;

    const [transType, setTransType] = useState('sold');

    const emailRef = useRef();

    console.log(moneyToCollect);

    function clickNavBtn(e) {
        const allNavBtns = document.querySelectorAll('.nav-btn');

        allNavBtns.forEach((navBtn) => {
            navBtn.classList.remove('bg-blue-800');
        });

        e.target.classList.add('bg-blue-800');

        setTransType(e.target.getAttribute('content'));
    }

    // sb-wngql31961877@personal.example.com

    async function collectMoney(e) {
        e.preventDefault();

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const res = await fetch('/posts/collectmoney', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ email: emailRef.current.value }), // <-- pass dummy email here
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Server error:', text);
                alert('Error collecting money. Check so that you esntered the correct paypal account');
                return;
            }

            const data = await res.json();
            console.log('Payout response:', data);

            alert('Payout successful!');

            window.location = '/posts/history';
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Network error. Please try again.');
        }
    }

    // FIX SO THAT IT TRANSFERS FROM A TO B

    return (
        <AuthenticatedLayout header={''}>
            {' '}
            {successMessage && <div className="mb-4 mt-4 rounded bg-green-500 p-4 font-bold text-green-700 text-white shadow">{successMessage}</div>}
            <div className="flex h-[100vh] flex-col items-center justify-center space-y-4 overflow-hidden">
                <div className="flex w-[28rem] items-center justify-center gap-3">
                    <button
                        className="nav-btn h-[2rem] w-[7rem] rounded-lg bg-blue-600 bg-blue-800 text-center font-bold text-white transition-all hover:bg-blue-800"
                        onClick={clickNavBtn}
                        content="sold"
                    >
                        Sold
                    </button>
                    <button
                        className="nav-btn h-[2rem] w-[7rem] rounded-lg bg-blue-600 text-center font-bold text-white transition-all hover:bg-blue-800"
                        onClick={clickNavBtn}
                        content="bought"
                    >
                        Bought
                    </button>
                </div>
                <div className="light:border-gray-700 light:bg-gray-800 h-[40rem] w-full max-w-md overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h5 className="light:text-white text-xl font-bold leading-none text-gray-900">Transactions</h5>
                    </div>
                    <div className="flow-root list-none">
                        {transType == 'sold' && (
                            <>
                                <ul>
                                    {allManages.map((item) => (
                                        <li key={Math.random() * 10000}>
                                            <OneManagesBought transcation={item} />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {transType == 'bought' && (
                            <ul>
                                {boughtInfo.map((item) => (
                                    <li key={Math.random() * 10000}>
                                        <OneBoughtTrans transcation={item} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {transType == 'sold' && (
                    <>
                        <div>
                            {Array.isArray(moneyToCollect) && moneyToCollect.length > 0 && moneyToCollect[0].money > 0 && (
                                <>
                                    <div className="mb-5 font-sans text-lg font-bold text-black">Money to collect: {moneyToCollect[0].money} SEK</div>

                                    <form onSubmit={collectMoney} method="post">
                                        <div className="flex w-full flex-col justify-center gap-3">
                                            <label htmlFor="" className="font-bold text-black">
                                                Paypal Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="w-[25rem] rounded-md transition-all hover:bg-slate-300 focus:bg-slate-300"
                                                ref={emailRef}
                                            />

                                            <button
                                                type={'submit'}
                                                className="rounded-md bg-green-400 p-4 text-lg font-bold transition-all hover:opacity-70"
                                            >
                                                Get your money
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

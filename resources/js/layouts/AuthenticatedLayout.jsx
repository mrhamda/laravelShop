import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import CartItem from '@/components/cart-item';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const { component } = usePage();

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const [showCart, setShowCart] = useState(false);

    const avatarName = user.avatar.split('/');

    const lastname = avatarName[avatarName.length - 1];

    const isItView = component == 'posts/view';

    const [myItems, setMyItems] = useState(JSON.parse(localStorage.getItem(`myItems${user.id}`)) || []);

    useEffect(() => {
        const handleStorageUpdate = () => {
            try {
                const theItems = JSON.parse(localStorage.getItem(`myItems${user.id}`));
                setMyItems(theItems || []);
            } catch (error) {
                console.error('Parsing error:', error);
                setMyItems([]);
            }
        };

        window.addEventListener('storageUpdate', handleStorageUpdate);

        return () => window.removeEventListener('storageUpdate', handleStorageUpdate);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                {/* <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link> */}

                                {window.location.pathname === '/' ? (
                                    <a className="text-2xl font-bold text-gray-600">Home page</a>
                                ) : (
                                    <a href="/" className="cursor-pointer text-2xl font-bold text-gray-800 transition-all hover:text-gray-600">
                                        Home page
                                    </a>
                                )}
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex"></div>
                        </div>

                        {!isItView && (
                            <div
                                className="absolute right-10 top-1 mr-5 w-[3rem] cursor-pointer transition-all hover:opacity-70 md:hidden lg:hidden"
                                onClick={() => {
                                    setShowCart(!showCart);
                                }}
                            >
                                <img src="/cart.png " className="w-[5rem]" alt="" />

                                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {myItems.length}
                                </div>
                            </div>
                        )}

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {!isItView && (
                                <div
                                    className="relative mr-5 w-[3rem] cursor-pointer transition-all hover:opacity-70"
                                    onClick={() => {
                                        setShowCart(!showCart);
                                    }}
                                >
                                    <img src="/cart.png" className="w-[5rem]" alt="" />

                                    <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {myItems.length}
                                    </div>
                                </div>
                            )}

                            <div className="ms-3 flex">
                                <div className="pt-2">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <div className="inline-flex items-center space-x-2">
                                                <img
                                                    src={`/storage/avatars/${lastname}`}
                                                    className="h-[3em] w-[3em] cursor-pointer rounded-full hover:opacity-70"
                                                    alt={`${user.name}'s avatar`}
                                                />
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                </button>
                                            </div>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('user.about', [user])} method="get" as="button">
                                                My posts
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('posts.history')} method="get" as="button">
                                                My history
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('user.about', [user])} active={route().current('user.about')}>
                            My posts
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('posts.history', [user])} active={route().current('posts.history')}>
                            My history
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>

                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>
                {showCart && <CartItem user={user} allItems={myItems} />}

                {children}
            </main>
        </div>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    function onSubmit(e) {
        e.preventDefault();
    }

    return (
        <AuthenticatedLayout header={''}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="h[] flex overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="w-[10em] flex-1">
                            <form onSubmit={onSubmit} class="h-[20] max-w-md p-6">
                                <label for="default-search" class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Search
                                </label>
                                <div class="relative">
                                    <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                        <svg
                                            class="h-4 w-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        class="light:border-gray-600 light:bg-gray-700 light:text-white light:placeholder-gray-400 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Search up items"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        class="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 text-gray-900">
                            <button
                                className="rounded-lg bg-blue-500 p-4 text-xl font-bold text-white transition-all hover:bg-blue-600"
                                type="submit"
                            >
                                <Link href={route('posts.create')}>Create post</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

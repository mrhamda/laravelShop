import PostItem from '@/components/post-item';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

export default function About() {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const user = props.postUser || [];
    const authenticatedUser = props.user || [];

    const userPosts = props.posts || [];

    function onSubmit(e) {
        e.preventDefault();
    }

    return (
        <AuthenticatedLayout header={''}>
            <div className="flex justify-center py-10">
                <div>
                    <div className="light:border-gray-700 light:bg-gray-800 relative flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:max-w-xl md:flex-row">
                        <div className="absolute bottom-2 right-5 text-sm text-gray-700">
                            has been since {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <img
                            className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
                            src={`/storage/${user.avatar}`}
                            alt={`${user.name}'s avatar`}
                        />

                        <div className="flex flex-col justify-center p-4 text-center md:text-left">
                            <h2 className="light:text-white text-2xl font-bold text-gray-900">{user.name}</h2>

                            <div className="light:text-gray-400 text-sm text-gray-600">
                                <div className="text-blue-500 transition-all hover:text-blue-700">{user.email}</div>
                            </div>

                            <p className="light:text-gray-300 mt-2 text-base text-gray-700">{user.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            {successMessage && <div className="mb-4 mt-4 rounded bg-green-500 p-4 font-bold text-green-700 text-white shadow">{successMessage}</div>}

            <h1 className="flex justify-center text-xl font-bold">Posts posted by {user.name}</h1>

            <div className="flex justify-center">
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {userPosts.map((element) => (
                        <PostItem key={element.id} post={element} user={authenticatedUser} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

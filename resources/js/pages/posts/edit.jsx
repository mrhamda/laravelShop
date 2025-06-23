import FileInputMe from '@/Components/FileInputMe.jsx';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Textarea } from '@headlessui/react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Edit() {
    const { props } = usePage();

    const successMessage = props.flash?.success;

    const myPost = props.post || [];
    const user = props.user || [];

    const { data, setData, processing, clearErrors, errors, setError, patch, reset } = useForm({
        title: myPost.title,
        price: myPost.price,
        description: myPost.description,
        image: null,
        imageString: myPost.image,
        quantity: myPost.quantity,
    });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('quantity', data.quantity);

        if (data.image == null) {
            formData.append('imageString', data.imageString);

            console.log('IS NULL');
        } else {
            formData.append('image', data.image);

            // FIX WHEN ADDING THE IMG EVERYTHING BECOMES BLANK

            console.log('IS NOT NULL');
            console.log(data.image);
        }

        formData.append('_method', 'patch'); // spoof PATCH method

        router.post(route('posts.update', { id: myPost.id }), formData, {
            forceFormData: true,
            onSuccess: () => console.log('myPost updated!'),
            onError: (e) => {
                setError(e);
            },
        });
    };

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    return (
        <GuestLayout>
            <Head title="Edit" />

            {successMessage && (
                <div className="mb-4 mt-4 rounded bg-green-400 p-4 text-xl font-bold text-green-700 opacity-70 shadow">{successMessage}</div>
            )}
            <form encType="multipart/form-data" onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="title" value="Title" />

                    <TextInput
                        id="title"
                        name="title"
                        value={data.title}
                        className="mt-1 block w-full"
                        autoComplete="title"
                        isFocused={true}
                        onChange={(e) => setData('title', e.target.value)}
                    />
                    {errors != [] && <InputError message={errors.title} className="mt-2" />}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="price" value="Price" />

                    <TextInput
                        id="price"
                        type="number"
                        name="price"
                        value={data.price}
                        className="mt-1 block w-full"
                        autoComplete="price"
                        onChange={(e) => setData('price', e.target.value)}
                    />

                    <InputError message={errors.price} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="quantity" value="Quantity" />

                    <TextInput
                        id="quantity"
                        type="number"
                        name="quantity"
                        value={data.quantity}
                        className="mt-1 block w-full"
                        autoComplete="quantity"
                        onChange={(e) => setData('quantity', e.target.value)}
                    />

                    <InputError message={errors.quantity} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Description" />

                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        className="mt-1 block h-[10rem] w-full rounded-lg border-gray-300"
                        autoComplete="description"
                        onChange={(e) => setData('description', e.target.value)}
                    ></Textarea>

                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="image" value="Image" />

                    <FileInputMe
                        id="image"
                        name="image"
                        value={data.image}
                        className="mt-1 block w-full"
                        autoComplete="image"
                        onChange={(e) => setData('image', e.target.files[0])}
                    />

                    <InputError message={errors.image} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        <a
                            onClick={() => {
                                window.history.back();
                            }}
                        >
                            Go back
                        </a>
                    </PrimaryButton>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Update myPost
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

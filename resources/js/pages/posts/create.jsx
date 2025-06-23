import FileInputMe from '@/Components/FileInputMe.jsx';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Textarea } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        price: 0,
        description: '',
        image: null,
        quantity: 1,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('posts.store'));
    };

    return (
        <GuestLayout>
            <Head title="Create" />

            <form onSubmit={submit}>
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
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
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
                        id="price"
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
                        required
                    ></Textarea>

                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="Image" value="image" />

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

                            type='button'
                        >
                            Go back
                        </a>
                    </PrimaryButton>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Create post
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
